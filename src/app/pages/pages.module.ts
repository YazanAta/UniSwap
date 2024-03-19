import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { GalleryModule } from '@ks89/angular-modal-gallery';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';

import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';

// Pages Components
import { WishlistComponent } from './account/wishlist/wishlist.component';  
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ErrorComponent } from './error/error.component';
// Portfolio Components
import { ReactiveFormsModule } from '@angular/forms';

//FireBase Modules
import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { ChatComponent } from './chat/chat/chat.component';

import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { SwapListComponent } from './chat/swap-list/swap-list.component';
import { RequestsSectionComponent } from './account/profile/requests-section/requests-section.component';
import { PostsComponent } from './posts/posts.component';


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
    GalleryModule,
    LightboxModule,
    SharedModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    PickerComponent
  ],
  providers: [
    AuthService,
    UserService
  ]
})
export class PagesModule { }
