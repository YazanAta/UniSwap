import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSliderModule } from 'ngx-slider-v2';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared/shared.module';
import { ShopRoutingModule } from './shop-routing.module';

// Product Details Widgest Components
import { ServicesComponent } from './product/widgets/services/services.component';
import { CountdownComponent } from './product/widgets/countdown/countdown.component';

// Collection Components
import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';

// Collection Widgets
import { GridComponent } from './collection/widgets/grid/grid.component';
import { SizeComponent } from './collection/widgets/size/size.component';

import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    ServicesComponent,
    CountdownComponent,
    CollectionLeftSidebarComponent,
    GridComponent,
    SizeComponent
  ],
  imports: [
    CommonModule,
    NgxSliderModule,
    InfiniteScrollModule,
    SharedModule,
    ShopRoutingModule,
    RouterModule
  ]
})
export class ShopModule { }
