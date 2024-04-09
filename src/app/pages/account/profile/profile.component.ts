import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostsService } from 'src/app/services/posts/posts.service';
import { AddPostModalComponent } from 'src/app/shared/components/modal/add-post-modal/add-post-modal.component';

/**
 * Component representing the user profile page.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  /** Observable holding the user data. */
  public userData$: Observable<User | null> = this.authService.user$;

  /** Array to hold user posts displayed in the template. */
  public posts: any[] = [];

  /** Subject to manage component destruction and unsubscribe from observables. */
  private destroy$ = new Subject<void>();

  /**
   * Creates an instance of ProfileComponent.
   * @param authService The authentication service for user-related operations.
   * @param postsService The service for fetching user posts.
   * @param modalService The NgbModal service for opening modals.
   */
  constructor(
    private authService: AuthService,
    private postsService: PostsService,
    private modalService: NgbModal
  ) {}

  /**
   * Lifecycle hook called after component initialization.
   * Fetches user posts upon component initialization.
   */
  async ngOnInit(): Promise<void> {
    // Get current user's ID and fetch their posts
    const user = await this.authService.getUser();
    this.getUserPosts(user.uid);
  }

  /**
   * Fetches user posts based on the provided user ID.
   * @param uid The user ID whose posts are to be fetched.
   */
  public getUserPosts(uid: string): void {
    this.postsService.getUserPosts(uid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (posts: any[]) => {
          this.posts = posts;
        },
        error: (err) => {
          console.error('Failed to fetch user posts:', err);
          // Handle the error here (e.g., display error message)
        }
      });
  }

  /**
   * Opens the add post modal.
   */
  public openModal(): void {
    this.modalService.open(AddPostModalComponent);
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from observables to prevent memory leaks.
   */
  ngOnDestroy(): void {
    // Emit a value to signal the destruction of the component
    this.destroy$.next();
    // Complete the subject to release resources
    this.destroy$.complete();
  }
}
