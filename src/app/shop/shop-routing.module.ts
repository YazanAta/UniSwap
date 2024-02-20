import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';


const routes: Routes = [
  {
    path: 'collection/left/sidebar',
    component: CollectionLeftSidebarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
