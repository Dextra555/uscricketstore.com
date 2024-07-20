import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlModule } from 'angular-owl-carousel';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

import { NewCollectionComponent } from './new-collection/new-collection.component';
import { FeaturedCollectionComponent } from './featured-collection/featured-collection.component';
import { IndexComponent } from './index/index.component';
//import{NgxShimmerLoadingModule}from 'ngx-shimmer-loading';
import { ScremerShimmerModule } from  'scremer-shimmer';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
	declarations: [
		NewCollectionComponent,
		FeaturedCollectionComponent,
		IndexComponent
	],

	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		NgbModule,
		// OwlModule,
		CarouselModule,
		SharedModule,
		// NgxShimmerLoadingModule,
		NgSelectModule,
		ScremerShimmerModule,
    HomeRoutingModule,
	]
})

export class HomeModule { }
