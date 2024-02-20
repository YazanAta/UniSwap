import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

// Widgest Components
import { SliderComponent } from './widgets/slider/slider.component';
import { ServicesComponent } from './widgets/services/services.component';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    // Widgest Components
    SliderComponent,
    ServicesComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
