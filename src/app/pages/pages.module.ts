import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';

// Pages Components
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ProfileComponent } from './account/profile/profile.component';
import { WishlistComponent } from './account/wishlist/wishlist.component';  

import { ChatComponent } from './chat/chat/chat.component';
import { SwapListComponent } from './chat/swap-list/swap-list.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

import { PostsComponent } from './posts/posts.component';

import { ErrorComponent } from './error/error.component';
import { RequestsSectionComponent } from './account/profile/requests-section/requests-section.component';

// Services
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    WishlistComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ProfileComponent,
    ErrorComponent,
    ChatComponent,
    SwapListComponent,
    RequestsSectionComponent,
    PostsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    PickerComponent
  ],
  providers: []
})
export class PagesModule { }
