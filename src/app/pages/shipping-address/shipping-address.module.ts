import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingAddressRoutingModule } from './shipping-address-routing.module';
import { ShippingAddressComponent } from './shipping-address.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ShippingAddressComponent
  ],
  imports: [
    CommonModule,
    ShippingAddressRoutingModule,
		SharedModule,
  ]
})
export class ShippingAddressModule { }
