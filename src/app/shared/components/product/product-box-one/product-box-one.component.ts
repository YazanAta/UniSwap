import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { CartModalComponent } from "../../modal/cart-modal/cart-modal.component";
import { Product } from "../../../classes/product";
import { ProductService } from "../../../services/product.service";
import { Post } from 'src/app/interfaces/post.interface';
import { pid } from 'process';
import { PostsService } from 'src/app/services/posts/posts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-product-box-one',
  templateUrl: './product-box-one.component.html',
  styleUrls: ['./product-box-one.component.scss']
})
export class ProductBoxOneComponent implements OnInit {

  @Input() loader: boolean = false;
  @Input() post: any;

  constructor(private postsService: PostsService, private modalService: NgbModal, private notification: NotificationsService) { }

  ngOnInit(): void {
    if(this.loader) {
      setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
    }
  }


  deletePost(postId){
    this.postsService.deletePost(postId).then(() => {
      this.notification.show("Post Deleted Successfully", "Post", "success");
    }).catch((err) => {
      this.notification.show("Error Deleting Post", "Post", "error");
    });
  }

  openDeleteConfirmationModal(postId, title) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.postId = postId; // Pass post ID to the modal
    modalRef.componentInstance.title = title; // Pass post ID to the modal

    modalRef.result.then(
      (result) => {
        if(result == "Delete"){
          this.deletePost(postId);
        }
      }
    );
  }

}
