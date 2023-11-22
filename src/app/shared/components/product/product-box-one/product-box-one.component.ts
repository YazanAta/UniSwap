import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { CartModalComponent } from "../../modal/cart-modal/cart-modal.component";
import { Product } from "../../../classes/product";
import { ProductService } from "../../../services/product.service";
import { Post } from 'src/app/interfaces/post.interface';
import { pid } from 'process';

@Component({
  selector: 'app-product-box-one',
  templateUrl: './product-box-one.component.html',
  styleUrls: ['./product-box-one.component.scss']
})
export class ProductBoxOneComponent implements OnInit {

  @Input() loader: boolean = false;
  @Input() post: any;
  @ViewChild("quickView") QuickView: QuickViewComponent;
  @ViewChild("addPost") AddPost: CartModalComponent;


  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    if(this.loader) {
      setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
    }
  }


}
