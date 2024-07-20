import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  ElementRef,
  Input,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from './../../../shared/services/modal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from './../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { SlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';

import { environment } from '../../../../environments/environment';

import { CartService } from './../../../shared/services/cart.service';
import { AuthService } from './../../../shared/services/auth.service';
import { NetworkErrorService } from './../../../shared/services/network-error.service';
import { CommonService } from './../../../shared/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
import * as braintree from 'braintree-web-drop-in';

declare var $: any;
declare let gtag: Function;

@Component({
  selector: 'shop-checkout-page',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  enableButton: boolean = false;
  dropinInstance: any;
  private clientToken: string;
  tokenResponse: any;
  qtyChange: boolean = false;

  cartItems: any;
  allLaneProducts = true;
  allProducts = true;
  formGroup: FormGroup;
  assetPath = environment.ASSET_PATH;
  showUpdateBtn = true;
  collect_from_store = false;

  openPanel:string= '';
  modalRef:any;

  formGroupGuest: FormGroup;
  selectedAddress: any;
  count = 0;
  dType = '';
  clicktype = '';
  paymentmethods = [];
  paymenttype = 'stripe';
  placingOrder = false;
  guestFinding = false;
  placingWalletOrder = false;
  loggedin = false;
  guestemailset = false;
  subscription1: any;
  subscription2: any;
  subscription3: any;
  shippingCost = 0;
  addressChanged = false;
  coupon = '';
  couponApplied = false;
  appliedDiscount = 0;
  coupon_details: any;
  applyingCoupon = false;
  countries = [];
  states = [];
  cities = [];
  checkingGuestShipping = false;
  country = null;
  state = null;
  shippingcost = null;
  courier_name = null;
  city = null;
  userinfo: any;
  submittingForm = false;
  addresses = [];
  opts: SlimScrollOptions;
  changeAddress: any;
  shipping: any;
  defaultshippingmsg =
    'Sorry, delivery is not available to this shipping address.';
  shippingmsg = this.defaultshippingmsg;
  scrollEvents: EventEmitter<SlimScrollEvent>;
  deletingItem = false;
  deleteItem: any;

  // private subscr: Subscription;
  nullValidator: boolean = false;
  guestAddress: any;
  showAddress: boolean;
  guestCity: any;
  guestCountry: any;
  guestStates: any;
  deliverySpinner: boolean;

  constructor(
    public myElement: ElementRef,
    public cartService: CartService,
    private router: Router,
    public apiService: ApiService,
    public authService: AuthService,
    public modalService: ModalService,
    private toastrService: ToastrService,
    public activeRoute: ActivatedRoute,
    public networkErrorService: NetworkErrorService,
    public commonService: CommonService,
    private spinner: NgxUiLoaderService,
    // private http: HttpClient
  ) {
    this.activeRoute.queryParams.subscribe((params) => {
      let order_code = params['order_code'];
      let order_payment = params['cart_payment'];
      // let payment_method = params['payment_method'];
      // console.log("params", params);
      if (order_payment == 'failed') {
        if(params['error']){
          const myErrorMessage = params['error'].replace(/</g, '&lt;').replace(/>/g, '&gt;');
          this.toastrService.error(
            myErrorMessage,
            'Error'
          );
        }
        this.router.navigate(['/payment-failed/' + order_code]);
      }
      // else if (order_code && order_code != '') {
      //   //this.router.navigate(['/order-confirmed'],{queryParams:{order_code:order_code,payment_method:payment_method}});
      //   //this.router.navigate(['/order-confirmed/'+order_code]);
      // }
    });
  }

  // gotoForm() {
  //   this.myElement.nativeElement.ownerDocument
  //     .getElementById('form-shipping')
  //     .scrollIntoView({ behavior: 'smooth' });
  // }

  ngOnInit(): void {
    // this.spinner.start();
    if (!localStorage.getItem('currentUser')) {
      this.loggedin = false;
    }

    this.cartService.showHeaderFooter.emit(false);
    this.subscription1 = this.authService.isLogged.subscribe(
      (status: boolean) => {
        if (status) {
          this.getCart(true);
          this.guestemailset = false;
        } else {
          this.loggedin = false;
        }
      }
    );
    this.subscription2 = this.apiService.isCartChanged.subscribe(
      (status: boolean) => {
        if (status) {
          this.getCart();
        }
      }
    );
    this.subscription3 = this.apiService.isDialogConfirmed.subscribe((type) => {
      if (type == 'address') {
        this.deleteConfirmed();
      }
    });
    this.getCart(true);
    this.getCountries();
    document
      .querySelector('body')
      .addEventListener('click', () => this.clearOpacity());
    this.initForm();
    this.scrollEvents = new EventEmitter<SlimScrollEvent>();
    this.opts = new SlimScrollOptions({
      position: 'right', // left | right
      barBackground: '#C9C9C9', // #C9C9C9
      barOpacity: '0.3', // 0.8
      barWidth: '6', // 10
      barBorderRadius: '10', // 20
      barMargin: '0', // 0
      gridBackground: '#d9d9d9', // #D9D9D9
      gridOpacity: '1', // 1
      gridWidth: '0', // 2
      gridBorderRadius: '20', // 20
      gridMargin: '0', // 0
      alwaysVisible: true, // true
      visibleTimeout: 1000, // 1000
      alwaysPreventDefaultScroll: true, // true
    });
    this.getPaymetMethods();
  }

  ngAfterViewInit(): void {
    this.createBraintreeBtn();
  }



  selectAddress(address) {
    this.selectedAddress = address;
    this.dType = '';
    this.getShipping(address.id);
    //this.newForm.controls.firstName.setValue('abc');
  }

  getShipping(id, addressdata = null) {
    this.shipping = null;
    this.shippingcost = null;
    this.courier_name = null;
    this.shippingmsg = '';
    if (addressdata) {
      this.checkingGuestShipping = true;
    }
    let email: any = '';
    let phone: any = '';
    if (!this.userinfo) {
      email = addressdata?.email || this.formGroupGuest.get('email').value;
      phone = addressdata?.phone || this.formGroupGuest.get('phone').value;
    } else {
      email = this.userinfo.email;
      phone = this.userinfo.phone;
    }
    this.deliverySpinner = true;
    this.apiService.getShippoShipping(id, addressdata, email).subscribe(
      (result) => {
        if (addressdata) {
          this.checkingGuestShipping = false;
        }
        if (result.success) {
          // this.toastrService.success(result.message);
          this.shipping = result.data;
          this.deliverySpinner = false;
          this.spinner.stop();
        }
        if (!result.success) {
          this.shippingmsg = "Some of the selected products not available for delivery, please contact support.";
          if(result.msg){
            let parsedMsg = JSON.parse(result.msg);
            if(parsedMsg.parcels && parsedMsg.parcels[0]?.__all__){
              this.shippingmsg = parsedMsg.parcels[0].__all__[0];
            }
            else if(parsedMsg.items && parsedMsg.items[0]?.__all__){
              this.shippingmsg = parsedMsg.items[0].__all__[0];
            }
          }
          else{
            let msg = "";
            try {
                const parsedMessage = JSON.parse(result.message);
                const firstKey = Object.keys(parsedMessage)[0];
                if (Array.isArray(parsedMessage[firstKey])) {
                  msg = parsedMessage[firstKey][0];
                } else {
                    msg = parsedMessage[firstKey];
                }
            } catch (error) {
                msg = result.message;
            }
            this.shippingmsg = msg;
            // this.shippingmsg = result.message;
          }
          this.shipping = null;
          this.spinner.stop();
          this.deliverySpinner = false;
        }
        this.spinner.stop();
        this.deliverySpinner = false;
      },
      (error) => {
        if (addressdata) {
          this.checkingGuestShipping = false;
          this.spinner.stop();
          // this.shippingmsg = this.defaultshippingmsg;
        }
      }
    );
  }

  getShippingCharges() {
    if (this.shipping) {
      let selectedShipping = this.shipping.filter(
        (item) => item.id == this.dType
      );
      if (selectedShipping && selectedShipping.length) {
        return selectedShipping[0].amount;
      }
    }
    return 0;
  }

  selectDeliveryType(type, cost = '', courier = '') {
    this.dType = type;
    this.shippingcost = cost;
    this.courier_name = courier;
    if (this.couponApplied) {
      this.applyCoupon(true);
    }
  }

  getUserInfo() {
    this.apiService.getUserInfo().subscribe((result) => {
      if (result.success) {
        //this.toastrService.success(result.message);
        this.userinfo = result.user;
      } else {
        this.userinfo = null;
      }
    });
  }

  getAddresses() {
    this.apiService.getAddresses().subscribe((result) => {
      if (result.success) {
        this.addresses = result.data;
        if (!this.selectedAddress) {
          this.addresses.map((item) => {
            if (item.default_shipping == 1) {
              this.selectedAddress = item;
              this.dType = '';
              this.shippingcost = '';
              this.courier_name = '';
              this.getShipping(item.id);
              // this.gotoNext('address');
            }
          });
        }

        const ev = new SlimScrollEvent({ type: 'recalculate' });
        setTimeout(() => {
          this.scrollEvents.emit(ev);
        }, 3000);
      }
    });
  }

  setChangeAddress($event:any, addressForm:any, address:any=null) {
    this.showUpdateBtn = false;
    let item:any = address || this.selectedAddress;
    this.getShipping(item.id);
    $event.preventDefault();
    $event.stopPropagation();

    this.formGroup.reset();
    this.changeAddress = item;
    this.formGroup.patchValue({
      id: this.changeAddress.id,
      firstname: this.changeAddress.firstname,
      lastname: this.changeAddress.lastname,
      address: this.changeAddress.address,
      postal_code: this.changeAddress.postal_code,
      phone: this.changeAddress.phone,
      default_shipping: this.changeAddress.default_shipping,
      default_billing: this.changeAddress.default_billing,
    });

    this.formGroup.patchValue(
      {
        country: parseInt(this.changeAddress.country_id),
      },
      { emitEvent: false, onlySelf: true }
    );
    //this.formGroup.get('country').setValue(this.changeAddress.country_id)
    if (this.changeAddress && this.changeAddress.country_id) {
      this.getStates();
    }
    this.openAddressModal(addressForm);
  }

  cancelEdit() {
    this.changeAddress = null;
    this.closeModal();
  }

  // SplitTime(numberOfHours){
  // 	var Days=Math.floor(numberOfHours/24);
  // 	var Remainder=numberOfHours % 24;
  // 	var Hours=Math.floor(Remainder);
  // 	var Minutes=Math.floor(60*(Remainder-Hours));
  // 	return
  // 	return({"days":Days,"hours":Hours,"minutes":Minutes})
  // }

  toDays(flag_hours) {
    var totaldays = (flag_hours / 24).toFixed(2);
    return totaldays;
  }

  initForm() {
    this.formGroupGuest = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[\w\s]+$/),
          Validators.maxLength(50),
        ])
      ),
      phone: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(?!.*0{10}).*$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ])
      ),
    });
    this.formGroup = new FormGroup({
      id: new FormControl(''),
      firstname: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[\w\s]+$/),
          Validators.maxLength(20),
        ])
      ),
      lastname: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[\w\s]+$/),
          Validators.maxLength(20),
        ])
      ),
      address: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[\w\s\!@#%^&*()_+-={}|;':",./<>?~`]/),
        ])
      ),
      postal_code: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[\w\s]+$/),
          Validators.maxLength(12),
          Validators.minLength(4),
        ])
      ),
      country: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      phone: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(?!.*0{10}).*$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ])
      ),
      default_shipping: new FormControl(1),
      default_billing: new FormControl(1),
    });
    this.onAddressGuestChange();
  }

  ngOnDestroy(): void {
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
    if (this.subscription3) {
      this.subscription3.unsubscribe();
    }
    this.cartService.showHeaderFooter.emit(true);
    document
      .querySelector('body')
      .removeEventListener('click', () => this.clearOpacity());
  }

  setGuestUser() {
    this.guestemailset = false;
    this.userinfo = null;
    if (this.formGroupGuest.valid) {
      if(!this.guestFinding) {
        this.guestFinding = true;
        this.authService.checkguest(this.formGroupGuest.value).subscribe(
          (result) => {
            if (result.success) {
              if (result.is_guest == 1) {
                this.guestemailset = true;
              } else {
                //this.getUserInfo(result.access_token);
                this.toastrService.error(
                  'You are already registered please login'
                );
                this.spinner.stop();
                this.loggedin = false;
                this.closeModal();
                this.modalService.showLoginModal();
              }
            } else {
              this.spinner.stop();
              this.toastrService.error(result.message);
            }
            this.guestFinding = false;
          },
          (error) => {
            this.spinner.stop();
            this.toastrService.error(error?.error?.message);
            this.guestFinding = false;
          }
        );
      }
    } else if(this.formGroupGuest.get('email').value){
      if(!this.guestFinding) {
        this.guestFinding = true;
        this.authService.checkguest(this.formGroupGuest.value).subscribe(
          (result) => {
            if (result.success) {
              if (result.is_guest == 1) {
                this.guestemailset = true;
              } else {
                //this.getUserInfo(result.access_token);
                this.toastrService.error(
                  'You are already registered please login'
                );
                this.spinner.stop();
                this.loggedin = false;
                this.closeModal();
                this.modalService.showLoginModal();
              }
            } else {
              this.spinner.stop();
              this.toastrService.error(result.message);
            }
            this.guestFinding = false;
          },
          (error) => {
            this.spinner.stop();
            this.toastrService.error(error?.error?.message);
            this.guestFinding = false;
          }
        );
      }
    } else {
      Object.keys(this.formGroupGuest.controls).forEach((field) => {
        // {1}
        const control = this.formGroupGuest.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  getvalue(e) {
    const value = e.target.value;
    this.nullValidator = value == 'null' ? true : false;
  }

  onAddressGuestChange(addressData:any=null) {
    if (this.formGroup.valid || addressData) {
      this.addressChanged = true;
      if (this.guestemailset) {
        if(addressData){
          this.getShipping(0, addressData);
        }
        else{
          this.getShipping(0, this.formGroup.value);
        }
        this.dType = '';
        this.shippingcost = '';
        this.courier_name = '';
      }
    } else {
      this.dType = '';
      this.shipping = null;
      this.shippingcost = '';
      this.courier_name = '';
    }
  }

  getCart(resetUserInfo=false) {
    if (!localStorage.getItem('currentUser')) {
      this.loggedin = false;
    } else {
      this.loggedin = true;
    }
    this.apiService.getCart().subscribe(
      (result) => {
        if (result.success) {
          //this.toastrService.success(result.message);
          this.cartItems = result.cart_items.data;

          this.count = result.cart_items.data.length;
          if (this.count == 0) {
            this.router.navigate(['/cart']);
          }
          this.coupon_details = JSON.parse(
            localStorage.getItem('appliedCoupon')
          );
          if (this.coupon_details) {
            this.coupon = this.coupon_details.coupon;
          }
          if (this.appliedDiscount > 0 || this.coupon_details) {
            this.applyCoupon(true);
          }
          for (let item of this.cartItems) {
            if (item.product_type != 'lane') {
              this.allLaneProducts = false;
            }
            else if (item.product_type != 'product') {
              this.allProducts = false;
            }
            if(!this.allLaneProducts && !this.allProducts){
              break;
            }
          }

          if(resetUserInfo && this.loggedin) {
            this.getUserInfo();
            if(!this.allLaneProducts){
              this.getAddresses();
            }
          }
          this.gotoNext("");

          this.sendGA4Event("begin_checkout");
        }
      },
      (error) => {
        this.spinner.stop();
      }
    );
  }

  getCountries() {
    this.apiService.fetchCountries().subscribe((result) => {
      if (result.success) {
        //this.toastrService.success(result.message);
        this.countries = result.data;
      }
    });
  }

  getStates() {
    this.formGroup.patchValue(
      {
        city: null,
      },
      { emitEvent: false, onlySelf: true }
    );
    this.onAddressGuestChange();
    if (this.formGroup.controls['country'].value != '') {
      this.apiService
        .fetchStates(this.formGroup.controls['country'].value)
        .subscribe((result) => {
          if (result.success) {
            //this.toastrService.success(result.message);
            this.states = result.data;
            setTimeout(() => {
              if (this.changeAddress && this.changeAddress.state_id) {
                let findStates = this.states.map((value) => {
                  return value.id == this.changeAddress.city_id;
                });
                if (findStates.length) {
                  this.formGroup.patchValue(
                    {
                      state: parseInt(this.changeAddress.state_id),
                    },
                    { emitEvent: false, onlySelf: true }
                  );
                }
                this.getCities();
              }
            }, 1000);
          }
        });
    } else {
      this.states = [];
    }
  }

  getCities() {
    this.formGroup.patchValue(
      {
        city: null,
      },
      { emitEvent: false, onlySelf: true }
    );
    this.onAddressGuestChange();
    if (this.formGroup.controls['state'].value == '') {
      this.cities = [];
    } else {
      this.apiService
        .fetchCities(this.formGroup.controls['state'].value)
        .subscribe((result) => {
          if (result.success) {
            //this.toastrService.success(result.message);
            this.cities = result.data;

            setTimeout(() => {
              if (this.changeAddress && this.changeAddress.city_id) {
                let findCity = this.cities.map((value) => {
                  return value.id == this.changeAddress.city_id;
                });
                if (findCity.length) {
                  this.formGroup.patchValue(
                    {
                      city: parseInt(this.changeAddress.city_id),
                    },
                    { emitEvent: false, onlySelf: true }
                  );
                  this.showUpdateBtn = true;
                }
              }
            }, 1000);
          }
        });
    }
  }

  saveAddress(user) {
    if (this.formGroup.valid){
      this.formGroupGuest.patchValue(
        {
          phone: this.formGroup.get('phone').value,
          name: `${this.formGroup.get('firstname').value} ${this.formGroup.get('lastname').value}`,
        },
        { emitEvent: false, onlySelf: true }
      );
    }

    if (user === 'guest') {
      if (!this.loggedin && (this.allLaneProducts || this.collect_from_store)) {
        if (!this.formGroupGuest.valid) {
          this.toastrService.error('Please fill the mandatory fields');
          Object.keys(this.formGroupGuest.controls).forEach((field) => {
            // {1}
            const control = this.formGroupGuest.get(field); // {2}
            control.markAsTouched({ onlySelf: true }); // {3}
          });
          return;
        }
      }

      if (!this.loggedin && !this.allLaneProducts && !this.collect_from_store) {
        if (!this.formGroupGuest.valid && !this.formGroup.valid) {
          this.toastrService.error('Please fill the mandatory fields');
          Object.keys(this.formGroupGuest.controls).forEach((field) => {
            // {1}
            const control = this.formGroupGuest.get(field); // {2}
            control.markAsTouched({ onlySelf: false }); // {3}
          });
          Object.keys(this.formGroup.controls).forEach((field) => {
            // {1}
            const control = this.formGroup.get(field); // {2}
            control.markAsTouched({ onlySelf: false }); // {3}
          });
          return;
        }
      }
      this.guestAddress = {...this.formGroup.value, email: this.formGroupGuest.get('email').value, name: this.formGroupGuest.get('name').value};
      this.guestAddress.phone = (this.guestAddress.phone)?this.guestAddress.phone:this.formGroupGuest.get('phone').value;

      this.guestCity = this.cities.find(
        (item) => item.id === this.formGroup.value.city
      );
      this.guestStates = this.states.find(
        (item) => item.id === this.formGroup.value.state
      );
      this.guestCountry = this.countries.find(
        (item) => item.id === this.formGroup.value.country
      );
      if(!this.allLaneProducts && !this.collect_from_store){
        this.onAddressGuestChange(this.guestAddress);
      }
      this.gotoNext('address');
      this.closeModal();
      this.showAddress = true;
    }
  }

  submitForm() {
    if (!this.loggedin) {
      this.submittingForm = false;
      return;
    }
    if (this.formGroup.valid) {
      if (!this.submittingForm) {
        this.submittingForm = true;
        if (this.changeAddress) {
          this.apiService
            .updateAddress(this.formGroup.value)
            .subscribe((result) => {
              if (result.success) {
                this.selectedAddress = result.data.find(item => item.id === this.formGroup.value.id);
                this.getShipping(this.formGroup.value.id);
                this.formGroup.reset();
                this.toastrService.success(result.message);
                this.getAddresses();
                this.cancelEdit();
              } else {
                this.spinner.stop();
                this.toastrService.error(result.message);
              }
              this.submittingForm = false;
            });
        } else {
          this.apiService
            .addAddress(this.formGroup.value)
            .subscribe((result) => {
              if (result.success) {
                this.formGroup.reset();
                this.selectedAddress = result.data;
                this.getShipping(this.selectedAddress.id);
                this.toastrService.success(result.message);
                this.getAddresses();
                this.closeModal();
              } else {
                this.spinner.stop();
                this.toastrService.error(result.message);
              }
              this.submittingForm = false;
            });
        }
      }
    } else {
      Object.keys(this.formGroup.controls).forEach((field) => {
        // {1}
        const control = this.formGroup.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  clearOpacity() {
    let input: any = document.querySelector('#checkout-discount-input');
    if (input && input.value == '') {
      let label: any = document.querySelector('#checkout-discount-form label');
      label.removeAttribute('style');
    }
  }

  getPaymetMethods() {
    this.apiService.fetchSettingsData('payment_methods').subscribe((result) => {
      if (result.success) {
        this.paymentmethods = result.data;
        if (this.paymentmethods.length > 0) {
          for (let method of this.paymentmethods) {
            if (method.status == 1) {
              //this.paymenttype = method.code;
              break;
            }
          }
        }
        // this.spinner.stop();
      } else {
        this.paymentmethods = [];
        // this.spinner.stop();
      }
    });
  }

  addOpacity(event: any) {
    event.target.parentElement
      .querySelector('label')
      .setAttribute('style', 'opacity: 0');
    event.stopPropagation();
  }

  formToggle(event: any) {
    const parent: HTMLElement = event.target.closest('.custom-control');
    const submenu: HTMLElement = parent
      .closest('.form-group')
      .querySelector('.shipping-info');

    if (parent.classList.contains('open')) {
      $(submenu).slideUp(300, function () {
        parent.classList.remove('open');
      });
    } else {
      $(submenu).slideDown(300, function () {
        parent.classList.add('open');
      });
    }

    event.preventDefault();
    event.stopPropagation();
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
  // 	let sum1 = 0;
  // 	if (this.cartItems) {
  // 		for (let item of this.cartItems) {
  // 			if (item.dicounted_price) {
  // 				sum1 += parseFloat(item.dicounted_price)
  // 			} else {
  // 				sum1 += parseFloat(item.regular_price)
  // 			}
  // 			for (let item1 of item.product_addons) {
  // 				sum1 += parseFloat(item1.price);
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
        this.spinner.stop();
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
                  (this.total() + this.getShippingCharges() + this.totalTax()) *
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
          this.spinner.stop();
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

  changePaymentType(type) {
    this.paymenttype = type;
  }

  walletRecharge() {
    if (!localStorage.getItem('currentUser')) {
      this.loggedin = false;
      this.modalService.showLoginModal();
      return;
    }
    this.modalService.showRechargeModal();
    // let url='https://ksinfosoft.in/payment/paypal/pay';

    // var form = document.createElement("form");
    // // form.target = "view";
    // form.method = "POST";
    // form.action = url;

    // let params = {
    // 	"redirect_to": "http://localhost:4200/checkout",
    // 	"amount": 100,
    // 	"payment_method": 'paypal',
    // 	"payment_type": "wallet_payment",
    // 	"user_id": this.userinfo.id,
    // 	"order_code": null,
    // 	"transactionId": null,
    // 	"receipt": null,
    // 	"card_number": null,
    // 	"cvv": null,
    // 	"expiration_month": null,
    // 	"expiration_year": null
    //   }

    // for (var i in params) {
    // 	if (params.hasOwnProperty(i)) {
    // 	var input = document.createElement('input');
    // 	input.type = 'hidden';
    // 	input.name = i;
    // 	input.value = params[i];
    // 	form.appendChild(input);
    // 	}
    // }

    // document.body.appendChild(form);
    // form.submit();
  }

  placeOrderWallet() {
    if (!this.userinfo) {
      this.loggedin = false;
      this.modalService.showLoginModal();
      return;
    }
    if (!this.placingOrder && !this.placingWalletOrder) {
      if (
        this.userinfo.balance == 0 ||
        this.userinfo.balance <
          this.totalTax() +
            this.total() +
            this.getShippingCharges() -
            this.appliedDiscount
      ) {
        this.toastrService.error(
          "You don't have enough wallet balance. Please recharge."
        );
        this.spinner.stop();
        return;
      }
      this.placeOrder('wallet');
    }
  }

  async placeOrder(type?, btntype = '') {
    this.clicktype = btntype;

    if (!this.loggedin && (this.allLaneProducts || this.collect_from_store)) {
      if (!this.guestAddress) {
        return;
      }
    }

    if (!this.loggedin && !this.allLaneProducts) {
      if (!this.selectedAddress && !this.guestAddress) {
        this.toastrService.error('Please fill the mandatory fields');
        return;
      }
    }

    if (btntype == 'paypal') {
      this.paymenttype = 'paypal';
    }
    if (btntype == 'braintree' || btntype == 'inline') {
      this.paymenttype = 'braintree';
    }
    if (!this.userinfo && !this.guestemailset) {
      this.loggedin = false;
      this.modalService.showLoginModal();
      return;
    }

    if (this.loggedin && !this.collect_from_store) {
      if (this.addresses.length == 0 && !this.allLaneProducts) {
        this.toastrService.error('Please select address or add new address');
        return;
      }
    }
    if (
      (this.dType == '' || this.dType == null) &&
      this.addresses.length > 0 &&
      !this.allLaneProducts && !this.collect_from_store
    ) {
      this.toastrService.error('Please select a delivery type');
      return;
    }
    if (
      (!this.selectedAddress || !this.guestAddress) &&
      this.addresses.length == 0 &&
      this.addresses == null && !this.collect_from_store
    ) {
      this.toastrService.error('Please fill proper address');
      return;
    }

    if (this.paymenttype == '') {
      this.toastrService.error('Please select a payment method');
      return;
    }

    let ids = [];
    if (this.cartItems) {
      for (let item of this.cartItems) {
        ids.push(item.cart_id);
      }
    }

    let data = {
      shipping_address_id: this.selectedAddress?.id,
      guestuser: this.guestemailset,
      addressdata: this.selectedAddress || this.guestAddress,
      email: this.selectedAddress?.email || this.guestAddress?.email,
      phone: this.selectedAddress?.phone || this.guestAddress?.phone,
      name: this.selectedAddress?.name || this.guestAddress?.name,
      billing_address_id: this.selectedAddress?.id,
      payment_type: type ? type : this.paymenttype, //'paypal', // wallet // offline_payment // cash_on_delivery
      delivery_type: this.dType,
      shipping_cost: this.shippingcost,
      courier_name: this.courier_name,
      cart_item_ids: ids,
      transactionId: null,
      coupon_codes: [],
      receipt: null,
      product_type: (this.allLaneProducts)?'lane':'product',
      shipping: !this.collect_from_store
    };

    if (this.coupon) {
      data.coupon_codes = [this.coupon];
    }
    if (type) {
      this.placingWalletOrder = true;
    } else {
      this.placingOrder = true;
    }

    if (this.selectedAddress || this.guestAddress) {
      if (!this.submittingForm) {
        this.submittingForm = true;

        if (!(await this.networkErrorService.checkNetworkStatus())) {
          this.placingOrder = false;
          this.toastrService.error(
            'Your system is not connected with Internet'
          );
        } else {
          this.placingOrder = true;
          this.apiService.storeOrder(data).subscribe((result) => {
            if (result.success) {
              // this.sendGA4Event("purchase");
              if (result.go_to_payment) {
                if (btntype == 'inline') {
                  const queryParams = {
                    total: result.grand_total.toFixed(2),
                    order_code: result.order_code,
                    product_type: (this.allLaneProducts)?'lane':'product',
                    cart_id: ids,
                  };
                  this.submitPayment(queryParams)
                }
                else if (result.payment_method == 'braintree') {
                  this.router.navigate(['/braintree-payment'], {
                    queryParams: {
                      total: result.grand_total.toFixed(2),
                      order_code: result.order_code,
                      product_type: (this.allLaneProducts)?'lane':'product',
                      cart_id: ids,
                    },
                  });
                } else {
                  //let url='/payment/paypal/pay';
                  let url =
                    environment.BASE_URL +
                    '/payment/' +
                    result.payment_method +
                    '/pay';

                  var form = document.createElement('form');
                  // form.target = "view";
                  form.method = 'POST';
                  form.action = url;

                  let params = {
                    redirect_to: environment.BASE_URL + `/order-summary?order_code=${result.order_code}&product_type=${(this.allLaneProducts)?'lane':'product'}&transaction_id=`,
                    amount: result.grand_total.toFixed(2),
                    payment_method: result.payment_method,
                    payment_type: type ? 'wallet_payment' : 'cart_payment',
                    delivery_type: result.delivery_type,
                    courier_name: result.courier_name,
                    user_id: result.user_id,
                    order_code: result.order_code,
                    transactionId: null,
                    receipt: null,
                    card_number: null,
                    cvv: null,
                    expiration_month: null,
                    expiration_year: null,
                    cart_id: ids
                  };
                  // alert(params.redirect_to);
                  for (var i in params) {
                    if (params.hasOwnProperty(i)) {
                      var input = document.createElement('input');
                      input.type = 'hidden';
                      input.name = i;
                      input.value = params[i];
                      form.appendChild(input);
                    }
                  }

                  document.body.appendChild(form);
                  form.submit();
                  // window.open('', 'view');

                  // let newdata = {
                  // 	"redirect_to": "/checkout",
                  // 	"amount": result.grand_total.toFixed(2),
                  // 	"payment_method": result.payment_method,
                  // 	"payment_type": type? "wallet_payment": "cart_payment",
                  // 	"user_id": this.userinfo.id,
                  // 	"order_code": result.order_code,
                  // 	"transactionId": null,
                  // 	"receipt": null,
                  // 	"card_number": null,
                  // 	"cvv": null,
                  // 	"expiration_month": null,
                  // 	"expiration_year": null
                  //   }
                  //   this.apiService.pay(result.payment_method,data).subscribe(result => {
                  //   });
                }
              } else {
                this.toastrService.success(result.message);
                //this.router.navigate(['/order-confirmed'],{queryParams:{order_code:result.order_code,payment_method:'paypal'}});
                this.router.navigate(['/order-confirmed/' + result.order_code]);
              }
            } else {
              this.toastrService.error(result.message);
              this.placingOrder = false;
            }

            if (btntype != 'inline') {
              this.placingOrder = false;
            }
            this.submittingForm = false;
            this.placingWalletOrder = false;
          });
        }
      }
    } else {
      if (!this.submittingForm) {
        this.submittingForm = true;

        if (!(await this.networkErrorService.checkNetworkStatus())) {
          this.placingOrder = false;
          this.toastrService.error(
            'Your system is not connected with Internet'
          );
        } else {
          this.placingOrder = true;
          this.apiService.storeOrder(data).subscribe((result) => {
            if (result.success) {
              // this.sendGA4Event("purchase");
              if (result.go_to_payment) {
                if (btntype == 'inline') {
                  const queryParams = {
                    total: result.grand_total.toFixed(2),
                    order_code: result.order_code,
                    product_type: (this.allLaneProducts)?'lane':'product',
                    cart_id: ids,
                  };
                  this.submitPayment(queryParams)
                }
                else if (result.payment_method == 'braintree') {
                  this.router.navigate(['/braintree-payment'], {
                    queryParams: {
                      total: result.grand_total.toFixed(2),
                      order_code: result.order_code,
                      product_type: (this.allLaneProducts)?'lane':'product',
                      cart_id: ids,
                    },
                  });
                } else {
                  let url =
                    environment.BASE_URL +
                    '/payment/' +
                    result.payment_method +
                    '/pay';

                  var form = document.createElement('form');
                  form.method = 'POST';
                  form.action = url;

                  let params = {
                    // redirect_to: environment.BASE_URL + '/checkout',
                    redirect_to: environment.BASE_URL + `/order-summary?order_code=${result.order_code}&product_type=${(this.allLaneProducts)?'lane':'product'}&transaction_id=`,
                    amount: result.grand_total.toFixed(2),
                    payment_method: result.payment_method,
                    payment_type: type ? 'wallet_payment' : 'cart_payment',
                    delivery_type: result.delivery_type,
                    courier_name: result.courier_name,
                    user_id: result.user_id,
                    order_code: result.order_code,
                    transactionId: null,
                    receipt: null,
                    card_number: null,
                    cvv: null,
                    expiration_month: null,
                    expiration_year: null,
                    cart_id: ids,
                  };
                  for (var i in params) {
                    if (params.hasOwnProperty(i)) {
                      var input = document.createElement('input');
                      input.type = 'hidden';
                      input.name = i;
                      input.value = params[i];
                      form.appendChild(input);
                    }
                  }

                  document.body.appendChild(form);
                  form.submit();
                }
              } else {
                this.toastrService.success(result.message);
                this.router.navigate(['/order-confirmed/' + result.order_code]);
              }
            } else {
              this.toastrService.error(result.message);
              this.placingOrder = false;
            }

            this.submittingForm = false;
            this.placingWalletOrder = false;
            if(btntype != 'inline') {
              this.placingOrder = false;
            }
          });
        }
      }
    }
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

  // karthick
  showLoginModal(event: Event, register:boolean=false): void {
		event.preventDefault();
		this.modalService.showLoginModal(register);
	}

  resetSelectedAddress(goto = "") {
    this.selectedAddress = null;
    this.dType = '';
    this.shipping = null;
    this.shippingcost = null;
    this.courier_name = null;
    this.shippingmsg = "";
    this.gotoNext(goto);
  }

  gotoNext(current:string){
    if(current == ""){
      const startTab = (!this.allLaneProducts && !this.collect_from_store)?"address":"payment";
      this.openPanel = (!this.loggedin)?"checkoutAs":startTab;
    }
    else if(current == "checkoutAs"){
      this.openPanel = "address";
    }
    else if(current == "address" && (this.selectedAddress || this.guestAddress)){
      this.openPanel = (!this.allLaneProducts && !this.collect_from_store)?"shipping":"payment";
    }
    else if(current == "shipping" && this.dType){
      this.openPanel = "payment";
      // this.placeOrder(null, 'inline');
    }
  }

  setGustLaneEdit(){
    this.formGroupGuest.patchValue({
      name: this.guestAddress?.name,
      email: this.guestAddress?.email,
      phone: this.guestAddress?.phone,
    });
    this.gotoNext('checkoutAs');
  }

  openGuestEdit(addressForm:any=null){
    this.showUpdateBtn = false;
    this.formGroup.reset();
    this.changeAddress = {
      ...this.guestAddress,
      country_id: this.guestAddress.country,
      state_id: this.guestAddress.state,
      city_id: this.guestAddress.city
    };
    this.formGroup.patchValue({
      id: null,
      firstname: this.changeAddress?.firstname,
      lastname: this.changeAddress?.lastname,
      address: this.changeAddress?.address,
      postal_code: this.changeAddress?.postal_code,
      phone: this.changeAddress?.phone,
      // city: (this.changeAddress?.city),
      // state: (this.changeAddress?.state),
      // country: (this.changeAddress?.country)
    });

    this.formGroupGuest.patchValue(
      {
        email: this.changeAddress?.email,
        phone: this.changeAddress?.phone,
        name: this.changeAddress?.name,
      },
      { emitEvent: false, onlySelf: true }
    );
    this.formGroup.patchValue({
        country: parseInt(this.changeAddress.country_id),
      },
      { emitEvent: false, onlySelf: true }
    );
    //this.formGroup.get('country').setValue(this.changeAddress.country_id)
    if (this.changeAddress && this.changeAddress.country_id) {
      this.getStates();
    }
    if(addressForm){
      this.openAddressModal(addressForm);
    }
    else{
      this.gotoNext('checkoutAs');
    }
  }

  openAddressModal(addressForm:any) {
    this.modalRef = this.modalService.showTemplateModal(addressForm);
  }

  closeModal(){
    // this.formGroupGuest.patchValue({
    //     email: "",
    //     name: "",
    //     phone: ""
    // });

    // this.formGroup.patchValue({
    //     id: "",
    //     firstname: "",
    //     lastname: "",
    //     address: "",
    //     postal_code: "",
    //     country: null,
    //     state: null,
    //     city: null,
    //     phone: ""
    // });

    this.formGroupGuest.reset();
    this.formGroup.reset();

    // setTimeout(() => {
    //   this.formGroupGuest.markAsUntouched();
    //   this.formGroup.markAsUntouched();
    // }, 200);

    this.modalRef?.close();
  }

  defaultShippingAddress(item:any) {
    this.apiService.defaultShipping(item.id).subscribe((result) => {
      if (result.success) {
        this.toastrService.success(result.message);
        this.addresses = result.data;
      }
    });
  }

  deleteAddress($event:any, item:any) {
    if(this.selectedAddress?.id == item.id){
      this.toastrService.error("You can't delete the address which you have selected for shipping.");
      return ;
    }
    if(item.default_shipping){
      this.toastrService.error("You can't delete the default address.");
      return ;
    }
    this.deleteItem = item;
    this.modalService.showConfirmModal(
      'address',
      'You want to delete an address.'
    );
  }

  deleteConfirmed() {
    if (!this.deletingItem) {
      this.deletingItem = true;
      this.apiService.deleteAddress(this.deleteItem.id).subscribe((result) => {
        if (result.success) {
          this.toastrService.success(result.message);
          this.addresses = result.data;
        }

        this.deletingItem = false;
      });
    }
  }

  collectFromStoreChanged(){
    const goto = (this.loggedin)?"":"checkoutAs";
    if(this.collect_from_store){
      this.resetSelectedAddress(goto);
    }
    else{
      this.gotoNext(goto);
    }
  }

  sendGA4Event(event_name:string) {
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
        quantity: (item.product.product_type !== 'lane')?item.qty:0,
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
    // gtag("event", event_name, null);
    gtag("event", event_name, {
      event_name: event_name,
      currency: "USD",
      value: val,
      items: items
    });
  }

  createBraintreeBtn(){
    this.apiService.fetchClientToken().subscribe(
      (response) => {
        this.tokenResponse = response.csrfToken;
        this.cartService.showHeaderFooter.emit(false);
        this.clientToken = response.clientToken;

        // Create and mount the Drop-in UI
        braintree.create(
          {
            authorization: this.clientToken,
            container: '#dropin-container',
            paymentOptionPriority: ['card', 'paypal', 'googlePay', 'applePay'],
            googlePay: {
              googlePayVersion: 2,
              merchantId: 'BCR2DN4TZLGLFCJW',
              transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: `${this.getGTotal() || 0}`,
                currencyCode: 'USD'
              }
            },
            // samsungPay: true, // Enable Samsung Pay
            paypal: {
              flow: 'vault',
            },
            // Apple Pay is available in Safari on iOS version 10+ and macOS version 10.12+.
            // If Apple Pay is not supported by the customer's browser, the options to select Apple Pay will not appear.
            // Ref: https://developer.paypal.com/braintree/docs/guides/drop-in/setup-and-integration/javascript/v3/
            applePay: {
              displayName: 'US Cricket Store',
              paymentRequest: {
                total: {
                  label: 'Total',
                  amount: `${this.getGTotal() || 0}`,
                },
                countryCode: 'US',
                currencyCode: 'USD',
                supportedNetworks: ['visa', 'masterCard', 'amex', 'jcb', 'discover'],
                merchantCapabilities: ['supports3DS', 'supportsCredit'],
              }
            }
          },
          (dropinErr, dropinInstance) => {
            this.spinner.stop();
            if (dropinErr) {
              console.error(dropinErr);
              return;
            }
            this.enableButton = true;
            // Use dropinInstance to handle payment submissions
            this.dropinInstance = dropinInstance;
          }
        );
      },
      (error) => {
        this.enableButton = false;
        this.toastrService.error(error.error.message);
        this.spinner.stop();
      }
    );
  }

  getGTotal():string{
    return ( this.totalTax() + this.total() + this.getShippingCharges() - this.appliedDiscount ).toFixed(2);
  }

  submitPayment(queryParams:any): void {
    this.spinner.start();
    this.dropinInstance.requestPaymentMethod((error, payload) => {
      if (error) {
        console.log('drop error===>', error, this.dropinInstance);
        this.toastrService.error(error);
        this.spinner.stop();
        this.placingOrder = false;
      } else {
        const payment_method_nonce = payload.nonce;
        this.apiService
          .sendPaymentMethod({
            payment_method_nonce,
            order_code: queryParams.order_code,
            product_type: queryParams.product_type,
            cart_id: queryParams.cart_id,
          })
          .subscribe(
            (response) => {
              console.log('response ==>', response);
              if (response.status) {
                this.toastrService.success('Payment successful');
                this.router.navigate(['/order-summary'], {
                  queryParams: {
                    order_code: queryParams.order_code,
                    product_type: queryParams.product_type,
                    transaction_id: response.data.transaction.id,
                  },
                });
                this.spinner.stop();
                this.placingOrder = false;
              } else {
                // this.router.navigate(['/checkout'], { queryParams: { product_type: queryParams.product_type } });
                this.toastrService.error('Payment failed');
                this.spinner.stop();
                this.placingOrder = false;
              }
            },
            (error) => {
              // this.router.navigate(['/checkout'], { queryParams: { product_type: queryParams.product_type } });
              console.log('error===>', error);
              this.toastrService.error(error.message);
              this.spinner.stop();
              this.placingOrder = false;
            }
          );
      }
    });
  }

  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.slug;
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
