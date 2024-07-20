import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentFailedRoutingModule } from './payment-failed-routing.module';
import { PaymentFailedComponent } from './payment-failed.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PaymentFailedComponent
  ],
  imports: [
    CommonModule,
    PaymentFailedRoutingModule,
    SharedModule,
  ]
})
export class PaymentFailedModule { }
