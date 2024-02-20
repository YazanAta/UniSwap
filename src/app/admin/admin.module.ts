import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { ManageAdminsComponent } from './manage-admins/manage-admins.component';
import { ManagePostsComponent } from './manage-posts/manage-posts.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManagePostModalComponent } from './modals/manage-post-modal/manage-post-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        AdminComponent,
        ManageAdminsComponent,
        ManagePostsComponent,
        ManageUsersComponent,
        ManagePostModalComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        ReactiveFormsModule,
        NgbModule,
        FormsModule
    ]
})
export class AdminModule { }
