import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BraintreeGatewayComponent } from './braintree-gateway.component';

const routes: Routes = [
  {
    path: '',
    component: BraintreeGatewayComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BraintreeGatewayRoutingModule { }
