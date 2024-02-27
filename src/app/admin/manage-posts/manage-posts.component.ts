import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ManagePostModalComponent } from '../modals/manage-post-modal/manage-post-modal.component';
import { Post } from 'src/app/shared/interfaces/post.interface';

@Component({
  selector: 'app-manage-posts',
  templateUrl: './manage-posts.component.html',
  styleUrls: ['./manage-posts.component.scss']
})
export class ManagePostsComponent implements OnInit{

  selectedSortKey: string = '';
  selectedSortOrder: string = ''; 

  posts: Post[] = [];
  @ViewChild("managePostsModal") managePostsModal: ManagePostModalComponent;

  constructor(private adminService: AdminService){}

  ngOnInit(): void {
    this.getAllPost();
  }

  getAllPost(){
    this.adminService.getAllPosts().subscribe((posts) => {
      this.posts = posts
    })
  }

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
  
  sortBy() {
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
