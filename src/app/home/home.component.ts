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
  public active;

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
    title: 'Be A Renter',
    subTitle: 'Rent Now ..',
    image: 'assets/images/slider/28.jpg'
  }, {
    title: 'Be A Buyer',
    subTitle: 'Buy Now ..',
    image: 'assets/images/slider/29.jpg'
  }];

  // Collection banner
  public collections = [{
    image: 'assets/images/collection/marijuana/1.jpg',
    save: 'save 50%',
    title: 'oils',
    link: '/home/left-sidebar/collection/marijuana',
    class: 'p-left'
  }, {
    image: 'assets/images/collection/marijuana/2.jpg',
    save: 'save 20%',
    title: 'liquid',
    link: '/home/left-sidebar/collection/marijuana',
    class: 'p-right'
  }];

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  // Product Tab collection
  getCollectionProducts(collection) {
    return this.products.filter((item) => {
      if (item.collection.find(i => i === collection)) {
        return item
      }
    })
  }

}
