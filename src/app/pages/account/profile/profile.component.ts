import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostsService } from 'src/app/services/posts/posts.service';
import { UserService } from 'src/app/services/user/user.service';
import { AddPostModalComponent } from 'src/app/shared/components/modal/add-post-modal/add-post-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userId: string
  userData: any
  posts: any[] = []

  constructor(private userService: UserService, private authService: AuthService, private postsService: PostsService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getUserData()
    this.getUserPosts()
  }

  openModal() {
    this.modalService.open(AddPostModalComponent);
  }

  getUserData() {
    this.userService.getUserInfo().subscribe({
      next: (data) => {
        this.userData = data;
        console.log(data);
      },
      error: (err) => {
        console.error(err);
        // Handle the error here
      }
    });
  }

  getUserPosts() {
    this.postsService.getUserPosts().subscribe({
      next: (data: Array<any>) => {
        this.posts = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          }
        });
      },
      error: (err) => {
        console.error(err);
        // Handle the error here
      }
    });
  }

}
