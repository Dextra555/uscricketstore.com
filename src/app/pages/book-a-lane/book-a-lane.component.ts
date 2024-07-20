import {
  Component,
  OnInit,
  HostListener,
  Input,
  EventEmitter,
  Renderer2,
  Inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Product } from 'src/app/shared/classes/product';
import { ApiService } from 'src/app/shared/services/api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModalService } from 'src/app/shared/services/modal.service';
import {
  NgbNavChangeEvent,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { SlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { environment } from '../../../../src/environments/environment';
import { NetworkErrorService } from 'src/app/shared/services/network-error.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DOCUMENT } from '@angular/common';

declare let gtag: any;

@Component({
  selector: 'molla-book-a-lane',
  templateUrl: './book-a-lane.component.html',
  styleUrls: ['./book-a-lane.component.scss'],
})
export class BookALaneComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  selectedDate: NgbDateStruct;
  date: { year: number; month: number };
  minDate: any = new Date();
  loadingslots: boolean = false;
  laneslottotal: any;
  terms: any;

  public gfg = false;
  @Input() product1;
  @Input() loaded;
  @Input() loaded1;
  product: any;
  addonArray = [];
  priceBeforeDiscount = 0;
  slotSubscription:any;
  subscription:any;
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
  products = [];
  openLaneSection: boolean = false;
  booklane: any;
  activeClass: boolean;
  activeRegularClass: boolean;
  activeMachineClass: boolean;
  selectedWeekDay: any;
  day_of_week: any;
  pageData: any;

  constructor(
    public apiService: ApiService,
    private activeRoute: ActivatedRoute,
    public router: Router,
    private sanitizer: DomSanitizer,
    private toastrService: ToastrService,
    public modalService: ModalService,
    public lightBox: Lightbox,
    public networkErrorService: NetworkErrorService,
    private spinner: NgxUiLoaderService,
    private title: Title,
    private renderer: Renderer2,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.apiService.fetchPage('book-a-lane').subscribe(
      (result) => {
        this.pageData = result.data;
        if (this.pageData == null) {
          // this.router.navigate(['/pages/404']);
        this.router.navigate(['']);
        }
        this.addTag();
      },
      (error) => {
        // this.router.navigate(['/pages/404']);
        this.router.navigate(['']);
      }
    );

    const options: Intl.DateTimeFormatOptions = {
      timeZone: "America/Los_Angeles",
      // hour12: true, // Set to false if you want 24-hour format
    };
    const formattedDate = this.minDate.toLocaleString('en-US', options);
    this.minDate = new Date(formattedDate);
    this.selectedDate = {
      year: this.minDate.getFullYear(),
      month: this.minDate.getMonth() + 1,
      day: this.minDate.getDate(),
    };
  }

  ngOnInit(): void {
    this.subscription = this.apiService.isCartChanged.subscribe(
      (status: boolean) => {
        if (status) {
          this.changeDate(this.selectedDate);
        }
      }
    );
    this.slotSubscription = this.apiService.isDialogConfirmed.subscribe((type) => {
      if (type == 'confirm_slot') {
        this.instantPlaceOrder();
      }
    });
    this.currentUrl = this.router.url;
    this.getCart();
    this.apiService.fetchSettingsData('book-a-lane').subscribe((result) => {
      this.booklane = result.data;
      this.loaded = true;

      this.chooseLane(
        this.booklane?.section_one?.product_2_btn_link.split('/')[1],
        'regular'
      );
    });

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

  chooseLane(value, type) {
    if (type === 'regular') {
      this.activeRegularClass = true;
      this.activeMachineClass = false;
    }
    if (type === 'machine') {
      this.activeMachineClass = true;
      this.activeRegularClass = false;
    }
    this.product1 = value;
    this.openLaneSection = true;

    this.loaded1 = 'no';
    this.loadingslots = false;
    this.apiService.getSingleProduct(this.product1).subscribe((result) => {
      if (result === null) {
        // this.router.navigate(['/pages/404']);
        this.router.navigate(['']);
      }

      this.product = result.data;

      this.changeDate(this.selectedDate);

      if (
        this.product.product_type == 'lane' &&
        (this.product.subtype == 'regular' || this.product.subtype == 'machine')
      ) {
        this.qty = 2;
      }
      this.stock = this.product.stock;
      this.inventory = this.product.inventory;
      if (this.product.video_link) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.product.video_link
        );
      }
      this.getPriceDetails();
      this.getAlbumImages();
      this.loaded1 = 'yes';
      this.sendGA4EventView();
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
      this.terms = false;
      // this.selectedSlots = [];
      this.qtymsg = "";
      // this.qty = 2;
      // this.calculatePrice();
      this.changeDate(this.selectedDate);
      // this.router.navigate(['/checkout'], {
      //   queryParams: { product_type: this.product.product_type },
      // });
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
      if (
        this.product.product_type == 'lane' &&
        this.product.subtype == 'regular'
      ) {
        if (this.qty < this.max_players) {
          this.qty += 1;
        }
      } else if (
        this.product.product_type == 'lane' &&
        this.product.subtype == 'machine'
      ) {
        if (this.qty < 5) {
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
          value.index >= this.startid &&
          value.index <= this.endid &&
          parseInt(value.is_available) == 1
        );
      });
    } else if (this.startid > 0) {
      this.selectedSlots = this.slots.filter((value, index) => {
        return value.index == this.startid && parseInt(value.is_available) == 1;
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
      return value.index == id;
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
    let date = event?.day + '-' + event?.month + '-' + event?.year;

    let date_selected = new Date(
      event?.year + '-' + event?.month + '-' + event?.day
    );
    this.day_of_week = date_selected.getDay();

    this.apiService.getLaneSlots(this.product.id, date).subscribe((result) => {
      if (result.success) {
        let i = 1;
        this.slots = result.data.map((item: any) => ({ ...item, index: i++ }));

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

  isSlotNotStarted(slotTime: string): boolean {
    const currentTime = this.minDate; //new Date(formattedDate);
    if(this.selectedDate
      && this.minDate.getDate() == this.selectedDate.day
      && (this.minDate.getMonth() + 1) == this.selectedDate.month
      && this.minDate.getFullYear() == this.selectedDate.year){
        // Parse slot time string
        const [hourMinute, period] = slotTime.split(' ');
        let [slotHour, slotMinute] = hourMinute.split(':').map(part => parseInt(part));
        slotHour = (period == 'PM' && slotHour < 12) ? (slotHour + 12) : slotHour;
        const slotDate = new Date(this.selectedDate.year, this.selectedDate.month - 1, this.selectedDate.day);
        slotDate.setHours(slotHour, slotMinute, 0, 0);
        // Compare current time with slot time
        return currentTime.getTime() < slotDate.getTime();
    }
    return true;
  }

  addTag() {
    this.title.setTitle(this.pageData?.metaTitle);
    this.metaService.updateTag({
      name: 'title',
      content: this.pageData?.metaTitle,
    });
    this.metaService.updateTag({
      name: 'description',
      content: this.pageData?.meta_description,
    });
    this.metaService.updateTag({
      name: 'keywords',
      content: this.pageData?.keywords,
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: this.pageData?.metaTitle,
    });
    this.metaService.updateTag({
      property: 'og:image',
      content: this.pageData?.meta_image,
    });
    this.metaService.updateTag({ property: 'og:description', content: this.pageData?.meta_description });

    const existingCanonicalElement = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonicalElement) {
      this.renderer.setAttribute(existingCanonicalElement, 'href', `${environment.BASE_URL}${this.router.url}`);
    }

  }

  sendGA4Event(){
    const item = this.product;
    let addons = ""
    let slots = this.selectedSlots?.map(function(slot:any) {
      return `${slot.slot_start_time} - ${slot.slot_end_time}`;
    }).join(', ');
    // const combinations = JSON.stringify(item.combinations) || "";
    // Create a Date object using the provided properties
    const dateObject = new Date(this.selectedDate.year, this.selectedDate.month - 1, this.selectedDate.day);
    // Convert the Date object to a string
    const dateString = dateObject.toDateString();
    const tempItem = {
      item_id: item.id,
      item_slug: item.slug,
      item_name: item.name,
      item_type: item.product_type,
      // item_category: item.product.product_type,
      quantity: 1,
      price: this.laneslottotal.toFixed(2),
      total_price: this.laneslottotal.toFixed(2),
      addons: addons,
      // item_combinations: combinations,
      booking_date: dateString,
      members: this.qty,
      booked_slots: slots
    };
    // gtag('event', 'add_to_cart', null);
    gtag('event', 'add_to_cart', {
      event_name: "add_to_cart",
      currency: "USD",
      value: this.laneslottotal.toFixed(2),
      items: [
        tempItem
      ]
    });
  }

  sendGA4EventView() {
    const item = this.product;
    let addons = ""
    let slots = this.selectedSlots?.map(function(slot:any) {
      return `${slot.slot_start_time} - ${slot.slot_end_time}`;
    }).join(', ');
    const dateObject = new Date(this.selectedDate.year, this.selectedDate.month - 1, this.selectedDate.day);
    // Convert the Date object to a string
    const dateString = dateObject.toDateString();
    const tempItem = {
      item_id: item.id,
      item_slug: item.slug,
      item_name: item.name,
      item_type: item.product_type,
      quantity: 1,
      price: item.base_price?.toFixed(2) || 0,
      total_price: item.base_price?.toFixed(2) || 0,
      addons: addons,
      booking_date: dateString,
      members: this.qty,
      booked_slots: slots
    };
    // console.log(tempItem, item);
    // gtag('event', 'view_item', null);
    gtag('event', 'view_item', {
      event_name: "view_item",
      currency: "USD",
      value: item.base_price?.toFixed(2) || 0,
      // item_list_name: `From ${this.currentCat.name} category products page - ${this.currentPage || 1}`,
      items: [
        tempItem
      ]
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.slotSubscription) {
      this.slotSubscription.unsubscribe();
    }
  }

  confirmSlots($event) {
    let selectedSlotIds = this.selectedSlots.map((a) => a.id);
    let product_type = this.product.product_type;
    if (product_type == 'lane' && selectedSlotIds.length == 0) {
      this.qtymsg = 'Please select some slots';
      return false;
    }
    if (product_type == 'lane' && !this.terms) {
      this.qtymsg = 'Please agree to our terms';
      return false;
    }
    return this.modalService.showConfirmModal(
      'confirm_slot',
      // 'Your slot will be removed from your cart if you are faild to book in 5 minutes.'
      "You have 5 minutes remaining to book your slot. If you don't proceed within this time frame, the slot will be automatically removed from your cart. Are you sure you want to reserve it now?"
    );
  }
}
