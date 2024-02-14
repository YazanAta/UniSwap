import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { PostsComponent } from './posts/posts.component';
import { UsersComponent } from './users/users.component';


@NgModule({
    declarations: [
        AdminComponent,
        PostsComponent,
        UsersComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        SharedModule
    ]
})
export class AdminModule { }
