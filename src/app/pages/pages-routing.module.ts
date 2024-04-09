import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishlistComponent } from './account/wishlist/wishlist.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ErrorComponent } from './error/error.component';
import { ChatComponent } from './chat/chat/chat.component';
import { PostsComponent } from './posts/posts.component';

import { authGuard } from '../services/guards/auth.guard';
import { userGuard } from '../services/guards/user.guard';

const routes: Routes = [
  { 
    path: 'wishlist', 
    component: WishlistComponent,
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
    path: '404', 
    component: ErrorComponent 
  },
  { 
    path: 'chats/:chatId',
    component: ChatComponent 
  },
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
