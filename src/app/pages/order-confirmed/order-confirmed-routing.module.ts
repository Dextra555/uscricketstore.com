import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderConfirmedComponent } from './order-confirmed.component';

const routes: Routes = [
  {
    path: '',
    component: OrderConfirmedComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderConfirmedRoutingModule { }
