import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Post } from 'src/app/shared/interfaces/post.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { QuickViewComponent } from 'src/app/shared/components/modal/quick-view/quick-view.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlist: Post[] = [];
  uid: string;
  isLoading = true; // Track loading state

  @ViewChild('quickView') quickView: QuickViewComponent;
  private destroy$ = new Subject<void>();

  constructor(
    private wishlistService: WishlistService,
    private toastrService: CustomToastrService,
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const user = await this.authService.getUser();
      this.uid = user.uid;
      this.getUserWishlist(this.uid);
    } catch (error) {
      this.toastrService.show("Error fetching user data", "Error", "error");
    }
  }

  private getUserWishlist(uid: string): void {
    this.wishlistService.getUserWishlist(uid).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (posts) => {
        this.wishlist = posts;
        this.isLoading = false; // Update loading state
      },
      error: (error) => this.toastrService.show("Error fetching wishlist", "Error", "error")
    });
  }

  async removeFromWishlist(id: string): Promise<void> {
    try {
      await this.wishlistService.removeFromWishlist(id, this.uid);
      this.toastrService.show("Item removed from wishlist", "Wishlist", "success");
    } catch (err) {
      this.toastrService.show(err, "Wishlist", "error");
    }
  }
  
  async createChat(post: Post): Promise<void> {
    try {
      await this.chatService.createChat(post.ownerId, post.title);
    } catch (error) {
      this.toastrService.show("Failed to create chat", "Chat", 'error');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
