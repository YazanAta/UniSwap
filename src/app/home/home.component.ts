import { Component } from '@angular/core';
import { Product } from '../shared/classes/product';
import { ProductSlider } from '../shared/data/slider';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public themeFooterLogo: string = 'assets/images/icon/logo-9.png';

  public products: Product[] = [];
  public productCollections: any[] = [];

  public ProductSliderConfig: any = ProductSlider;

  constructor(public productService: ProductService) {
    this.productService.getProducts.subscribe(response => {
      this.products = response.filter(item => item.type == 'marijuana');
      // Get Product Collection
      this.products.filter((item) => {
        item.collection.filter((collection) => {
          const index = this.productCollections.indexOf(collection);
          if (index === -1) this.productCollections.push(collection);
        })
      })
    });
  }

  public sliders = [{
    title: 'Unleash the UniSwap Experience!',
    subTitle: 'Give, Swap, Buy',
    image: 'assets/images/slider/31.jpg'
  }, {
    title: 'More Than a Swap, It\'s a Community Sharing Platform',
    subTitle: 'UniSwap',
    image: 'assets/images/slider/30.jpg'
  }];

  // Collection banner
  public collections = [{
    image: 'assets/collection1.png',
    title: 'Give',
    link: '/home/left-sidebar/collection/marijuana',
    class: 'p-left'
  }, {
    image: 'assets/collection2.png',
    title: 'Excahnge',
    link: '/home/left-sidebar/collection/marijuana',
    class: 'p-right'
  }];

  //Categories
  public categories = [{
    image: 'assets/images/categories/17.jpeg',
    title: 'Text Books',
    link: '/home/left-sidebar/collection/marijuana',
    class: 'p-left'
  }, {
    image: 'assets/images/categories/18.jpeg',
    title: 'Uniforms',
    link: '/home/left-sidebar/collection/marijuana',
    class: 'p-right'
  }];

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
