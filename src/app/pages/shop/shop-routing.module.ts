import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { SidebarPageComponent } from './sidebar/sidebar.component';

const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //         import('./sidebar/sidebar.module').then((m) => m.SidebarModule)
  // },
  // {
  //   path: ':slug',
  //   loadChildren: () =>
  //         import('./sidebar/sidebar.module').then((m) => m.SidebarModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
