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
import { AboutUsComponent } from './about-us/about-us.component';
import { ErrorComponent } from './error/error.component';
// Portfolio Components
import { ReactiveFormsModule } from '@angular/forms';

//FireBase Modules
import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@NgModule({
  declarations: [
    WishlistComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ProfileComponent,
    AboutUsComponent,
    ErrorComponent,
  ],
  imports: [
    CommonModule,
    GalleryModule,
    LightboxModule,
    SharedModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [
    AuthService,
    UserService
  ]
})
export class PagesModule { }
