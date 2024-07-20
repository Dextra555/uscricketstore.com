import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewGalleryRoutingModule } from './view-gallery-routing.module';
import { ViewGalleryComponent } from './view-gallery.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ViewGalleryComponent
  ],
  imports: [
    CommonModule,
    ViewGalleryRoutingModule,
		SharedModule,
  ]
})
export class ViewGalleryModule { }
