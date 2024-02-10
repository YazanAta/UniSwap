import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, switchMap } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
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

  userData$ = this.userService.getUserInfo();
  posts: any[] = []

  constructor(private userService: UserService, private authService: AuthService, private postsService: PostsService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getUserPosts();
  }

  openModal() {
    this.modalService.open(AddPostModalComponent);
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
