import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummerCampRoutingModule } from './summer-camp-routing.module';
import { SummerCampPageComponent } from '../summer-camp/summer-camp-page/summer-camp-page.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SummerCampRoutingModule,
    MatTabsModule,
    MatExpansionModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SummerCampModule { }
