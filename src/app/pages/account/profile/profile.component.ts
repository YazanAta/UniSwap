import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostsService } from 'src/app/services/posts/posts.service';
import { AddPostModalComponent } from 'src/app/shared/components/modal/add-post-modal/add-post-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy{

  // For displaying user data in the template
  public userData$ : Observable<User | null> = this.authService.user$;

  // user posts
  public posts: any[] = []

  // for unsubscribing
  private destroy$ = new Subject<void>();
  
  constructor(
    private authService: AuthService,
    private postsService: PostsService,
    private modalService: NgbModal) {}


  async ngOnInit() {

    // Get current userId and then and only then get his posts
    const user = await this.authService.getUser();
    this.getUserPosts(user.uid);

  }

  // Open add post modal
  public openModal() {
    this.modalService.open(AddPostModalComponent);
  }

  // Get user posts method
  public getUserPosts(uid: string) {
    this.postsService.getUserPosts(uid).pipe(takeUntil(this.destroy$))
    .subscribe({
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

  // unsubscribing
  ngOnDestroy() {
    // Emit a value to signal the destruction of the component
    this.destroy$.next();
    // Complete the subject to release resources
    this.destroy$.complete();
  }

}
