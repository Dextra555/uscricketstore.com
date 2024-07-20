import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSlimScrollModule, SLIMSCROLL_DEFAULTS } from 'ngx-slimscroll';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    CheckoutComponent,
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
		SharedModule,
    FormsModule,
		ReactiveFormsModule,
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
})
export class CheckoutModule { }
