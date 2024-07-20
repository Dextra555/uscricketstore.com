import { Component, OnInit, HostListener, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../shared/services/api.service';
import { UtilsService } from '../../../shared/services/utils.service';
import { combineLatest, Subscription } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

declare let gtag: any;

@Component({
  selector: 'shop-sidebar-page',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarPageComponent implements OnInit, OnDestroy {
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
  parentCategory:any = {};
  attributes = [];
  currentCat:any = {};
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
  metaData: any;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public utilsService: UtilsService,
    public apiService: ApiService,
    private spinner: NgxUiLoaderService,
    private renderer: Renderer2,
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.getAllCategories();
    if (this.subscriptionroute) {
      this.subscriptionroute.unsubscribe();
    }
  }

  loadProducts() {
    this.spinner.start();
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

  getCategoryMeta(slug) {
    this.apiService.getCategoryMeta(slug).subscribe((result) => {
      if (result.success) {
        this.metaData = result.data?.meta;
        this.setMetaTags();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionprod) {
      this.subscriptionprod.unsubscribe();
    }
    if (this.subscriptionroute) {
      this.subscriptionroute.unsubscribe();
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
              // console.log('promo', this.slug, result.products.data);
              this.sendGA4Event("view_item_list", result.products.data);
              if(this.slug === 'offer-35yzh'){
                this.sendGA4Event("view_promotion", result.products.data);
              }

              this.loaded = true;
              if (!this.firstLoad) this.firstLoad = true;

              this.apiService
                .fetchShopData(newparams, this.perPage, 'product/searchPrices')
                .subscribe((result) => {
                  this.minPrice = result.lowest;
                  this.maxPrice = result.highest;
                });
              this.spinner.stop();
            });
        } else {
          this.loaded = true;
          this.firstLoad = true;
          this.spinner.start();
        }
      },
      (err) => {
        this.loaded = true;
        this.spinner.stop();
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
            this.sendGA4Event("view_item_list", result.products.data);
            if(this.slug === 'offer-35yzh'){
              this.sendGA4Event("view_promotion", result.products.data);
            }

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
    this.activeRoute.params.subscribe(params => {
      const slug = params['slug'];
      if(slug)
        this.getCategoryMeta(slug);
    });
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

  setMetaTags() {
    if (this.metaData) {
      this.meta.removeTag('name="keywords"');
      this.title.setTitle(this.metaData?.metaTitle);
      this.meta.updateTag({ name: 'description', content: this.metaData.metaDescription });
      this.meta.updateTag({ property: 'og:title', content: this.metaData.metaTitle });
      this.meta.updateTag({ property: 'og:description', content: this.metaData.metaDescription });
      this.meta.updateTag({ property: 'og:image', content: this.metaData.metaImage });
      this.meta.updateTag({ property: 'og:url', content: this.document.URL });
      this.meta.updateTag({ name: 'twitter:title', content: this.metaData.metaTitle });
      this.meta.updateTag({ name: 'twitter:description', content: this.metaData.metaDescription });
      this.meta.updateTag({ name: 'twitter:image', content: this.metaData.metaImage });
      const existingCanonicalElement = this.document.querySelector('link[rel="canonical"]');
      if (existingCanonicalElement) {
        this.renderer.setAttribute(existingCanonicalElement, 'href', `${environment.BASE_URL}${this.router.url}`);
      }
    }
  }

  sendGA4Event(enent_name:string, products:any = []){
    // Initialize an array to store the tempItem objects
    const tempItems: any[] = [];

    // Assuming this.products is an array of products
    products.forEach((item: any) => {
      // let addons = "";

      // Assuming you need to process combinations and convert it to a string
      // const combinations = JSON.stringify(item.combinations) || "";

      // Create the tempItem object for the current item
      const tempItem = {
        item_id: item.id,
        item_slug: item.slug,
        item_name: item.name,
        item_type: item.product_type,
        item_category: this.currentCat?.name,
        stock: item.stock,
        price: (item.base_price).toFixed(2),
        discounted_price: (item.base_discounted_price).toFixed(2),
        // addons: addons,
        // item_combinations: combinations,
      };

      tempItems.push(tempItem);
    });

    // gtag('event', enent_name, null);
    gtag('event', enent_name, {
      event_name: enent_name,
      currency: "USD",
      item_list_name: (enent_name === 'view_promotion')?'Clearance Sale':`${this.currentCat.name} category products page - ${this.currentPage || 1}`,
      items: tempItems
    });
  }

}
