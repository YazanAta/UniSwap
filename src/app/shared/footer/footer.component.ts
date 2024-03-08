import { Component, Input } from '@angular/core';
import { CATEGORIES, Category } from '../interfaces/category.interface';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @Input() themeLogo: string = 'assets/logo.png' // Default Logo

  public categories: Category[] = CATEGORIES;

  constructor() { }

}
