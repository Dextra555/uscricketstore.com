import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademyRoutingModule } from './academy-routing.module';
import { AcademyComponent } from './academy.component';



@NgModule({
  declarations: [
    AcademyComponent,
  ],
  imports: [
    CommonModule,
    AcademyRoutingModule,
  ]
})
export class AcademyModule { }
