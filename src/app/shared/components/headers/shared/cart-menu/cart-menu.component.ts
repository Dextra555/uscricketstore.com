import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';

import { ModalService } from './../../../../../shared/services/modal.service';
import { ApiService } from './../../../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

declare var $: any;
declare let gtag: Function;
@Component({
  selector: 'molla-cart-menu',
  templateUrl: './cart-menu.component.html',
  styleUrls: ['./cart-menu.component.scss'],
})
export class CartMenuComponent implements OnInit, OnDestroy {
  assetPath = environment.ASSET_PATH;
  cart: any;
  count = 0;
  loggedin = false;
  subscription: any;

  constructor(
    private router: Router,
    public apiService: ApiService,
    public modalService: ModalService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscription = this.apiService.isCartChanged.subscribe(
      (status: boolean) => {
        if (status) {
          this.getCart();
        }
      }
    );
    this.getCart();
    this.laravelEcho();
  }

  laravelEcho(){
    Pusher.logToConsole = false;

    const pusher = new Pusher('e6d31344e21c3d7adbe9', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('cart');
    channel.bind('cart-changed', (data:any) => {
      let temp_user_id = localStorage.getItem('temp_user_id') || '';
      console.log('yes', data);
      if(data.user == temp_user_id){
        this.apiService.cartChanged(true);
        this.toastrService.error(data.message);
      }
    });
  }

  getCart() {
    if (!localStorage.getItem('currentUser')) {
      this.loggedin = false;
    } else {
      this.loggedin = true;
    }
    this.apiService.getCart().subscribe(
      (result) => {
        if (result.success) {
          //this.toastrService.success(result.message);
          this.cart = result.cart_items.data;

          this.count = result.cart_items.data.length;

          $('.cart-counter').html(
            '<span class="cart-count">' + this.count + '</span>'
          );
        }
      },
      (error) => {}
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // removeFromCart(event: Event, product: any) {
  // 	event.preventDefault();
  // 	this.cartService.removeFromCart(product);
  // }

  // navigate(slug){
  // 	this.router.navigate(['/product/'+slug]);
  // }

  checkout() {
    this.cart.forEach((item) => {
      if (item.booked_slots) {
        this.router.navigate(['/checkout'], {
          queryParams: { product_type: 'lane' },
        });
      } else {
        this.router.navigate(['/checkout'], {
          queryParams: { product_type: 'product' },
        });
      }
    });
  }

  navigate(product) {
    this.sendGA4EventSelect(product);
    const productAddons = product.product_addons;
    const addonIds = productAddons.map((addon) => addon.id);
    if (addonIds.length > 0) {
      this.router.navigate(['/product/' + product.slug], {
        queryParams: {
          addons: addonIds.join(','),
        },
      });
    } else {
      this.router.navigate(['/product/' + product.slug]);
    }
  }

  addOnTotal(item) {
    let sum1 = 0;
    // if(this.cart){
    // 	for(let item of this.cart){
    if (item.dicounted_price) {
      sum1 += parseFloat(item.dicounted_price);
    } else {
      sum1 += parseFloat(item.regular_price);
    }
    for (let item1 of item.product_addons) {
      sum1 += parseFloat(item1.price);
    }
    // 	}
    // }
    return sum1;
  }

  // addOnGrandTotal() {
  // 	let sum1=0;
  // 	if(this.cart){
  // 		for(let item of this.cart){
  // 			if(item.dicounted_price){
  // 				sum1+=parseFloat(item.dicounted_price)
  // 			}else{
  // 				sum1+=parseFloat(item.regular_price)
  // 			}
  // 			for(let item1 of item.product_addons){
  // 				sum1+=parseFloat(item1.price);
  // 			}
  // 		}
  // 	}
  // 	return sum1;

  // }

  total() {
    let sum = 0;
    if (this.cart) {
      for (let item of this.cart) {
        if (item.product_type == 'lane') {
          sum += item.lane_price;
        } else {
          if (item.dicounted_price) {
            sum += item.qty * parseFloat(item.dicounted_price);
          } else {
            sum += item.qty * parseFloat(item.regular_price);
          }
          for (let item1 of item.product_addons) {
            sum += item.qty * parseFloat(item1.price);
          }
        }
      }
    }
    return sum;
  }

  removeFromCart(product) {
    this.apiService.removeFromoCart(product.cart_id).subscribe((result) => {
      if (result.success) {
        this.sendGA4EventRemoveCart(product, true);
        this.toastrService.success(result.message);
        this.apiService.cartChanged(true);
      } else {
        this.toastrService.error(result.message);
      }
    });
  }

  isOutofStock(product) {
    if (product.product_type != 'lane' && product.stock == 0) {
      return 1;
    } else if (product.product_type != 'lane' && product.inventory <= 0) {
      return 1;
    } else if (product.product_type == 'lane') {
      for (let item of product.slotDetails) {
        if (item.is_available == '0') {
          return 1;
        } else if (item.inventory <= 0) {
          return 1;
        }
      }
    }

    return 0;
  }

  sendGA4EventRemoveCart(item:any, all=false) {
    const qty = (all)?item.qty:1
    let addons = item.product_addons?.map(function(addon:any) {
      return addon.name;
    }).join(', ');
    let slots = item.slotDetails?.map(function(slot:any) {
      return `${slot.slot_start_time} - ${slot.slot_end_time}`;
    }).join(', ');
    const combinations = JSON.stringify(item.combinations) || "";
    const tempItem = {
      item_id: item.product.id,
      item_slug: item.product.slug,
      item_name: item.name,
      item_type: item.product.product_type,
      // item_category: item.product.product_type,
      quantity: (item.product.product_type !== 'lane')?qty:1,
      price: (item.product.product_type !== 'lane')?this.addOnTotal(item).toFixed(2):item.lane_price.toFixed(2),
      total_price: (item.product.product_type !== 'lane')?(qty * this.addOnTotal(item)).toFixed(2):item.lane_price.toFixed(2),
      addons: addons,
      item_combinations: combinations,
      booking_date: item.booking_date,
      members: (item.product.product_type !== 'lane')?0:item.qty,
      booked_slots: slots
    };
    console.log('innnnn', tempItem);
    // gtag('event', 'remove_from_cart', null);
    gtag('event', 'remove_from_cart', {
      event_name: "remove_from_cart",
      currency: "USD",
      value: tempItem.total_price,
      items: [
        tempItem
      ]
    });
  }

  sendGA4EventSelect(item:any) {
    const tempItem = {
      item_id: item.product_id,
      item_slug: item.slug,
      item_name: item.name,
      item_type: item.product_type,
      stock: item.stock,
      price: (item.dicounted_price).toFixed(2),
      discounted_price: (item.dicounted_price).toFixed(2),
    };
    // gtag('event', 'select_item', null);
    gtag('event', 'select_item', {
      event_name: "select_item",
      currency: "USD",
      value: (item.dicounted_price).toFixed(2),
      items: [
        tempItem
      ]
    });
  }

}
