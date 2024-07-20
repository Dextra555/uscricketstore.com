import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { ApiService } from 'src/app/shared/services/api.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { combineLatest, Subscription } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'molla-clearance-sale',
  templateUrl: './clearance-sale.component.html',
  styleUrls: ['./clearance-sale.component.scss'],
})
export class ClearanceSaleComponent implements OnInit {
  private timer: any;
  private delaySearch: boolean = true;
  products = [];
  perPage = 21;
  currentPage = 1;
  type = 'list';
  slug = '';
  totalCount = 0;
  totalPages = 0;
  keyword = '';
  searchedCat = '';
  orderBy = 'default';
  pageTitle = 'List';
  toggle = false;
  searchTerm = '';
  categories = [];
  suggestions = [];
  AllCategories = [];
  childCategories = [];
  parentCategory = {};
  attributes = [];
  currentCat = {};
  brands = [];
  loaded = false;
  firstLoad = false;
  subscription: any;
  showmoreloading = false;
  shopData = { categories: [], brands: [], attributes: [] };
  gettingdata = false;
  subscriptionprod = new Subscription();
  subscriptionroute = new Subscription();
  urlParametrs = null;
  minPrice = 0;
  maxPrice = 0;
  totalProducts = 0;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public utilsService: UtilsService,
    public apiService: ApiService,
    private spinner: NgxUiLoaderService
  ) {
    this.getAllCategories();
    if (this.subscriptionroute) {
      this.subscriptionroute.unsubscribe();
    }
  }

  loadProducts() {
    // this.spinner.start();
    this.urlParametrs = combineLatest(
      this.activeRoute.params,
      this.activeRoute.queryParams,
      (params, queryParams) => ({
        ...params,
        ...queryParams,
      })
    );

    this.getData();
  }

  getSelectedCat($event) {
    if ($event?.slug) {
      this.searchedCat = $event.slug;
    } else {
      this.searchedCat = '';
    }
  }

  search() {
    if (this.searchedCat != '') {
      this.router.navigate(['/category/' + this.searchedCat], {
        queryParams: { keyword: this.keyword, page: 1 },
      });
    } else {
      this.router.navigate(['/category'], {
        queryParams: { keyword: this.keyword, page: 1 },
      });
    }
  }

  getAllCategories() {
    this.apiService.getAllCategories().subscribe((result) => {
      if (result.success) {
        this.AllCategories = result.data;
      }
    });
  }
  ngOnDestroy(): void {
    if (this.subscriptionprod) {
      this.subscriptionprod.unsubscribe();
    }
    if (this.subscriptionroute) {
      this.subscriptionprod.unsubscribe();
    }
  }

  getData(): void {
    if (this.subscriptionprod) {
      this.subscriptionprod.unsubscribe();
    }
    this.subscriptionprod = this.urlParametrs.subscribe(
      (params) => {
        let newparams = Object.assign([], params);
        this.loaded = false;
        this.slug = params['slug'];
        if (params['searchTerm']) {
          this.searchTerm = params['searchTerm'];
        } else {
          this.searchTerm = '';
        }

        if (params['keyword']) {
          this.keyword = params['keyword'];
        }

        if (params['orderBy']) {
          this.orderBy = params['orderBy'];
        } else {
          this.orderBy = 'popular';
        }

        if (this.slug) {
          newparams['category_slug'] = this.slug;
        } else {
          newparams['category_slug'] = '';
        }

        if (!this.gettingdata && Object.keys(params).length > 0) {
          this.gettingdata = true;
          this.apiService
            .fetchShopData(newparams, this.perPage, 'product/search')
            .subscribe((result) => {
              this.gettingdata = false;
              this.products = result.products.data;
              this.totalProducts = result.total;

              this.totalCount = result.total;
              this.totalPages = result.totalPage;
              this.categories = result.rootCategories.data;
              this.currentPage = result.currentPage;

              this.childCategories = result.childCategories?.data
                ? result.childCategories?.data
                : [];
              this.currentCat = result.currentCategory
                ? result.currentCategory
                : {};
              this.parentCategory = result.parentCategory
                ? result.parentCategory
                : {};
              this.brands = result.allBrands.data;
              if (!this.slug) {
                this.shopData.categories = this.categories;
              } else {
                this.shopData.categories = this.childCategories;
              }
              this.shopData.brands = this.brands;

              this.attributes = result.attributes.data;
              this.shopData.attributes = this.attributes;

              this.loaded = true;
              if (!this.firstLoad) this.firstLoad = true;

              this.apiService
                .fetchShopData(newparams, this.perPage, 'product/searchPrices')
                .subscribe((result) => {
                  this.minPrice = result.lowest;
                  this.maxPrice = result.highest;
                });
              // this.spinner.stop();
            });
        } else {
          this.loaded = true;
          this.firstLoad = true;
          // this.spinner.start();
        }
      },
      (err) => {
        this.loaded = true;
        // this.spinner.stop();
      }
    );
    this.subscriptionprod.unsubscribe();
  }

  searchChanged(e: any) {
    this.keyword = e.target.value;

    if (this.delaySearch) {
      // if there is already a timer running... then stop it
      if (this.timer) {
        clearTimeout(this.timer);
      }

      // trigger the search action after 400 millis
      this.timer = setTimeout(() => {
        this.autoComplete(e.target.value);
      }, 500);
    } else
      setTimeout(() => {
        this.autoComplete(e.target.value);
      });
  }

  autoComplete(value) {
    let newparams = [];

    if (value && value.length > 0) {
      newparams['keyword'] = value;

      if (this.searchedCat) {
        newparams['category_slug'] = this.searchedCat;
      } else {
        newparams['category_slug'] = '';
      }
      this.apiService
        .fetchShopData(newparams, this.perPage, 'product/autocomplete')
        .subscribe((result) => {
          this.suggestions = result.products.data;
        });
    }
  }

  loadMoreData(): void {
    if (!this.showmoreloading) {
      this.showmoreloading = true;
      if (this.subscriptionprod) {
        this.subscriptionprod.unsubscribe();
      }
      this.subscriptionprod = this.urlParametrs.subscribe((params) => {
        let newparams = Object.assign([], params);
        this.slug = params['slug'];

        if (params['searchTerm']) {
          this.searchTerm = params['searchTerm'];
        } else {
          this.searchTerm = '';
        }

        if (params['orderBy']) {
          this.orderBy = params['orderBy'];
        } else {
          this.orderBy = 'popular';
        }

        if (this.slug) {
          newparams['category_slug'] = this.slug;
        } else {
          newparams['category_slug'] = '';
        }
        newparams['page'] = this.currentPage + 1;
        this.apiService
          .fetchShopData(newparams, this.perPage, 'product/search')
          .subscribe((result) => {
            this.products = [...this.products, ...result.products.data];
            this.currentPage = result.currentPage;

            this.showmoreloading = false;

            if (!this.firstLoad) {
              this.firstLoad = true;
            }
          });
      });
      this.subscriptionprod.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.subscriptionroute = this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        startWith(this.router)
      )
      .subscribe((event) => {
        this.loadProducts();
      });

    this.toggle = window.innerWidth < 991;
  }

  @HostListener('window: resize', ['$event'])
  onResize(event: Event) {
    this.toggle = window.innerWidth < 991;
  }

  changeOrderBy(event: any) {
    this.router.navigate([], {
      queryParams: { sort_by: event.currentTarget.value, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  toggleSidebar() {
    if (
      document.querySelector('body').classList.contains('sidebar-filter-active')
    )
      document.querySelector('body').classList.remove('sidebar-filter-active');
    else document.querySelector('body').classList.add('sidebar-filter-active');
  }

  hideSidebar() {
    document.querySelector('body').classList.remove('sidebar-filter-active');
  }
}
