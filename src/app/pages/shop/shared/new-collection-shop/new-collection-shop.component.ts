import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './../../../../shared/services/api.service';
import { ModalService } from './../../../../shared/services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';

import { newSlider } from '../../../home/data';
import { NetworkErrorService } from './../../../../shared/services/network-error.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


declare let gtag: Function;

@Component({
  selector: 'molla-new-collection-shop',
  templateUrl: './new-collection-shop.component.html',
  styleUrls: ['./new-collection-shop.component.scss'],
})
export class NewCollectionShopComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  @Input() products = [];
  @Input() loaded = false;
  @Input() totalCount = 0;
  @Input() wishEvent = false;
  @Output() scrolled = new EventEmitter();

  newSlider = newSlider;
  currentUrl: string;

  constructor(
    public router: Router,
    public apiService: ApiService,
    private activeRoute: ActivatedRoute,
    private toastrService: ToastrService,
    public modalService: ModalService,
    public networkErrorService: NetworkErrorService,
    private spinner: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
  }

  navigate(product:any) {
    this.sendGA4EventSelect(product);
    this.router.navigate(['/product/' + product.slug]);
  }

  quickView(product, loaded) {
    this.spinner.start();
    this.sendGA4EventSelect(product);
    this.modalService.showQuickViewInnerModal(product, loaded);
  }

  addToWish(product) {
    this.spinner.start();
    if (!localStorage.getItem('currentUser')) {
      this.modalService.showLoginModal();
      this.spinner.stop();
    } else {
      this.apiService.addToWish(product.id).subscribe((result) => {
        if (result.success) {
          this.toastrService.success(result.message);
          product.wishlisted = 1;
          this.apiService.wishChanged(true);
          this.sendGA4EventWishlist(product);
        } else {
          product.toastrService.error(result.message, 'Error');
          this.spinner.stop();
        }
        this.spinner.stop();
      });
    }
  }

  removeFromWish(product) {
    this.spinner.start();
    if (!localStorage.getItem('currentUser')) {
      this.modalService.showLoginModal();
      this.spinner.stop();
    } else {
      this.apiService.removeFromoWish(product.id).subscribe((result) => {
        if (result.success) {
          this.toastrService.success(result.message);
          this.products = this.products.filter((prod) => {
            return prod.id != product.id;
          });
          this.apiService.wishChanged(true);
          product.wishlisted = 0;
          // if (this.wishEvent) {
          //   this.products = this.products.filter((prod) => {
          //     return prod.id != product.id;
          //   });
          // }
        } else {
          this.toastrService.error(result.message);
          this.spinner.stop();
        }
        this.spinner.stop();
      });
    }
  }

  async addToCart(product) {
    this.spinner.start();
    if (!(await this.networkErrorService.checkNetworkStatus())) {
      product.loading = false;
      this.toastrService.error('Your system is not connected with Internet');
      this.spinner.stop();
    } else {
      let variation = 0;
      if (product.is_variant && parseInt(product.is_variant) !== 0) {
        this.quickView(product, true);
        return true;
      } else {
        variation = product?.variations[0]?.id;
      }
      product.loading = true;
      let temp_user_id = '';
      if (localStorage.getItem('temp_user_id')) {
        temp_user_id = localStorage.getItem('temp_user_id');
      }
      let addons = [];
      this.apiService
        .addToCart(1, temp_user_id, variation, addons)
        .subscribe((result) => {
          if (result.success) {
            this.toastrService.success(result.message);
            if (this.currentUrl == '/wishlist') {
              this.removeFromWish(product);
              this.apiService.wishChanged(true);
            }
            this.apiService.cartChanged(true);
            this.sendGA4Event(product);
          } else {
            this.toastrService.error(result.message);
            this.spinner.stop();
          }
          product.loading = false;
          this.spinner.stop();
        });
    }
    return true;
  }

  sendGA4Event(item:any){
    let addons = "";
    const tempItem = {
      item_id: item.id,
      item_slug: item.slug,
      item_name: item.name,
      item_type: item.product_type,
      // item_category: item.product.product_type,
      quantity: 1,
      stock: item.stock,
      price: (item.base_price).toFixed(2),
      discounted_price: (item.base_discounted_price).toFixed(2),
      total_price: (item.base_discounted_price * 1).toFixed(2),
      addons: addons,
      // item_combinations: combinations,
      // booking_date: item.booking_date,
      // members: (item.product_type !== 'lane')?0:item.qty,
      // booked_slots: slots
    };
    // gtag('event', 'add_to_cart', null);
    gtag('event', 'add_to_cart', {
      event_name: "add_to_cart",
      currency: "USD",
      value: (item.base_discounted_price).toFixed(2),
      items: [
        tempItem
      ]
    });
  }

  sendGA4EventWishlist(item:any) {
    const tempItem = {
      item_id: item.id,
      item_slug: item.slug,
      item_name: item.name,
      item_type: item.product_type,
      stock: item.stock,
      price: (item.base_price).toFixed(2),
      discounted_price: (item.base_discounted_price).toFixed(2),
    };
    gtag('event', 'add_to_wishlist', null);
    gtag('event', 'add_to_wishlist', {
      event_name: "add_to_wishlist",
      currency: "USD",
      value: (item.base_discounted_price).toFixed(2),
      items: [
        tempItem
      ]
    });
  }

  sendGA4EventSelect(item:any) {
    const tempItem = {
      item_id: item.id,
      item_slug: item.slug,
      item_name: item.name,
      item_type: item.product_type,
      stock: item.stock,
      price: (item.base_price).toFixed(2),
      discounted_price: (item.base_discounted_price).toFixed(2),
    };

    // gtag('event', 'select_item', null);
    gtag('event', 'select_item', {
      event_name: "select_item",
      currency: "USD",
      value: (item.base_discounted_price).toFixed(2),
      // item_list_name: `From ${this.currentCat.name} category products page - ${this.currentPage || 1}`,
      items: [
        tempItem
      ]
    });
  }

  loadItems(){
    if(this.totalCount > this.products.length){
      // console.log('innnnn loadItems');
      this.scrolled.emit(true);
    }
  }
}
