import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarPageComponent } from './sidebar.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SidebarPageComponent,
  },
  {
    path: ':slug',
    component: SidebarPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SidebarRoutingModule { }
