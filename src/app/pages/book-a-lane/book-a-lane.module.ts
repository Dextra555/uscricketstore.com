import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookALaneRoutingModule } from './book-a-lane-routing.module';
import { FormsModule } from '@angular/forms';
import { BookALaneComponent } from './book-a-lane.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    BookALaneComponent
  ],
  imports: [
    CommonModule,
    BookALaneRoutingModule,
    FormsModule,
    NgbModule,
  ]
})
export class BookALaneModule { }
