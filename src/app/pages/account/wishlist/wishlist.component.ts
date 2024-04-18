import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Post } from 'src/app/shared/interfaces/post.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { QuickViewComponent } from 'src/app/shared/components/modal/quick-view/quick-view.component';

/**
 * Component responsible for managing the user's wishlist.
 */
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {
  /** Array to hold the user's wishlist of posts. */
  wishlist: Post[] = [];

  /** User ID of the current user. */
  uid: string;

  /** Flag to track loading state of the component. */
  isLoading = true;

  /** Reference to the QuickViewComponent for displaying post details. */
  @ViewChild('quickView') quickView: QuickViewComponent;

  /** Subject to manage component destruction and unsubscribe from observables. */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Constructs an instance of WishlistComponent.
   * @param wishlistService The service for managing user wishlists.
   * @param toastrService The service for displaying toast messages.
   * @param authService The authentication service for user-related operations.
   * @param chatService The service for managing chat operations.
   */
  constructor(
    private wishlistService: WishlistService,
    private toastrService: CustomToastrService,
    private authService: AuthService,
    private chatService: ChatService,
  ) {}

  /**
   * Lifecycle hook called after component initialization.
   * Initializes the component by fetching user data and wishlist.
   */
  async ngOnInit(): Promise<void> {
    this.getUserData();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from observables to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Fetches user data (current user ID) upon component initialization.
   * If successful, fetches the user's wishlist.
   * Displays error message if user data fetching fails.
   */
  private async getUserData(): Promise<void> {
    try {
      const user = await this.authService.getUser();
      this.uid = user.uid;
      this.fetchUserWishlist();
    } catch (error) {
      this.toastrService.show('Error fetching user data', 'Error', 'error');
    }
  }

  /**
   * Fetches the user's wishlist based on the current user ID.
   * Sets the wishlist array and updates the loading state.
   * Displays error message if wishlist fetching fails.
   */
  private fetchUserWishlist(): void {
    this.wishlistService.getUserWishlist(this.uid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (posts: Post[]) => {
          this.wishlist = posts;
          this.isLoading = false;
        },
        error: () => {
          this.toastrService.show('Error fetching wishlist', 'Error', 'error');
          this.isLoading = false; // Set loading state to false on error
        }
      });
  }

  /**
   * Removes a post from the user's wishlist based on the provided post ID.
   * Displays success or error message upon removal completion.
   * @param id The ID of the post to be removed from the wishlist.
   */
  async removeFromWishlist(id: string): Promise<void> {
    try {
      const response = await this.wishlistService.removeFromWishlist(id, this.uid);
      this.toastrService.show(response, "Wishlist", "success");
    } catch (err) {
      this.toastrService.show(err, "Wishlist", "error");
    }
  }
  
  /**
   * Initiates a chat with the owner of a specific post.
   * Displays error message if chat initiation fails.
   * @param post The post with which to initiate the chat.
   */
  async createChat(post: Post): Promise<void> {
    try {
      await this.chatService.createChat(post.ownerId, post.title);
    } catch (error) {
      this.toastrService.show("Failed to create chat", "Chat", 'error');
    }
  }
}