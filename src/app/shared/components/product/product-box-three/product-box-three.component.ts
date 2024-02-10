import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { CartModalComponent } from "../../modal/cart-modal/cart-modal.component";
import { DatePipe } from '@angular/common';
import { ProductService } from "../../../services/product.service";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private productService: ProductService, private wishlist: WishlistService, private toastr: ToastrService) { }

  ngOnInit(): void {

    if(this.loader) {
      setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
    }

  }

  getTimeDifference(timestamp: { seconds: number, nanoseconds: number }): string {
    const currentDate = new Date();
    const postDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    const timeDifference = currentDate.getTime() - postDate.getTime();

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} d`;
    } else if (hours > 0) {
      return `${hours} hrs`;
    } else if (minutes > 0) {
      return `${minutes} min`;
    } else {
      return `${seconds} s`;
    }
  }

  addToWishlist(id: string): void {
    this.wishlist.addToWishlist(id)
    .then(
      (value) => {
        this.toastr.success(value,'Wishlist');
      })
    .catch(
      (err) => {
        this.toastr.error(err, "Wishlist")
      })
  }
}
