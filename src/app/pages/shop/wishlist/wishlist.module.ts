import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishlistRoutingModule } from './wishlist-routing.module';
import { WishlistComponent } from './wishlist.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShopModule } from '../shop.module';


@NgModule({
  declarations: [
    WishlistComponent,
  ],
  imports: [
    CommonModule,
    WishlistRoutingModule,
		SharedModule,
    ShopModule
  ]
})
export class WishlistModule { }
