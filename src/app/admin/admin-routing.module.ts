import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ManagePostsComponent } from './manage-posts/manage-posts.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageAdminsComponent } from './manage-admins/manage-admins.component';

const routes: Routes = [
  {
    path: "",
    component: AdminComponent
  },
  {
    path: "posts",
    component: ManagePostsComponent
  },
  {
    path: "users",
    component: ManageUsersComponent
  },
  {
    path: "admins",
    component: ManageAdminsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
