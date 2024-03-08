import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishlistComponent } from './account/wishlist/wishlist.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { ProfileComponent } from './account/profile/profile.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ErrorComponent } from './error/error.component';
import { authGuard } from '../services/guards/auth.guard';
import { guestGuard } from '../services/guards/guest.guard';
import { userGuard } from '../services/guards/user.guard';
import { ChatComponent } from './chat/chat/chat.component';
import { PostsComponent } from './posts/posts.component';

const routes: Routes = [
  { 
    path: 'wishlist', 
    component: WishlistComponent ,
    canActivate: [userGuard]
  },
  { 
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'forget/password', 
    component: ForgetPasswordComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [userGuard] 
  },
  { 
    path: 'aboutus', 
    component: AboutUsComponent,
    canActivate: [guestGuard]
  },
  { 
    path: '404', 
    component: ErrorComponent 
  },
  { path: 'chats/:chatId', component: ChatComponent },
  {
    path: 'posts',
    component: PostsComponent,
    canActivate: [userGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
