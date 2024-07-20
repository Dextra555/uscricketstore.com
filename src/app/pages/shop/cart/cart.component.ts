import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';

import { ModalService } from './../../../shared/services/modal.service';
import { ApiService } from './../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

import { CartService } from './../../../shared/services/cart.service';

import { environment } from './../../../../environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
declare let gtag: Function;

@Component({
  selector: 'shop-cart-page',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  assetPath = environment.ASSET_PATH;
  cartItems: any;
  count = 0;
  loggedin = false;
  subscription: any;
  SERVER_URL = environment.SERVER_URL;
  shippingCost = 0;
  coupon = '';
  couponApplied = false;
  appliedDiscount = 0;
  coupon_details: any;
  applyingCoupon = false;
  AllCategories = [];

  private subscr: Subscription;
  qtyChange: boolean = false;

  constructor(
    private store: Store<any>,
    public cartService: CartService,
    private router: Router,
    public apiService: ApiService,
    public modalService: ModalService,
    private toastrService: ToastrService,
    private spinner: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.spinner.start();
    this.subscription = this.apiService.isCartChanged.subscribe(
      (status: boolean) => {
        if (status) {
          this.getCart();
        }
      }
    );
    this.getCart();
    this.getAllCategories();
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
          this.cartItems = result.cart_items.data;
          console.log(this.cartItems);
          this.sendGA4Event();
          this.count = result.cart_items.data.length;
          this.coupon_details = JSON.parse(
            localStorage.getItem('appliedCoupon')
          );
          if (this.coupon_details) {
            this.coupon = this.coupon_details.coupon;
          }
          if (this.appliedDiscount > 0 || this.coupon_details) {
            this.applyCoupon(true);
          }
        }
        this.spinner.stop();
      },
      (error) => {}
    );
  }

  getAllCategories() {
    this.apiService.getAllCategories().subscribe((result) => {
      if (result.success) {
        this.AllCategories = result.data;
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  itemTotal(item) {
    let sum1 = 0;
    if (item.dicounted_price) {
      sum1 += parseFloat(item.dicounted_price);
    } else {
      sum1 += parseFloat(item.regular_price);
    }
    for (let item1 of item.product_addons) {
      sum1 += parseFloat(item1.price);
    }
    return sum1;
  }

  // addOnTotal() {
  // 	let sum1=0;
  // 	if(this.cartItems){
  // 		for(let item of this.cartItems){
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

  onChangeCoupon($event) {
    this.coupon = $event.target.value;
  }

  total() {
    let sum = 0;
    if (this.cartItems) {
      for (let item of this.cartItems) {
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
    sum = sum - this.totalTax();
    return sum;
  }

  totalTax() {
    let sum = 0;
    if (this.cartItems) {
      for (let item of this.cartItems) {
        if (item.product_type == 'lane') {
          if (item.product.subtype == 'regular') {
            sum += item.tax; //item.qty * item.tax;
          } else {
            sum += item.tax; //item.qty * item.tax;
          }
        } else {
          sum += item.qty * item.tax;
        }
      }
    }
    return sum;
  }

  applyCoupon(hidemsg = false) {
    if (this.applyingCoupon == false) {
      if (this.coupon == '') {
        this.toastrService.error('The Coupon is Invalid');
        return;
      }
      if (!localStorage.getItem('currentUser')) {
        this.modalService.showLoginModal();
        return;
      }
      let itemids = [];
      this.applyingCoupon = true;
      itemids = this.cartItems.map(({ cart_id }) => cart_id);
      this.apiService.applyCoupon(itemids, this.coupon).subscribe((result) => {
        if (result.success) {
          this.couponApplied = true;
          this.coupon_details = result.coupon_details;
          this.coupon_details.coupon = this.coupon;
          localStorage.setItem(
            'appliedCoupon',
            JSON.stringify(this.coupon_details)
          );
          if (!hidemsg) {
            this.toastrService.success(result.message);
          }
          if (this.coupon_details.coupon_type == 'product_base') {
            let newCartItems = this.cartItems.filter((item) => {
              let found = this.coupon_details.conditions.filter(
                (item1) => item1.product_id == item.product_id
              );
              return found.length > 0 ? true : false;
            });

            if (this.coupon_details.discount_type == 'percent') {
              let totalfordiscount = 0;
              for (let item of newCartItems) {
                if (item.product_type == 'lane') {
                  totalfordiscount += item.lane_price;
                } else {
                  if (item.dicounted_price) {
                    totalfordiscount +=
                      item.qty * parseFloat(item.dicounted_price);
                  } else {
                    totalfordiscount +=
                      item.qty * parseFloat(item.regular_price);
                  }
                }
                // for(let item1 of item.product_addons){
                // 	totalfordiscount+=item.qty * parseFloat(item1.price);
                // }
                //totalfordiscount+=item.qty * item.tax
              }
              this.appliedDiscount = parseFloat(
                (
                  totalfordiscount *
                  (this.coupon_details.discount / 100)
                ).toFixed(2)
              );
            } else {
              let totaldiscount = 0;
              for (let item of newCartItems) {
                let itemtotal = 0;
                if (item.product_type == 'lane') {
                  itemtotal += item.lane_price;

                  if (itemtotal > this.coupon_details.discount) {
                    if (item.product.subtype == 'regular') {
                      totaldiscount +=
                        (item.qty - 1) * this.coupon_details.discount;
                    } else {
                      totaldiscount += item.qty * this.coupon_details.discount;
                    }
                  } else {
                    if (item.product.subtype == 'regular') {
                      totaldiscount += (item.qty - 1) * itemtotal;
                    } else {
                      totaldiscount += item.qty * itemtotal;
                    }
                  }
                } else {
                  if (item.dicounted_price) {
                    itemtotal += parseFloat(item.dicounted_price);
                    //+ parseFloat(item.tax);
                    // for(let item1 of item.product_addons){
                    // 	itemtotal+=parseFloat(item1.price);
                    // }
                  } else {
                    itemtotal += parseFloat(item.regular_price);
                    //+ parseFloat(item.tax);
                    // for(let item1 of item.product_addons){
                    // 	itemtotal+=parseFloat(item1.price);
                    // }
                  }

                  if (itemtotal > this.coupon_details.discount) {
                    totaldiscount += item.qty * this.coupon_details.discount;
                  } else {
                    totaldiscount += item.qty * itemtotal;
                  }
                }
              }
              this.appliedDiscount = totaldiscount;
            }
          } else {
            if (this.coupon_details.discount_type == 'percent') {
              this.appliedDiscount = parseFloat(
                (
                  (this.total() + this.totalTax()) *
                  (this.coupon_details.discount / 100)
                ).toFixed(2)
              );

              if (
                this.coupon_details.max_discount > 0 &&
                this.coupon_details.max_discount < this.appliedDiscount
              ) {
                this.appliedDiscount = this.coupon_details.max_discount;
              }
            } else {
              this.appliedDiscount = this.coupon_details.discount;
            }
          }
        } else {
          localStorage.removeItem('appliedCoupon');
          this.coupon_details = null;
          this.appliedDiscount = 0;
          this.couponApplied = false;
          this.toastrService.error(result.message);
        }

        this.applyingCoupon = false;
      });
    }
  }

  removeCoupon() {
    localStorage.removeItem('appliedCoupon');
    this.appliedDiscount = 0;
    this.couponApplied = false;
    this.coupon = '';
    this.coupon_details = null;
  }

  removeFromCart(product) {
    this.spinner.start();
    this.apiService.removeFromoCart(product.cart_id).subscribe((result) => {
      if (result.success) {
        this.sendGA4EventRemoveCart(product, true);
        this.toastrService.success(result.message);
        this.apiService.cartChanged(true);
      } else {
        this.toastrService.error(result.message);
        this.spinner.stop();
      }
      this.spinner.stop();
    });
  }

  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.slug;
  }

  checkout() {
    this.cartItems.forEach((item) => {
      console.log(item.booked_slots);
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

  updateCart(event: any) {
    event.preventDefault();
    event.target.parentElement
      .querySelector('.icon-refresh')
      .classList.add('load-more-rotating');

    // setTimeout(() => {
    // 	this.cartService.updateCart(this.cartItems);
    // 	event.target.parentElement.querySelector('.icon-refresh').classList.remove('load-more-rotating');
    // 	document.querySelector('.btn-cart-update:not(.diabled)') && document.querySelector('.btn-cart-update').classList.add('disabled');
    // }, 400);
  }

  changeShipping(value: number) {
    this.shippingCost = value;
  }

  onChangeQty(type, product: any) {
    // this.spinner.start();
    this.qtyChange = true;
    document.querySelector('.btn-cart-update.disabled') &&
      document
        .querySelector('.btn-cart-update.disabled')
        .classList.remove('disabled');

    this.apiService
      .changeCartQtyt(product.cart_id, type)
      .subscribe((result) => {
        if (result.success) {
          if(type === 'plus'){
            this.sendGA4EventAddCart(product);
          }
          else{
            this.sendGA4EventRemoveCart(product);
          }
          this.toastrService.success(result.message);
          this.apiService.cartChanged(true);
        } else {
          this.toastrService.error(result.message);
          // this.spinner.stop();
          this.qtyChange = false;
        }
        // this.spinner.stop();
        this.qtyChange = false;
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

  sendGA4Event() {
    let items = []; let val = 0;
    for(let item of this.cartItems){
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
        quantity: (item.product.product_type !== 'lane')?item.qty:1,
        price: (item.product.product_type !== 'lane')?this.itemTotal(item).toFixed(2):item.lane_price.toFixed(2),
        total_price: (item.product.product_type !== 'lane')?(item.qty * this.itemTotal(item)).toFixed(2):item.lane_price.toFixed(2),
        addons: addons,
        item_combinations: combinations,
        booking_date: item.booking_date,
        members: (item.product.product_type !== 'lane')?0:item.qty,
        booked_slots: slots
      };
      val += tempItem.total_price;
      items.push(tempItem);
    }
    // gtag("event", "view_cart", null);
    gtag("event", "view_cart", {
      event_name: "view_cart",
      currency: "USD",
      value: val,
      items: items
    });
  }

  sendGA4EventAddCart(item:any) {
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
      quantity: (item.product.product_type !== 'lane')?1:1,
      price: (item.product.product_type !== 'lane')?this.itemTotal(item).toFixed(2):item.lane_price.toFixed(2),
      total_price: (item.product.product_type !== 'lane')?(1 * this.itemTotal(item)).toFixed(2):item.lane_price.toFixed(2),
      addons: addons,
      item_combinations: combinations,
      booking_date: item.booking_date,
      members: (item.product.product_type !== 'lane')?0:item.qty,
      booked_slots: slots
    };
    // gtag('event', 'add_to_cart', null);
    gtag('event', 'add_to_cart', {
      event_name: "add_to_cart",
      currency: "USD",
      value: tempItem.total_price,
      items: [
        tempItem
      ]
    });
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
      price: (item.product.product_type !== 'lane')?this.itemTotal(item).toFixed(2):item.lane_price.toFixed(2),
      total_price: (item.product.product_type !== 'lane')?(qty * this.itemTotal(item)).toFixed(2):item.lane_price.toFixed(2),
      addons: addons,
      item_combinations: combinations,
      booking_date: item.booking_date,
      members: (item.product.product_type !== 'lane')?0:item.qty,
      booked_slots: slots
    };
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
