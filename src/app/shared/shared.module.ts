import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BarRatingModule } from "ngx-bar-rating";
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// Header and Footer Components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

// Components
import { MenuComponent } from './header/menu/menu.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ProductBoxThreeComponent } from './components/product/product-box-three/product-box-three.component';

// Modals Components
import { QuickViewComponent } from './components/modal/quick-view/quick-view.component';


// Tap To Top
import { TapToTopComponent } from './components/tap-to-top/tap-to-top.component';

// Pipes
import { SkeletonProductBoxComponent } from './components/product/skeleton/skeleton-product-box/skeleton-product-box.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { NotificationsSectionComponent } from './header/notifications-section/notifications-section.component';
import { EditPostModalComponent } from './components/modal/edit-post-modal/edit-post-modal.component';
import { SuccessfulRegistrationModalComponent } from './components/modal/successful-registration-modal/successful-registration-modal.component';
import { CollectionComponent } from './components/product/collection/collection.component';
import { ChatListComponent } from './components/chatlist/chatlist.component';
import { PointsDescriptionModalComponent } from './components/modal/points-description-modal/points-description-modal.component';
import { SwapConfirmationComponent } from './components/modal/swap-confirmation/swap-confirmation.component';
@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    BreadcrumbComponent,
    ProductBoxThreeComponent,
    QuickViewComponent,
    TapToTopComponent,
    FooterComponent,

    CollectionComponent,
    SkeletonProductBoxComponent,
    MainLayoutComponent,
    DashboardLayoutComponent,
    NotificationsSectionComponent,
    EditPostModalComponent,
    SuccessfulRegistrationModalComponent,
    ChatListComponent,
    PointsDescriptionModalComponent,
    SwapConfirmationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CarouselModule,
    BarRatingModule,
    LazyLoadImageModule,
    NgxSkeletonLoaderModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CarouselModule,
    BarRatingModule,
    LazyLoadImageModule,
    NgxSkeletonLoaderModule,
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent,
    ProductBoxThreeComponent,
    CollectionComponent,
    QuickViewComponent,
    TapToTopComponent,
    ProductBoxThreeComponent,
    SkeletonProductBoxComponent,
    MainLayoutComponent,
    DashboardLayoutComponent,
    ChatListComponent
  ],
  providers: [
    DatePipe
  ]
})
export class SharedModule { }
