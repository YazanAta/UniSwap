import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ManagePostModalComponent } from '../modals/manage-post-modal/manage-post-modal.component';

@Component({
  selector: 'app-manage-posts',
  templateUrl: './manage-posts.component.html',
  styleUrls: ['./manage-posts.component.scss']
})
export class ManagePostsComponent implements OnInit{
  posts: any
  @ViewChild("managePostsModal") managePostsModal: ManagePostModalComponent;

  constructor(private adminService: AdminService){}

  ngOnInit(): void {
    this.getAllPost()
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
  
}
