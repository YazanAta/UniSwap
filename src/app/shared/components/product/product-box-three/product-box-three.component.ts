import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Router } from '@angular/router';
import { Post } from 'src/app/shared/interfaces/post.interface';

@Component({
  selector: 'app-product-box-three',
  templateUrl: './product-box-three.component.html',
  styleUrls: ['./product-box-three.component.scss']
})
export class ProductBoxThreeComponent implements OnInit {
  @Input() loader: boolean;
  @Input() post: Post;
  @ViewChild("quickView") quickView: QuickViewComponent;

  private uid: string; // Stores the user ID after fetching from AuthService

  constructor(
    private wishlistService: WishlistService,
    private toastrService: CustomToastrService,
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Component initialization and user data fetching
    this.initializeComponent();
  }

  private async initializeComponent(): Promise<void> {
    // Displays loader if necessary and fetches user data
    this.showLoader();
    const user = await this.authService.getUser();
    this.uid = user.uid;
  }

  private showLoader(): void {
    // Sets a timeout to simulate a loading process for the component
    if (this.loader) {
      setTimeout(() => { this.loader = false; }, 2000);
    }
  }

  // Calculates and returns the time difference between the current time and the post's timestamp
  getTimeDifference(timestamp: { seconds: number, nanoseconds: number }): string {
    const currentDate = new Date();
    const postDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return this.calculateTimeDifference(currentDate, postDate);
  }

  private calculateTimeDifference(currentDate: Date, postDate: Date): string {
    // Helper method to calculate the detailed time difference
    const timeDifference = currentDate.getTime() - postDate.getTime();
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    if (days > 0) return `${days} d`;
    if (hours > 0) return `${hours} hrs`;
    if (minutes > 0) return `${minutes} min`;
    return `${seconds} s`;
  }

  // Adds the current post to the user's wishlist
  async addToWishlist(id: string): Promise<void> {
    try {
      // Wait for the wishlist service to add the item, then show success message
      const value = await this.wishlistService.addToWishlist(id, this.uid);
      this.toastrService.show(value, 'Wishlist', 'success');
    } catch (err) {
      // In case of an error, show the error message
      this.toastrService.show(err, "Wishlist", 'error');
    }
  }

  // Initiates a chat with the post owner
  async createChat(post: Post): Promise<void> {
    try {
      const chatId = await this.chatService.createChat(post.ownerId, post.title);
      if (!chatId) {
        this.toastrService.show("Chat Already Exists", "Chat", 'info');
        return;
      }
      this.navigateToChat(chatId);
    } catch (error) {
      this.toastrService.show("Failed to create chat", "Chat", 'error');
    }
  }

  // Navigates to the chat page using the router
  private navigateToChat(chatId: string): void {
    this.router.navigate([`/pages/chats/${chatId}`]);
  }
}
