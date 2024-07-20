import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { OwlModule } from 'angular-owl-carousel';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { NouisliderModule } from 'ng2-nouislider';
import { NgxSliderModule } from 'ngx-slider-v2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShopRoutingModule } from './shop-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

// import { SidebarPageComponent } from './sidebar/sidebar.component';
import { NosidebarPageComponent } from './nosidebar/nosidebar.component';
// import { CartComponent } from './cart/cart.component';
// import { WishlistComponent } from './wishlist/wishlist.component';
// import { CheckoutComponent } from './checkout/checkout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductCategoryBoxedPageComponent } from './product-category-boxed/product-category-boxed.component';
import { ProductCategoryFluidPageComponent } from './product-category-fluid/product-category-fluid.component';
import { ShopSidebarOneComponent } from './shared/sidebar/shop-sidebar-one/shop-sidebar-one.component';
import { ShopSidebarTwoComponent } from './shared/sidebar/shop-sidebar-two/shop-sidebar-two.component';
import { ShopSidebarThreeComponent } from './shared/sidebar/shop-sidebar-three/shop-sidebar-three.component';
import { MarketPageComponent } from './market/market.component';
import { ShopListOneComponent } from './shared/list/shop-list-one/shop-list-one.component';
import { ShopListTwoComponent } from './shared/list/shop-list-two/shop-list-two.component';
import { ShopListThreeComponent } from './shared/list/shop-list-three/shop-list-three.component';
import { NewCollectionShopComponent } from './shared/new-collection-shop/new-collection-shop.component';
import { NgSlimScrollModule, SLIMSCROLL_DEFAULTS } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { BraintreeGatewayComponent } from './braintree-gateway/braintree-gateway.component';

@NgModule( {
	declarations: [
		NewCollectionShopComponent,
		// SidebarPageComponent,
		NosidebarPageComponent,
		// CartComponent,
		// WishlistComponent,
		// CheckoutComponent,
		DashboardComponent,
		ProductCategoryBoxedPageComponent,
		ProductCategoryFluidPageComponent,
		ShopSidebarOneComponent,
		ShopSidebarTwoComponent,
		ShopSidebarThreeComponent,
		ShopListOneComponent,
		ShopListTwoComponent,
		ShopListThreeComponent,
		MarketPageComponent,
    // BraintreeGatewayComponent,
	],
	imports: [
    InfiniteScrollModule,
		CommonModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		ShopRoutingModule,
		RouterModule,
		NgbModule,
		// OwlModule,
		CarouselModule,
		NouisliderModule,
		NgxSliderModule,
		NgSlimScrollModule,
		NgSelectModule
	],
	providers: [ {
		provide: SLIMSCROLL_DEFAULTS,
		useValue: {
		  alwaysVisible: false,
		  gridOpacity: '0.2', barOpacity: '0.5',
		  gridBackground: '#fff',
		  gridWidth: '6',
		  gridMargin: '2px 2px',
		  barBackground: '#fff',
		  barWidth: '20',
		  barMargin: '2px 2px'
		}
	  }],
    exports: [
      ShopSidebarOneComponent,
      NewCollectionShopComponent,
      NosidebarPageComponent
    ]
} )

export class ShopModule { }
