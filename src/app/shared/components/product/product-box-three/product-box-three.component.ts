import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { CartModalComponent } from "../../modal/cart-modal/cart-modal.component";
import { Product } from "../../../classes/product";
import { ProductService } from "../../../services/product.service";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-product-box-three',
  templateUrl: './product-box-three.component.html',
  styleUrls: ['./product-box-three.component.scss']
})
export class ProductBoxThreeComponent implements OnInit {

  @Input() loader: boolean = false;
  @Input() post: any;
  @ViewChild("quickView") QuickView: QuickViewComponent;
  @ViewChild("addPost") AddPost: CartModalComponent;

  users = {};

  constructor(private productService: ProductService, private fs: AngularFirestore) { }

  ngOnInit(): void {
    if(this.loader) {
      setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
    }

    this.fs.collection('users').get().subscribe(snapshot => {
      snapshot.docs.forEach(doc => {
        const userData = doc.data() as { email: string };
        this.users[doc.id] = userData.email
      });
    });
  }

  getOwnerEmail(userId: string) {
    return this.users[userId];
  }

}
