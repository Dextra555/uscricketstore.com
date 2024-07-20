import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarRoutingModule } from './sidebar-routing.module';
import { SidebarPageComponent } from './sidebar.component';
import { ShopModule } from '../shop.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SLIMSCROLL_DEFAULTS } from 'ngx-slimscroll';


@NgModule({
  declarations: [
    SidebarPageComponent
  ],
  imports: [
    CommonModule,
    SidebarRoutingModule,
    ShopModule,
    SharedModule,
		FormsModule,
		NgSelectModule,
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
export class SidebarModule { }
