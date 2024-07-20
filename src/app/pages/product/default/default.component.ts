import { Component, OnInit, HostListener, Inject, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Product } from 'src/app/shared/classes/product';
import { ApiService } from 'src/app/shared/services/api.service';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modal.service';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

declare let gtag:Function;

@Component({
  selector: 'product-default-page',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultPageComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  submittingForm = false;
  formGroup: FormGroup;
  lightBoxOption = {
    showImageNumberLabel: true,
    centerVertically: true,
    showZoom: true,
    fadeDuration: 0.2,
    albumLabel: '%1 / %2',
  };
  product;
  prev: Product;
  next: Product;
  variationGroup = [];
  relatedProducts = [];
  related = [];
  loaded = false;
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
  currentUser: any;
  selectedRating: any;
  type = '';
  totalAddons: number[];

  constructor(
    public apiService: ApiService,
    private activeRoute: ActivatedRoute,
    private renderer: Renderer2,
    public router: Router,
    private sanitizer: DomSanitizer,
    private toastrService: ToastrService,
    public modalService: ModalService,
    public lightBox: Lightbox,
    private spinner: NgxUiLoaderService,
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.spinner.start();
    activeRoute.params.subscribe((params) => {
      this.loaded = false;
      this.apiService.getSingleProduct(params['slug']).subscribe((result) => {
        if (result.data === null) {
          // this.router.navigate(['/pages/404']);
          this.router.navigate(['']);
          return;
        }
        this.product = result.data;
        this.totalAddons = this.product.addons.map((item) => item.id);
        this.setMetaTags();

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
        this.getRelatedProducts(this.product.id);
        this.getReviews(this.product.id, this.page);
        this.getAlbumImages();
        this.loaded = true;
        this.spinner.stop();
      });
    });
  }

  @HostListener('window:resize', ['$event'])
  closeLightBox(event: Event) {
    this.lightBox.close();
  }

  ratingClass(start, end) {
    //console.log(this.product.review_summary.average >= start && this.product.review_summary.average < end);
    return this.product.review_summary.average >= start &&
      this.product.review_summary.average < end
      ? 'active'
      : '';
  }

  ratingPercent(a, b) {
    return (a / b) * 100;
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

    //console.log(this.album)
  }

  updateQty(type) {
    if (type == 'dec') {
      if (this.qty > 1) {
        this.qty -= 1;
      }
    } else if (type == 'inc') {
      if (this.product.max_qty > 0 && this.qty < this.product.max_qty) {
        this.qty += 1;
      } else {
        this.qty += 1;
      }
    }
  }

  getRelatedProducts(id) {
    this.apiService.getRelatesProducts(id).subscribe((result) => {
      this.relatedProducts = result.data;
      // this.prev = result.prevProduct;
      // this.next = result.nextProduct;
      // this.related = result.relatedProducts;
      this.relatedloaded = true;
      this.spinner.stop();
    });
  }

  getReviews(id, page) {
    if (!this.loadingreviews) {
      this.loadingreviews = true;
      this.apiService.fetchReviews(id, page).subscribe((result) => {
        this.reviews = [...this.reviews, ...result.data];
        this.totalreviews = result.meta.total;
        this.loadingreviews = false;
      });
    }
  }

  addToCart() {
    let variation = 0;
    if (this.product.is_variant && parseInt(this.product.is_variant) !== 0) {
      if (!this.selectedVariation) {
        this.toastrService.error(
          'Invalid Selection',
          'Please select all the required options'
        );
        return false;
      } else {
        variation = this.selectedVariation;
      }
    } else {
      variation = this.product?.variations[0]?.id;
    }
    let temp_user_id = '';
    if (localStorage.getItem('temp_user_id')) {
      temp_user_id = localStorage.getItem('temp_user_id');
    }
    // console.log(this.qty, temp_user_id, variation, 'check payload');

    this.apiService
      .addToCart(this.qty, temp_user_id, variation)
      .subscribe((result) => {
        if (result.success) {
          this.toastrService.success(result.message);
          this.sendGA4Event();
        } else {
          this.toastrService.error(result.message);
        }
      });
    return true;
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
          this.apiService.wishChanged(true);
          this.product.wishlisted = 0;
        } else {
          this.toastrService.error(result.message);
        }
      });
    }
  }

  loadmore() {
    this.page = this.page + 1;
    this.getReviews(this.product.id, this.page);
  }

  getPriceDetails() {
    let min = this.minPrice;
    let max = this.maxPrice;
    // this.variationGroup = this.product.variations.reduce((acc, cur) => {
    // 	cur.size.map(item => {
    // 		acc.push({
    // 			color: cur.color,
    // 			colorName: cur.color_name,
    // 			size: item.name,
    // 			price: cur.price
    // 		});
    // 	});
    // 	if (min > cur.price) min = cur.price;
    // 	if (max < cur.price) max = cur.price;
    // 	return acc;
    // }, []);

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

  ngOnInit(): void {
    // this.activeRoute.queryParams.subscribe(
    // 	params => {
    // 		if(params['type']){
    // 			this.type = params['type'];
    // 		}
    // 	}
    // );
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      rating: new FormControl('', [Validators.required]),
      comment: new FormControl('', [Validators.required]),
    });
  }

  changeRating(val) {
    if (this.selectedRating == val) return;
    this.selectedRating = val;
    this.formGroup.patchValue({
      rating: val,
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  submitReview() {
    if (!localStorage.getItem('currentUser')) {
      this.modalService.showLoginModal();
      return;
    }
    if (this.formGroup.valid && !this.formGroup.getError('mismatch')) {
      if (!this.submittingForm) {
        this.submittingForm = true;
        let values = this.formGroup.value;
        values.product_id = this.product.id;
        this.apiService.submitReview(values).subscribe((result) => {
          if (result.success) {
            this.page = 1;
            this.reviews = [];
            this.getReviews(this.product.id, this.page);
            this.toastrService.success(result.message);
            this.formGroup.reset();
          } else {
            this.toastrService.error(result.message);
          }
          this.submittingForm = false;
        });
      }
    } else {
      Object.keys(this.formGroup.controls).forEach((field) => {
        // {1}
        const control = this.formGroup.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  selectItem(itemid, itemvalueid) {
    this.selectedItems = this.selectedItems.filter((item) => {
      let newitems = item.split(':');
      return newitems[0] != itemid;
    });
    this.selectedItems.push(itemid + ':' + itemvalueid);
    this.selectedVariation = null;
    this.selectedPrice = this.minPrice;
    for (let item of this.product.variations) {
      if (this.arraysEqual(item.code, this.selectedItems)) {
        //console.log(JSON.stringify(item.code)+'=='+JSON.stringify(this.selectedItems))
        this.selectedVariation = item.id;
        this.selectedPrice = item.price;
      } else {
        //console.log('not',JSON.stringify(item.code)+'=='+JSON.stringify(this.selectedItems))
      }
    }
  }

  arraysEqual(a, b) {
    a = Array.isArray(a) ? a : [];
    b = Array.isArray(b) ? b : [];
    return a.length === b.length && a.every((el) => b.includes(el));
  }

  onNavChange($event: NgbNavChangeEvent) {
    this.currentIndex = this.active;
    //console.log(this.currentIndex)
  }

  openLightBox() {
    this.lightBox.open(this.album, this.currentIndex, this.lightBoxOption);
  }

  setMetaTags() {
    if (this.product) {
      this.meta.removeTag('name="keywords"');
      this.title.setTitle(this.product?.metaTitle);
      this.meta.updateTag({ name: 'description', content: this.product.metaDescription });
      this.meta.updateTag({ property: 'og:title', content: this.product.metaTitle });
      this.meta.updateTag({ property: 'og:description', content: this.product.metaDescription });
      // this.meta.updateTag({ property: 'og:image', content: this.product.metaImage });
      this.meta.updateTag({ property: 'og:image', content: environment.BASE_URL+'/images/product/'+this.product.slug });
      this.meta.updateTag({ property: 'og:url', content: this.document.URL });
      this.meta.updateTag({ name: 'twitter:title', content: this.product.metaTitle });
      this.meta.updateTag({ name: 'twitter:description', content: this.product.metaDescription });
      this.meta.updateTag({ name: 'twitter:image', content: this.product.metaImage });

      const existingCanonicalElement = this.document.querySelector('link[rel="canonical"]');
      if (existingCanonicalElement) {
        this.renderer.setAttribute(existingCanonicalElement, 'href', `${environment.BASE_URL}${this.router.url}`);
      }
    }
  }

  sendGA4Event() {
    const item = this.product;
    let addons = "";
    const tempItem = {
      item_id: item.id,
      item_slug: item.slug,
      item_name: item.name,
      item_type: item.product_type,
      quantity: this.qty,
      price: (this.selectedPrice).toFixed(2),
      total_price: (this.selectedPrice * this.qty).toFixed(2),
      addons: addons,
    };
    // gtag('event', 'add_to_cart', null);
    gtag('event', 'add_to_cart', {
      event_name: "add_to_cart",
      currency: "USD",
      value: (this.selectedPrice * this.qty).toFixed(2),
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
      item_type: item.product_type,
      stock: item.stock,
      price: (item.base_price).toFixed(2),
      discounted_price: (item.base_discounted_price).toFixed(2),
    };
    // gtag('event', 'add_to_wishlist', null);
    gtag('event', 'add_to_wishlist', {
      event_name: "add_to_wishlist",
      currency: "USD",
      value: (item.base_discounted_price).toFixed(2),
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
