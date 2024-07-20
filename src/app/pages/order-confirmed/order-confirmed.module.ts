import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderConfirmedRoutingModule } from './order-confirmed-routing.module';
import { OrderConfirmedComponent } from './order-confirmed.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    OrderConfirmedComponent
  ],
  imports: [
    CommonModule,
    OrderConfirmedRoutingModule,
    SharedModule,
  ]
})
export class OrderConfirmedModule { }
