import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishlistComponent } from './account/wishlist/wishlist.component';
import { DashboardComponent } from './account/dashboard/dashboard.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { ProfileComponent } from './account/profile/profile.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ReviewComponent } from './review/review.component';
import { CollectionComponent } from './collection/collection.component';
import { ErrorComponent } from './error/error.component';
import { FaqComponent } from './faq/faq.component';
import { GridTwoComponent } from './portfolio/grid-two/grid-two.component';
import { GridThreeComponent } from './portfolio/grid-three/grid-three.component';
import { GridFourComponent } from './portfolio/grid-four/grid-four.component';
import { MasonryGridTwoComponent } from './portfolio/masonry-grid-two/masonry-grid-two.component';
import { MasonryGridThreeComponent } from './portfolio/masonry-grid-three/masonry-grid-three.component';
import { MasonryGridFourComponent } from './portfolio/masonry-grid-four/masonry-grid-four.component';
import { MasonryFullWidthComponent } from './portfolio/masonry-full-width/masonry-full-width.component';
import { authGuardNotUser, authGuardUser } from '../services/guards/auth.guard';

const routes: Routes = [
  { 
    path: 'wishlist', 
    component: WishlistComponent 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent 
  },
  { 
    path: 'login',
    component: LoginComponent  ,
    canActivate: [authGuardUser]
  },
  { 
    path: 'register', 
    component: RegisterComponent  ,
    canActivate: [authGuardUser]
  },
  { 
    path: 'forget/password', 
    component: ForgetPasswordComponent 
  },
  { 
    path: 'profile', 
    component: ProfileComponent ,
    canActivate: [authGuardNotUser]
  },
  { 
    path: 'aboutus', 
    component: AboutUsComponent 
  },
  { 
    path: 'review', 
    component: ReviewComponent 
  },
  { 
    path: 'collection', 
    component: CollectionComponent 
  },
  { 
    path: '404', 
    component: ErrorComponent 
  },
  { 
    path: 'faq', 
    component: FaqComponent 
  },
  { 
    path: 'portfolio/grid/two', 
    component: GridTwoComponent 
  },
  { 
    path: 'portfolio/grid/three', 
    component: GridThreeComponent 
  },
  { 
    path: 'portfolio/grid/four', 
    component: GridFourComponent 
  },
  { 
    path: 'portfolio/masonry/grid/two', 
    component: MasonryGridTwoComponent 
  },
  { 
    path: 'portfolio/masonry/grid/three', 
    component: MasonryGridThreeComponent 
  },
  { 
    path: 'portfolio/masonry/grid/four', 
    component: MasonryGridFourComponent 
  },
  { 
    path: 'portfolio/masonry/full-width', 
    component: MasonryFullWidthComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
