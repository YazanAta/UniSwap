import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../shared/classes/product';
import { CATEGORIES, Category } from 'src/app/interfaces/category.interface';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  subCategories: Category[] = CATEGORIES
  
  public collapse: boolean = true;

  constructor() { 
  }

  ngOnInit(): void {
  }

}
