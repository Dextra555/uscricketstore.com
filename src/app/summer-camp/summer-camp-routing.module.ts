import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummerCampPageComponent } from '../summer-camp/summer-camp-page/summer-camp-page.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';

import { DOCUMENT, CommonModule } from '@angular/common';




const routes: Routes = [
  {
    path: '',
    component: SummerCampPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    MatExpansionModule,
    MatTabsModule,
    CommonModule,
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SummerCampRoutingModule { }
