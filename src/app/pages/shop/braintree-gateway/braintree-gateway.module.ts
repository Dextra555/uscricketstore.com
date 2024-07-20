import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BraintreeGatewayRoutingModule } from './braintree-gateway-routing.module';
import { BraintreeGatewayComponent } from './braintree-gateway.component';


@NgModule({
  declarations: [
    BraintreeGatewayComponent,
  ],
  imports: [
    CommonModule,
    BraintreeGatewayRoutingModule
  ]
})
export class BraintreeGatewayModule { }
