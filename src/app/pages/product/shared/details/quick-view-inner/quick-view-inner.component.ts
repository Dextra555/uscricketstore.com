import {
  Component,
  OnInit,
  HostListener,
  Input,
  OnChanges,
  ViewEncapsulation,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from './../../../../../shared/classes/product';
import { ApiService } from './../../../../../shared/services/api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModalService } from './../../../../../shared/services/modal.service';
import {
  NgbNavChangeEvent,
  NgbDateStruct,
  NgbCalendar,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { SlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { environment } from '../../../../../../environments/environment';
import { NetworkErrorService } from './../../../../../shared/services/network-error.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare let gtag: Function;

@Component({
  selector: 'quick-view-inner',
  templateUrl: './quick-view-inner.component.html',
  styleUrls: ['./quick-view-inner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuickViewInnerComponent implements OnInit, OnChanges {
  assetPath = environment.ASSET_PATH;
  selectedDate: NgbDateStruct;
  date: { year: number; month: number };
  minDate = undefined;
  loadingslots = false;
  laneslottotal: any;
  terms: any;

  public gfg = false;
  @Input() product1;
  @Input() loaded;
  @Input() loaded1;
  product: any;
  addonArray = [];
  priceBeforeDiscount = 0;
  stock = 0;
  startid = 0;
  inventory: any;
  endid = 0;
  slotsprice = 0;
  max_players = 4;
  opts: SlimScrollOptions;
  scrollEvents: EventEmitter<SlimScrollEvent>;

  lightBoxOption = {
    showImageNumberLabel: true,
    centerVertically: true,
    showZoom: true,
    fadeDuration: 0.2,
    albumLabel: '%1 / %2',
  };
  prev: Product;
  next: Product;
  variationGroup = [];
  relatedProducts = [];
  related = [];
  relatedloaded = false;
  maxPrice = 0;
  minPrice = 99999;
  selectedVariation = null;
  selectedPrice: any = 99999;
  selectedItems = [];
  safeUrl: SafeHtml = '';
  reviews = [];
  totalreviews = 0;
  page = 1;
  qty: any = 1;
  loadingreviews = false;
  album = [];
  currentIndex = 0;
  active = 0;
  slotsmsg = '';
  qtymsg = '';
  slots = [];
  selectedSlots = [];
  currentUrl: any;
  selectedAddons = [];
  totalAddons = [];
  cartItems: any;
  clicktype = '';
  placingOrder = false;
  instantResult: any;
  instantOrder: boolean = false;

  constructor(
    public apiService: ApiService,
    private activeRoute: ActivatedRoute,
    public router: Router,
    private sanitizer: DomSanitizer,
    private toastrService: ToastrService,
    public modalService: ModalService,
    public lightBox: Lightbox,
    public networkErrorService: NetworkErrorService,
    private spinner: NgxUiLoaderService
  ) {
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
  }

  ngOnInit(): void {
    // console.log(this.product1, 'check product');

    this.currentUrl = this.router.url;
    this.getCart();
    // this.activeRoute.queryParams.subscribe((queryParams) => {
    //   if (queryParams.addons) {
    //     const value = queryParams.addons.split(',');
    //     this.selectedAddons = value.map((item) => {
    //       return Number(item);
    //     });
    //   }
    // });

    if (this.product1) {
      this.loaded1 = 'no';
      console.log(this.product1.slug, 'this.product1.slug');

      this.apiService
        .getSingleProduct(this.product1.slug)
        .subscribe((result) => {
          console.log(result, 'result');

          if (result === null) {
            // this.router.navigate(['/pages/404']);
            this.router.navigate(['']);
          }

          this.product = result.data;
          if (
            this.product.product_type == 'lane' &&
            this.product.subtype == 'regular'
          ) {
            this.qty = 2;
          }
          this.stock = this.product.stock;
          this.inventory = this.product.inventory;
          if (this.product.video_link) {
            // this.safeUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(this.product.video_link+'?autoplay=1');
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.product.video_link
            );
          }
          // this.sendGA4EventView();
          // this.prev = result.prevProduct;
          // this.next = result.nextProduct;
          // this.related = result.relatedProducts;
          this.getPriceDetails();
          this.getAlbumImages();
          this.loaded1 = 'yes';
        });
    }
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
  }

  getCart() {
    this.apiService.getCart().subscribe((result) => {
      if (result.success) {
        result.cart_items.data.map((element) => {
          this.cartItems = element;
          this.totalAddons = this.cartItems.product.addon_products;
          this.selectedAddons = this.cartItems.product_addons;
        });

        this.activeRoute.queryParams.subscribe((queryParams) => {
          if (queryParams.addons) {
            {
              this.addonArray = this.selectedAddons;
            }
          }
        });
      }
      this.spinner.stop();
    });
  }

  setActiveIndex(index) {
    this.currentIndex = index;
  }

  encode(slug) {
    return encodeURI(environment.BASE_URL + '/product/' + slug);
  }

  encodeText(text) {
    return encodeURI(text);
  }

  ngOnChanges(changes) {
    if (this.product1) {
      this.loaded = false;
      this.apiService
        .getSingleProduct(this.product1.slug)
        .subscribe((result) => {
          if (result === null) {
            // this.router.navigate(['/pages/404']);
        this.router.navigate(['']);
          }

          this.product = result.data;
          this.stock = this.product.stock;
          if (
            this.product.product_type == 'lane' &&
            this.product.subtype == 'regular'
          ) {
            this.qty = 2;
          }
          this.inventory = this.product.inventory;
          if (this.product.video_link) {
            // this.safeUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(this.product.video_link+'?autoplay=1');
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.product.video_link
            );
          }
          this.sendGA4EventView();
          // this.prev = result.prevProduct;
          // this.next = result.nextProduct;
          // this.related = result.relatedProducts;
          this.getPriceDetails();
          this.getAlbumImages();
          this.loaded = true;
        });
    }
    // changes.prop contains the old and the new value...
  }

  @HostListener('window:resize', ['$event'])
  closeLightBox(event: Event) {
    this.lightBox.close();
  }

  closeQuickView(clickedCheckout = false) {
    let modal = document.querySelector(
      '.quickViewInnerModal-modal'
    ) as HTMLElement;
    if (modal) {
      this.modalService.closeQuickViewModal();
    }
    //if (modal)
    if (clickedCheckout) {
      this.router.navigate(['/checkout'], {
        queryParams: { product_type: this.product.product_type },
      });
    } else {
      //modal.click();
    }
  }

  getAlbumImages() {
    this.album = [];

    for (let i = 0; i < this.product.photos.length; i++) {
      let src = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.product.photos[i]
      );
      this.album.push({
        src: src,
        thumb: src,
        caption: this.product.name,
      });
    }
  }

  updateQty(type) {
    this.qtymsg = '';
    if (type == 'dec') {
      if (
        this.product.product_type == 'lane' &&
        this.product.subtype == 'regular'
      ) {
        if (this.qty > 2) {
          this.qty -= 1;
        } else {
          this.qtymsg = 'Minimum two people required for regular lane';
        }
      } else {
        if (this.qty > 1) {
          this.qty -= 1;
        }
      }
    } else if (type == 'inc') {
      if (this.product.product_type == 'lane') {
        if (this.qty < this.max_players) {
          this.qty += 1;
        }
      } else if (this.product.max_qty > 0 && this.qty < this.product.max_qty) {
        this.qty += 1;
      } else if (this.product.max_qty == 0) {
        this.qty += 1;
      }
    }

    this.calculatePrice();
  }

  async addToCart(ischeckout = false, type = 1) {
    // this.sendTestEvent();
    this.qtymsg = '';
    this.slotsmsg = '';
    let variation = 0;
    if (this.product.is_variant && parseInt(this.product.is_variant) !== 0) {
      if (!this.selectedVariation) {
        this.toastrService.error('Please select all the required options');
        this.spinner.stop();
        return false;
      } else {
        variation = this.selectedVariation;
      }
    } else {
      variation = this.product?.variations[0]?.id;
    }
    if (type == 1) {
      this.product.loading = true;
    } else if (type == 0) {
      this.instantOrder = true;
    } else {
      this.product.loading_new = true;
    }
    let temp_user_id = '';
    if (localStorage.getItem('temp_user_id')) {
      temp_user_id = localStorage.getItem('temp_user_id');
    }
    let addons = this.addonArray;

    let selectedSlotIds = this.selectedSlots.map((a) => a.id);
    let product_type = this.product.product_type;
    let selectedDate = '';
    if (this.selectedDate && this.selectedDate.day) {
      selectedDate =
        this.selectedDate.day +
        '-' +
        this.selectedDate.month +
        '-' +
        this.selectedDate.year;
    }
    if (product_type == 'lane' && selectedSlotIds.length == 0) {
      this.qtymsg = 'Please select some slots';
      this.product.loading = false;
      this.product.loading_new = false;
      this.instantOrder = false;
      this.spinner.stop();
      return false;
    }
    if (product_type == 'lane' && !this.terms) {
      this.qtymsg = 'Please agree to our terms';
      this.product.loading = false;
      this.product.loading_new = false;
      this.instantOrder = false;
      this.spinner.stop();
      return false;
    }

    if (!(await this.networkErrorService.checkNetworkStatus())) {
      this.product.loading = false;
      this.product.loading_new = false;
      this.instantOrder = false;
      this.toastrService.error('Your system is not connected with Internet');
      this.spinner.stop();
    } else {
      this.apiService
        .addToCart(
          this.qty,
          temp_user_id,
          variation,
          addons,
          selectedSlotIds,
          product_type,
          selectedDate
        )
        .subscribe((result) => {
          this.instantResult = result;
          if (result.success) {
            this.toastrService.success(result.message);
            this.apiService.cartChanged(true);
            if (this.currentUrl == '/wishlist') {
              this.removeFromWish();
            }
            this.closeQuickView(ischeckout);
            this.sendGA4Event();
            //this.modalService.closeQuickViewModal();
          } else {
            this.toastrService.error(result.message);
            this.spinner.stop();
          }
          this.instantOrder = false;
          this.product.loading = false;
          this.product.loading_new = false;
        });
      this.spinner.stop();
    }
    return true;
  }

  async instantPlaceOrder() {
    await this.addToCart(true, 0);
  }

  addToWish() {
    if (!localStorage.getItem('currentUser')) {
      this.modalService.showLoginModal();
    } else {
      this.apiService.addToWish(this.product.id).subscribe((result) => {
        if (result.success) {
          this.toastrService.success(result.message);
          this.apiService.wishChanged(true);
          this.product.wishlisted = 1;
          this.sendGA4EventWishlist();
        } else {
          this.toastrService.error(result.message);
        }
      });
    }
  }

  removeFromWish() {
    if (!localStorage.getItem('currentUser')) {
      this.modalService.showLoginModal();
    } else {
      this.apiService.removeFromoWish(this.product.id).subscribe((result) => {
        if (result.success) {
          this.toastrService.success(result.message);
          this.apiService.removeWishlistId(this.product.id);
          this.apiService.wishChanged(true);
          this.product.wishlisted = 0;
        } else {
          this.toastrService.error(result.message);
        }
      });
    }
  }

  getPriceDetails() {
    let min = this.minPrice;
    let max = this.maxPrice;
    this.variationGroup = this.product.variations.reduce((acc, cur) => {
      if (min > cur.price) min = cur.price;
      if (max < cur.price) max = cur.price;
      return acc;
    }, []);

    if (this.product.variations.length == 0) {
      min = this.product.base_discounted_price
        ? this.product.base_discounted_price
        : this.product.base_price;
      max = this.product.base_price;
    } else {
    }

    this.minPrice = min;
    this.maxPrice = max;
    this.selectedPrice = this.minPrice;
  }

  selectItem(itemid, itemvalueid) {
    this.selectedItems = this.selectedItems.filter((item) => {
      let newitems = item.split(':');
      return newitems[0] != itemid;
    });
    this.selectedItems.push(itemid + ':' + itemvalueid);
    this.selectedVariation = null;
    this.selectedPrice = this.minPrice;
    let set = 0;
    for (let item of this.product.variations) {
      if (this.arraysEqual(item.code, this.selectedItems)) {
        this.selectedVariation = item.id;
        this.selectedPrice = item.price;
        this.stock = item.stock;
        this.inventory = item.inventory;
        set = 1;
      } else {
      }
    }
    if (!set) {
      this.inventory = this.product.inventory;
      this.stock = this.product.stock;
    }
  }

  arraysEqual(a, b) {
    a = Array.isArray(a) ? a : [];
    b = Array.isArray(b) ? b : [];
    return a.length === b.length && a.every((el) => b.includes(el));
  }

  onNavChange($event: NgbNavChangeEvent) {
    //this.currentIndex = this.active;
  }

  openLightBox() {
    this.lightBox.open(this.album, this.currentIndex, this.lightBoxOption);
  }

  checkedAddon(addon) {
    const item = this.addonArray.filter((item) => item.id == addon.id);
    return item.length == 0 ? false : true;
  }

  onChangeAddon($event, addon) {
    $event.preventDefault();
    let item = this.addonArray.filter((item) => item.id == addon.id);
    if (item.length > 0) {
      this.addonArray = this.addonArray.filter((item) => item.id != addon.id);
    } else {
      this.addonArray.push(addon);
    }
  }

  addOnTotal() {
    let sum = 0;
    for (let item of this.addonArray) {
      sum += parseFloat(item.price);
    }
    return sum;
  }

  priceBeforeDiscountCalculate() {
    if (this.product.discount > 0) {
      if (this.product.discount_type == 'percent') {
        this.priceBeforeDiscount =
          (this.selectedPrice * 100) / (100 - this.product.discount);
      } else if (this.product.discount_type == 'flat') {
        this.priceBeforeDiscount =
          parseFloat(this.selectedPrice) + parseFloat(this.product.discount);
      }
    }
    return parseFloat(this.priceBeforeDiscount.toFixed(2));
  }

  selectSlot(id) {
    if (this.startid && this.startid == id) {
      this.startid = 0;
      this.endid = 0;
    } else if (!this.startid || this.startid > id) {
      this.startid = id;
      this.endid = 0;
    } else if (this.startid < id) {
      this.endid = id;
    }
    if (this.endid > 0) {
      this.selectedSlots = this.slots.filter((value, index) => {
        return (
          value.id >= this.startid &&
          value.id <= this.endid &&
          parseInt(value.is_available) == 1
        );
      });
    } else if (this.startid > 0) {
      this.selectedSlots = this.slots.filter((value, index) => {
        return value.id == this.startid && parseInt(value.is_available) == 1;
      });
    } else {
      this.selectedSlots = [];
    }

    this.calculatePrice();
  }

  calculatePrice() {
    this.slotsprice = 0;
    for (let item of this.selectedSlots) {
      for (let price of item.slot_prices) {
        if (price.min_player <= this.qty && price.max_player >= this.qty) {
          this.slotsprice += parseFloat(price.price);
          break;
        } else {
        }
      }
    }

    if (this.slotsprice > 0) {
      this.laneTotal();
    }
  }

  laneTotal() {
    let total = '';
    if (
      this.product.product_type == 'lane' &&
      this.product.subtype == 'regular'
    ) {
      /// total = (this.slotsprice * (this.qty -1) ).toFixed(2)
      total = this.slotsprice.toFixed(2);
    } else {
      total = this.slotsprice.toFixed(2);
      //total = (this.slotsprice * this.qty ).toFixed(2)
    }

    //this.laneslottotal= total;

    this.apiService
      .lane_slot_price_with_tax(this.product.id, total)
      .subscribe((result) => {
        if (result.success) {
          this.laneslottotal = result.data;
        } else {
        }
        // if(result.success){

        // }else{
        // 	this.toastrService.error(result.message);
        // }
      });
    return this.laneslottotal;
  }

  selectedClass(id) {
    let selection = this.selectedSlots.filter((value, index) => {
      return value.id == id;
    });

    if (selection && selection.length > 0) {
      return 'selected';
    }
    return '';
  }

  pad(num, size = 2) {
    num = num.toString();
    while (num.length < size) num = '0' + num;
    return num;
  }

  changeDate(event) {
    this.selectedSlots = [];
    this.qtymsg = '';
    this.startid = 0;
    this.endid = 0;
    this.slotsmsg = '';
    this.calculatePrice();
    this.loadingslots = true;
    this.slotsmsg = '';
    let date = event.day + '-' + event.month + '-' + event.year;
    this.apiService.getLaneSlots(this.product.id, date).subscribe((result) => {
      if (result.success) {
        this.slots = result.data;
        this.getMaxPlayers();
        this.selectedSlots = [];
        this.slotsmsg = result.message;
      } else {
        this.slotsmsg = result.message;
      }
      this.loadingslots = false;
      // if(result.success){

      // }else{
      // 	this.toastrService.error(result.message);
      // }
    });
  }

  getMaxPlayers() {
    for (let item of this.slots) {
      for (let price of item.slot_prices) {
        if (this.max_players < parseInt(price.max_player)) {
          this.max_players = price.max_player;
        }
      }
    }
    this.max_players;
  }

  addonInventory(addons) {
    let inventory = 0;
    if (addons && addons.length) {
      for (let addon of addons) {
        inventory += addon.inventorysum;
      }
    }
    return inventory;
  }

  dateConvert(date) {
    return new Date(date);
    //.toLocaleString("en-US", {timeZone: "America/Los_Angeles"})
  }

  sendGA4Event() {
    const item = this.product;
    let addons = this.addonArray?.map(function(addon:any) {
      return addon.name;
    }).join(', ');
    // let slots = item.slotDetails?.map(function(slot:any) {
    //   return `${slot.slot_start_time} - ${slot.slot_end_time}`;
    // }).join(', ');
    // const combinations = JSON.stringify(item.combinations) || "";
    const tempItem = {
      item_id: item.id,
      item_slug: item.slug,
      item_name: item.name,
      item_type: item.product_type,
      // item_category: item.product.product_type,
      quantity: this.qty,
      price: (this.selectedPrice).toFixed(2),
      total_price: (this.selectedPrice * this.qty).toFixed(2),
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
      value: ((this.selectedPrice + this.addOnTotal()) * this.qty).toFixed(2),
      items: [
        tempItem
      ]
    });
  }

  sendGA4EventWishlist() {
    const item = this.product;
    const tempItem = {
      item_id: item.id,
      item_slug: item.slug,
      item_name: item.name,
      price: (item.base_price).toFixed(2),
    };
    // gtag('event', 'add_to_wishlist', null);
    gtag('event', 'add_to_wishlist', {
      event_name: "add_to_wishlist",
      currency: "USD",
      value: (item.base_price).toFixed(2),
      items: [
        tempItem
      ]
    });
  }

  sendGA4EventView() {
    const item = this.product;
    const tempItem = {
      item_id: item.id,
      item_slug: item.slug,
      item_name: item.name,
      item_type: item.product_type,
      stock: item.stock,
      price: (item.base_price).toFixed(2),
      discounted_price: (item.base_discounted_price).toFixed(2),
    };
    // gtag('event', 'view_item', null);
    gtag('event', 'view_item', {
      event_name: "view_item",
      currency: "USD",
      value: (item.base_discounted_price).toFixed(2),
      // item_list_name: `From ${this.currentCat.name} category products page - ${this.currentPage || 1}`,
      items: [
        tempItem
      ]
    });
  }
}
