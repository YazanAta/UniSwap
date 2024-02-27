import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostsService } from 'src/app/services/posts/posts.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { EditPostModalComponent } from 'src/app/shared/components/modal/edit-post-modal/edit-post-modal.component';
import { DeleteModalComponent } from 'src/app/shared/components/product/product-box-one/delete-modal/delete-modal.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

 
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