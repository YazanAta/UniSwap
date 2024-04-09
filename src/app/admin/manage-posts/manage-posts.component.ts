import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ManagePostModalComponent } from '../modals/manage-post-modal/manage-post-modal.component';
import { Post } from 'src/app/shared/interfaces/post.interface';

/**
 * Component for managing posts by administrators.
 */
@Component({
  selector: 'app-manage-posts',
  templateUrl: './manage-posts.component.html',
  styleUrls: ['./manage-posts.component.scss']
})
export class ManagePostsComponent implements OnInit {

  /** The selected key for sorting posts. */
  selectedSortKey: string = '';

  /** The selected order for sorting posts ('asc' or 'desc'). */
  selectedSortOrder: string = '';

  /** Array of posts to be managed. */
  posts: Post[] = [];

  /** Reference to the ManagePostModalComponent instance. */
  @ViewChild("managePostsModal") managePostsModal: ManagePostModalComponent;

  /**
   * Constructs a new ManagePostsComponent.
   * @param adminService The AdminService for interacting with post management functionality.
   */
  constructor(private adminService: AdminService) {}

  /**
   * Initializes the component by fetching all posts.
   */
  ngOnInit(): void {
    this.getAllPost();
  }

  /**
   * Fetches all posts from the admin service and updates the posts array.
   */
  getAllPost(): void {
    this.adminService.getAllPosts().subscribe((posts) => {
      this.posts = posts;
    });
  }

  /**
   * Returns the CSS color class based on the post state.
   * @param state The state of the post ('pending', 'approved', 'rejected', 'deleted').
   * @returns The CSS color class corresponding to the post state.
   */
  getCircleColor(state: string): string {
    switch (state) {
      case 'pending':
        return 'orange'; // Change this to the color you want for 'pending'
      case 'approved':
        return 'green'; // Change this to the color you want for 'approved'
      case 'rejected':
        return 'red'; // Change this to the color you want for 'rejected'
      case 'deleted':
        return 'gray'; // Change this to the color you want for 'deleted'
      default:
        return 'black'; // Default color
    }
  }
  
  /**
   * Sorts the posts array based on the selected sort key and order.
   * If no key is selected, the array remains unchanged.
   */
  sortBy(): void {
    if (!this.selectedSortKey) {
      // Handle the case when no key is selected
      return;
    }

    // Sort the posts array based on the selected key and order
    this.posts.sort((a, b) => {
      const valueA = a[this.selectedSortKey];
      const valueB = b[this.selectedSortKey];

      if (valueA < valueB) {
        return this.selectedSortOrder === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.selectedSortOrder === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}

