import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';
import { CATEGORIES, Category } from 'src/app/interfaces/category.interface';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @Input('selectedCategory') selectedCategory: string;

  public collapse: boolean = true;
  allCategories: Category[] = CATEGORIES;

  subCategories: Category[];

  constructor() {}

  ngOnInit(): void {
    this.getThisCategory(this.selectedCategory)
  }

  getThisCategory(category: string) {
    this.allCategories.map((categories) => {
      if (categories.name === category) {
        this.subCategories = categories.subCategory;
      }
    })
  }

}
