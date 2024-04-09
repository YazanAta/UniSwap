import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostsService } from 'src/app/services/posts/posts.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { EditPostModalComponent } from 'src/app/shared/components/modal/edit-post-modal/edit-post-modal.component';
import { DeleteModalComponent } from 'src/app/shared/components/product/collection/delete-modal/delete-modal.component';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { QuickViewComponent } from '../../modal/quick-view/quick-view.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  @Input() loader: boolean = false; // Input property to control the loader visibility
  @Input() post: Post; // Input property representing the post data

  constructor(
    private postsService: PostsService,
    private modalService: NgbModal,
    private toastr: CustomToastrService
  ) { }

  ngOnInit(): void {
    // Automatically disable loader after 2 seconds (simulated delay)
    if (this.loader) {
      setTimeout(() => this.loader = false, 2000);
    }
  }

  /**
   * Deletes a post by calling the postsService deletePost method.
   * Shows success or error toast messages accordingly.
   * @param post The post object to be deleted
   */
  async deletePost(post: Post) {
    try {
      await this.postsService.deletePost(post);
      this.toastr.show("Post Deleted Successfully", "Post", "success");
    } catch (err) {
      this.toastr.show("Error Deleting Post", "Post", "error");
    }
  }

  /**
   * Opens a delete confirmation modal for the specified post.
   * If user confirms deletion, calls deletePost method.
   * @param postData The post data to be passed to the modal
   * @param title The title to be displayed in the modal
   */
  openDeleteConfirmationModal(postData, title) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.postData = postData; // Pass post data to the modal
    modalRef.componentInstance.title = title; // Pass title to the modal

    // Handle modal result (user action)
    modalRef.result.then((result) => {
      if (result === "Delete") {
        this.deletePost(postData); // Call deletePost if user confirms deletion
      }
    });
  }

  /**
   * Opens an edit modal for the specified post if it's in "pending" state.
   * @param postData The post data to be passed to the edit modal
   */
  openEditModal(postData) {
    if (this.post.state == "pending") {
      const modalRef = this.modalService.open(EditPostModalComponent);
      modalRef.componentInstance.post = postData; // Pass post data to the edit modal
    }
  }

  /**
   * Opens a quick view modal.
   */
  openQuickViewModal() {
    this.modalService.open(QuickViewComponent);
  }
}
