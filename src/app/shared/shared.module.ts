import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlModule } from 'angular-owl-carousel';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { LightboxModule } from 'ngx-lightbox';

// Header Element
import { CartMenuComponent } from './components/headers/shared/cart-menu/cart-menu.component';
import { AccountMenuComponent } from './components/headers/shared/account-menu/account-menu.component';
import { WishlistMenuComponent } from './components/headers/shared/wishlist-menu/wishlist-menu.component';
import { MainMenuComponent } from './components/headers/shared/main-menu/main-menu.component';
import { MainMenuRightComponent } from './components/headers/shared/main-menu-right/main-menu-right.component';
import { HeaderSearchComponent } from './components/headers/shared/header-search/header-search.component';
import { MobileButtonComponent } from './components/headers/shared/mobile-button/mobile-button.component';
import { MobileMenuComponent } from './components/headers/shared/mobile-menu/mobile-menu.component';
import { HeaderTopComponent } from './components/headers/shared/header-top/header-top.component';

// Header Component
import { HeaderComponent } from './components/headers/header/header.component';

// // Product Component
import { ProductOneComponent } from './components/product/product-one/product-one.component';
import { ProductTwoComponent } from './components/product/product-two/product-two.component';
import { ProductThreeComponent } from './components/product/product-three/product-three.component';
import { ProductFourComponent } from './components/product/product-four/product-four.component';
import { ProductFiveComponent } from './components/product/product-five/product-five.component';
import { ProductSixComponent } from './components/product/product-six/product-six.component';
import { ProductSevenComponent } from './components/product/product-seven/product-seven.component';
import { ProductEightComponent } from './components/product/product-eight/product-eight.component';
import { ProductNineComponent } from './components/product/product-nine/product-nine.component';
import { ProductTenComponent } from './components/product/product-ten/product-ten.component';
import { ProductElevenComponent } from './components/product/product-eleven/product-eleven.component';
import { ProductTwelveComponent } from './components/product/product-twelve/product-twelve.component';
import { ProductRelatedComponent } from './components/product/product-related/product-related.component';

// Footer Component
import { FooterComponent } from './components/footer/footer.component';
// // Page Element
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { UserSidebarComponent } from './components/user-sidebar/user-sidebar.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { CardComponent } from './components/accordion/card/card.component';
import { AccordionComponent } from './components/accordion/accordion.component';

// Product Element
import { QuantityInputComponent } from './components/quantity-input/quantity-input.component';
import { CountDownComponent } from './components/count-down/count-down.component';
import { CountToComponent } from './components/count-to/count-to.component';

// // single use component
import { QuickViewComponent } from './components/modals/quick-view/quick-view.component';
import { QuickViewInnerModalComponent } from './components/modals/quick-view-inner-modal/quick-view-inner-modal.component';

import { QuickViewInnerComponent } from '../pages/product/shared/details/quick-view-inner/quick-view-inner.component';
import { QuickViewTwoComponent } from './components/modals/quick-view-two/quick-view-two.component';
import { VideoModalComponent } from './components/modals/video-modal/video-modal.component';
import { NewsletterModalComponent } from './components/modals/newsletter-modal/newsletter-modal.component';
import { LoginModalComponent } from './components/modals/login-modal/login-modal.component';
import { IsotopeGridComponent } from './components/isotope-grid/isotope-grid.component';
import { ImageComponent } from './components/image/image.component';

// // Custom Directives
import { BgParallaxDirective } from './directives/bg-parallax.directive';
import { TabClickDirective } from './directives/custom-tab-click.directive';
import { ProductHoverDirective } from './directives/product-hover.directive';
import { ContentAnimDirective } from './directives/content-anim.directive';

// Pipes
import { CatFilterPipe } from './pipes/cat-filter.pipe';
import { AttrFilterPipe } from './pipes/attr-filter.pipe';
import { SafeContentPipe } from './pipes/safe-content.pipe';

// // Post Component
import { PostOneComponent } from './components/blog-post/post-one/post-one.component';
import { PostTwoComponent } from './components/blog-post/post-two/post-two.component';
import { PostThreeComponent } from './components/blog-post/post-three/post-three.component';
import { PostFourComponent } from './components/blog-post/post-four/post-four.component';
//import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSlimScrollModule, SLIMSCROLL_DEFAULTS } from 'ngx-slimscroll';
import { AddressFormModalComponent } from './components/modals/address-form-modal/address-form-modal.component';
import { ReachargeModalComponent } from './components/modals/recharge-modal/recharge-modal.component';
import { ConfirmModalComponent } from './components/modals/confirm-modal/confirm-modal.component';
import { ReviewModalComponent } from './components/modals/review-modal/review-modal.component';
import { ForgotPasswordModalComponent } from './components/modals/forgot-password-modal/forgot-password-modal.component';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImagePreviewModalComponent } from './components/modals/image-preview-modal/image-preview-modal.component';

// Angular Material Modules
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { SaleModalComponent } from './components/modals/sale-modal/sale-modal.component';

@NgModule({
  declarations: [
    // header
    CartMenuComponent,
    AccountMenuComponent,
    WishlistMenuComponent,
    MainMenuComponent,
    MainMenuRightComponent,
    HeaderSearchComponent,
    MobileButtonComponent,
    MobileMenuComponent,
    HeaderTopComponent,
    QuickViewInnerComponent,
    ReachargeModalComponent,
    QuickViewInnerModalComponent,
    ConfirmModalComponent,
    AddressFormModalComponent,
    ReviewModalComponent,
    ForgotPasswordModalComponent,

    HeaderComponent,
    FooterComponent,

    // product
    ProductOneComponent,
    ProductTwoComponent,
    ProductThreeComponent,
    ProductFourComponent,
    ProductFiveComponent,
    ProductSixComponent,
    ProductSevenComponent,
    ProductEightComponent,
    ProductNineComponent,
    ProductTenComponent,
    ProductElevenComponent,
    ProductTwelveComponent,
    ProductRelatedComponent,

    // single-use components
    BreadcrumbComponent,
    UserSidebarComponent,

    PageHeaderComponent,
    QuickViewComponent,
    QuickViewTwoComponent,
    NewsletterModalComponent,
    LoginModalComponent,
    VideoModalComponent,
    QuantityInputComponent,
    CountDownComponent,
    AccordionComponent,
    CardComponent,
    PaginationComponent,
    IsotopeGridComponent,
    ImageComponent,

    // directives
    BgParallaxDirective,
    TabClickDirective,
    ProductHoverDirective,
    ContentAnimDirective,

    // pipes
    CatFilterPipe,
    AttrFilterPipe,
    SafeContentPipe,
    CountDownComponent,

    // // blog-post
    PostOneComponent,
    PostTwoComponent,
    PostThreeComponent,
    PostFourComponent,
    CountToComponent,
    ImagePreviewModalComponent,
    SaleModalComponent,
  ],

  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    TranslateModule,
    // OwlModule,
    CarouselModule,
    LazyLoadImageModule,
    FormsModule,
    ReactiveFormsModule,
    LightboxModule,
    CalendarModule,
    //BrowserModule,
    NgSlimScrollModule,
    NgbDatepickerModule,
    NgSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
  ],
  providers: [
    {
      provide: SLIMSCROLL_DEFAULTS,
      useValue: {
        alwaysVisible: false,
        gridOpacity: '0.2',
        barOpacity: '0.5',
        gridBackground: '#fff',
        gridWidth: '6',
        gridMargin: '2px 2px',
        barBackground: '#fff',
        barWidth: '20',
        barMargin: '2px 2px',
      },
    },
  ],

  exports: [
    // header
    HeaderComponent,

    // mobile-menus
    MobileMenuComponent,
    QuickViewInnerComponent,
    QuickViewInnerModalComponent,
    ReachargeModalComponent,
    ConfirmModalComponent,
    AddressFormModalComponent,
    ReviewModalComponent,
    ForgotPasswordModalComponent,

    // footer
    FooterComponent,

    // products
    ProductOneComponent,
    ProductTwoComponent,
    ProductThreeComponent,
    ProductFourComponent,
    ProductFiveComponent,
    ProductSixComponent,
    ProductSevenComponent,
    ProductEightComponent,
    ProductNineComponent,
    ProductTenComponent,
    ProductElevenComponent,
    ProductTwelveComponent,
    ProductRelatedComponent,

    // // single-use components
    BreadcrumbComponent,
    UserSidebarComponent,

    PageHeaderComponent,
    CountDownComponent,
    CountToComponent,
    AccordionComponent,
    CardComponent,
    PaginationComponent,
    QuantityInputComponent,
    IsotopeGridComponent,
    ImageComponent,

    // directives
    BgParallaxDirective,
    TabClickDirective,
    ProductHoverDirective,
    ContentAnimDirective,

    // pipes
    CatFilterPipe,
    AttrFilterPipe,
    SafeContentPipe,

    // // blog-post
    PostOneComponent,
    PostTwoComponent,
    PostThreeComponent,
    PostFourComponent,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
  ],

  // entryComponents: [
  //   VideoModalComponent,
  //   QuickViewComponent,
  //   QuickViewTwoComponent,
  //   QuickViewInnerComponent,
  //   QuickViewInnerModalComponent,
  //   NewsletterModalComponent,
  //   LoginModalComponent,
  // ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
