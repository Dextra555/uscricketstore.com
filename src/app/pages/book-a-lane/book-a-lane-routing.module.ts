import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookALaneComponent } from './book-a-lane.component';

const routes: Routes = [
  {
    path: '',
    component: BookALaneComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookALaneRoutingModule { }
