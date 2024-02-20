import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopComponent } from './shop/shop.component';
import { PagesComponent } from './pages/pages.component';
import { AdminComponent } from './admin/admin.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';
import { adminGuard } from './services/guards/admin.guard';
import { authGuard } from './services/guards/auth.guard';
import { userGuard } from './services/guards/user.guard';
import { guestGuard } from './services/guards/guest.guard';
import { ErrorComponent } from './pages/error/error.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        canActivate: [guestGuard]
      },
      {
        path: 'shop',
        component: ShopComponent,
        canActivate: [userGuard],
        loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
      },
      { 
        path: 'pages',
        component: PagesComponent,
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) 
      }
    ]
  },
  { 
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminComponent,
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) 
      }
    ]
  },
  {
    path: '**', // Navigate to Home Page if not found any page
    component: ErrorComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
