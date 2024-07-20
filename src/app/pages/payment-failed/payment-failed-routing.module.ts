import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentFailedComponent } from './payment-failed.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentFailedComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentFailedRoutingModule { }
