import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './shared/layout/layout.component';
// import { ClearanceSaleComponent } from './pages/clearance-sale/clearance-sale.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomeModule),
        
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./pages/others/pages.module').then((m) => m.PagesModule),
      },
      // {
      //   path: 'faq',
      //   loadChildren: () =>
      //   import('./pages/others/faq.module').then((m) => m.MyAccountModule)
      // },
      {
        path: 'category',
        loadChildren: () =>
          import('./pages/shop/sidebar/sidebar.module').then((m) => m.SidebarModule)
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./pages/product/product.module').then((m) => m.ProductModule),
      },
      // { path: 'summer-camp', loadChildren: () => import('./summer-camp/summer-camp.module').then(m => m.SummerCampModule) },
      // ,

      {
        path: 'summercamp',
        loadChildren: () =>
          import('./summer-camp/summer-camp.module').then((m) => m.SummerCampModule),
      },
      {
        path: 'academy',
        loadChildren: () =>
          import('./academy/academy.module').then((m) => m.AcademyModule),
      },
      {
        path: 'wishlist',
        loadChildren: () =>
          import('./pages/shop/wishlist/wishlist.module').then((m) => m.WishlistModule)
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./pages/shop/cart/cart.module').then((m) => m.CartModule)
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('./pages/shop/checkout/checkout.module').then((m) => m.CheckoutModule)
      },
      {
        path: 'braintree-payment',
        loadChildren: () =>
        import('./pages/shop/braintree-gateway/braintree-gateway.module').then((m) => m.BraintreeGatewayModule)
      },
      {
        path: 'about-us',
        loadChildren: () =>
        import('./pages/about/about.module').then((m) => m.AboutModule)
      },
      {
        path: 'contact-us',
        loadChildren: () =>
        import('./pages/contact/contact.module').then((m) => m.ContactModule)
      },
      {
        path: 'book-a-lane',
        loadChildren: () =>
        import('./pages/book-a-lane/book-a-lane.module').then((m) => m.BookALaneModule)
      },
      // {
      //   path: 'clearance-sale',
      //   component: ClearanceSaleComponent,
      // },
      {
        path: 'my-account',
        loadChildren: () =>
        import('./pages/my-account/my-account.module').then((m) => m.MyAccountModule)
      },

      
      {
        path: 'account-details',
        loadChildren: () =>
        import('./pages/account-details/account-details.module').then((m) => m.AccountDetailsModule)
      },
      {
        path: 'shipping-address',
        loadChildren: () =>
        import('./pages/shipping-address/shipping-address.module').then((m) => m.ShippingAddressModule)
      },
      {
        path: 'view-gallery',
        loadChildren: () =>
        import('./pages/view-gallery/view-gallery.module').then((m) => m.ViewGalleryModule)
      },
      //   {
      // 			path: 'privacy-policy',
      // 			component: PrivacyPolicyComponent
      // 		},
      //   {
      // 			path: 'return-policy',
      // 			component: ReturnPolicyComponent
      // 		},
      //   {
      // 			path: 'terms-and-conditions',
      // 			component: TermsAndConditionsComponent
      // 		},
      //   {
      // 			path: 'warranty-policy',
      // 			component: WarrantyPolicyComponent
      // 		},
      {
        path: 'order-confirmed/:id',
        loadChildren: () =>
        import('./pages/order-confirmed/order-confirmed.module').then((m) => m.OrderConfirmedModule)
      },
      {
        path: 'payment-failed/:id',
        loadChildren: () =>
        import('./pages/payment-failed/payment-failed.module').then((m) => m.PaymentFailedModule)
      },
      {
        path: 'bookings',
        loadChildren: () =>
        import('./pages/bookings/bookings.module').then((m) => m.BookingsModule)
      },
      {
        path: 'orders',
        loadChildren: () =>
        import('./pages/orders/orders.module').then((m) => m.OrdersModule)
      },
      {
        path: 'order-summary',
        loadChildren: () =>
        import('./pages/order-summary/order-summary.module').then((m) => m.OrderSummaryModule)
      },
      {
        path: 'order/:id',
        loadChildren: () =>
        import('./pages/order-details/order-details.module').then((m) => m.OrderDetailsModule)
      },
      {
        path: ':slug',
        loadChildren: () =>
        import('./pages/others/terms-and-conditions/terms-and-conditions.module').then((m) => m.TermsAndConditionsModule)
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    // redirectTo: '/pages/404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      anchorScrolling: 'disabled',
      scrollPositionRestoration: 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
