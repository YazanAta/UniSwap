import { Component, OnInit, Input } from '@angular/core';
import { PostsService } from 'src/app/services/posts/posts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { EditPostModalComponent } from '../../modal/edit-post-modal/edit-post-modal.component';

@Component({
  selector: 'app-product-box-one',
  templateUrl: './product-box-one.component.html',
  styleUrls: ['./product-box-one.component.scss']
})
export class ProductBoxOneComponent implements OnInit {

  @Input() loader: boolean = false;
  @Input() post: any; // Assuming 'post' is of type any, adjust as needed

  constructor(private postsService: PostsService, private modalService: NgbModal, private toastr: CustomToastrService) { }

  ngOnInit(): void {
    if(this.loader) {
      setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
    }
  }


  deletePost(post){
    this.postsService.deletePost(post).then(() => {
      this.toastr.show("Post Deleted Successfully", "Post", "success");
    }).catch((err) => {
      this.toastr.show("Error Deleting Post", "Post", "error");
    });
  }

  openDeleteConfirmationModal(postData, title) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.postData = postData; // Pass post ID to the modal
    modalRef.componentInstance.title = title; // Pass post ID to the modal

    modalRef.result.then(
      (result) => {
        if(result == "Delete"){
          this.deletePost(postData);
        }
      }
    );
  }

  openEditModal(postData) {
    if(this.post.state == "pending"){
      const modalRef = this.modalService.open(EditPostModalComponent);
      modalRef.componentInstance.post = postData; // Pass post ID to the modal
    }
  }

}
