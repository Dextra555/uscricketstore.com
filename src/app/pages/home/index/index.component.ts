import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
// import * as CryptoJS from 'crypto-js';
declare let gtag: Function;

import {
  introSlider,
  testimonialSlider,
  instagramSlider,
  iconboxSlider,
  homeProductsSlider,
} from '../data';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'molla-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  
  @ViewChild('owlCar') owlCar:any;
  assetPath = environment.ASSET_PATH;
  suggestions = [];
  products: any;
  posts: any;
  popularCategories: any;
  videos: any;
  sliders: any;
  cricketAcademy: any;
  bookLane: any;
  banner: any;
  loaded = false;
  introSlider = introSlider;
  testimonialSlider = testimonialSlider;
  instagramSlider = instagramSlider;
  iconboxSlider = iconboxSlider
  homeProductsSlider = homeProductsSlider;
  private timer: any;
  private delaySearch: boolean = true;

  keyword = '';
  searchedCat = '';
  searchTerm = '';
  AllCategories = [];
  metaData: any;


  constructor(
    public apiService: ApiService,
    public router: Router,
    public utilsService: UtilsService,
    private commonService: CommonService,
    private modalService: ModalService,
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService,
  ) {
    // this.access_token = this.activeRoute.snapshot.params['access_token'];
    const access_token = this.activeRoute.snapshot.queryParamMap.get('access_token');
    if(access_token){
      this.authUser(access_token);
    }
    // this.modalService.openNewsletter();

    this.apiService.fetchMetaData().subscribe((result) => {
      this.metaData = result.data.meta;
      this.setMetaTags();
    });
    this.getAllCategories();
    this.apiService.fetchHomeData().subscribe((result) => {
      this.products = result.data.products?.products?.data;
      this.posts = result.data.posts;
      this.popularCategories = result.data.popular_categories;
      this.videos = result.data.videos;
      this.cricketAcademy = result.data.cricket_academy;
      this.sliders = result.data.sliders;
      this.bookLane = result.data.book_lane;
      this.banner = result.data.banner;
      this.loaded = true;
      setTimeout(() => {
        this.showSaleModal();
      }, 3000);
    });
  }

  // encryptedData = (str:string)=>{
  //   return CryptoJS.AES.encrypt(str, 'encryptionKey').toString();
  // }

  // decryptedData = (str:string)=>{
  //   return CryptoJS.AES.decrypt(str, 'encryptionKey').toString(CryptoJS.enc.Utf8);
  // }

  ngOnInit(): void {
    this.iconboxSlider.nav = false;
  }

  showSaleModal(): void {
    if (!this.commonService.getSessionStorage('offer-modal')) {
      this.modalService.showSaleModal();
      this.commonService.setSessionStorage('offer-modal', 1);
    }
  }

  showModal(event: Event, link = null) {
    event.preventDefault();
    this.modalService.showVideoModal(link);
  }

  navigate(link) {
    if(link == '/category/offer-35yzh'){
      this.sendGA4Event("select_promotion");
    }
    this.router.navigateByUrl(link);
  }

  sendGA4Event(event_name:string){
    // gtag('event', event_name, null);
    gtag('event', event_name, {
      event_name: event_name,
      promotion_id: "offer-35yzh",
      promotion_name: "Clearance Sale",
      items: []
    });
  }

  substringBetween(s, a, b) {
    var p = s.indexOf(a) + a.length;
    return s.substring(p, s.indexOf(b, p));
  }

  getAllCategories() {
    this.apiService.getAllCategories().subscribe((result) => {
      if (result.success) {
        this.AllCategories = result.data;
      }
    });
  }

  searchChanged(e) {
    //console.log(e.target.value)
    this.keyword = e.target.value;
    //console.log("Delay is set to: " + this.delaySearch);

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

    //console.log('here' + value)
    if (value && value.length > 0) {
      newparams['keyword'] = value;

      if (this.searchedCat) {
        newparams['category_slug'] = this.searchedCat;
      } else {
        newparams['category_slug'] = '';
      }
      this.apiService
        .fetchShopData(newparams, 21, 'product/autocomplete')
        .subscribe((result) => {
          this.suggestions = result.products.data;
          //this.utilsService.scrollToPageContent();
        });
    }
  }

  getSelectedCat($event) {
    // console.log($event.slug);
    // console.log($event.target.value);
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

  authUser(access_token:string) {
    this.apiService.authUser(access_token).subscribe((result) => {
      if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        localStorage.setItem('temp_user_id', result.user.id.toString());
        localStorage.setItem('token', access_token);

        this.toastrService.success(result.message);
        this.authService.loginStatus(true);
        this.apiService.wishChanged(true);
        this.apiService.cartChanged(true);
      } else {
        // localStorage.removeItem('temp_user_id');
        this.toastrService.error(result.message);
        this.authService.loginStatus(false);
        this.apiService.wishChanged(true);
      }
      this.router.navigate(['/']);
    });
  }

  setMetaTags() {
    if (this.metaData) {
      this.title.setTitle(this.metaData.metaTitle);
      this.meta.updateTag({ name: 'keywords', content: this.metaData.metaKeywords });
      this.meta.updateTag({ name: 'description', content: this.metaData.metaDescription });
      this.meta.updateTag({ property: 'og:title', content: this.metaData.metaTitle });
      this.meta.updateTag({ property: 'og:description', content: this.metaData.metaDescription });
      this.meta.updateTag({ property: 'og:image', content: this.metaData.metaImage });
      this.meta.updateTag({ name: 'twitter:title', content: this.metaData.metaTitle });
      this.meta.updateTag({ name: 'twitter:description', content: this.metaData.metaDescription });
      this.meta.updateTag({ name: 'twitter:image', content: this.metaData.metaImage });

      const existingCanonicalElement = this.document.querySelector('link[rel="canonical"]');
      if (existingCanonicalElement) {
        this.renderer.setAttribute(existingCanonicalElement, 'href', `${environment.BASE_URL}${this.router.url}`);
      }
    }
  }
  nextSlide() {
    this.owlCar.next([200]);
  }

  prevSlide() {
    this.owlCar.prev([200]);
  }
}
