import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Post } from 'src/app/shared/interfaces/post.interface';

/**
 * Represents a product box component with interactive functionalities.
 */
@Component({
  selector: 'app-product-box-three',
  templateUrl: './product-box-three.component.html',
  styleUrls: ['./product-box-three.component.scss']
})
export class ProductBoxThreeComponent implements OnInit {
  /** Indicates whether a loader should be displayed. */
  @Input() loader: boolean;

  /** The post data displayed in the product box. */
  @Input() post: Post;

  /** Reference to the QuickViewComponent used within the template. */
  @ViewChild("quickView") quickView: QuickViewComponent;

  /** The user ID fetched from the authentication service. */
  private uid: string;

  constructor(
    private wishlistService: WishlistService,
    private toastrService: CustomToastrService,
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  /**
   * Initializes the component, fetches user data, and manages loader display.
   */
  ngOnInit(): void {
    this.initializeComponent();
  }

  /**
   * Initializes the component by fetching user data and handling loader display.
   */
  private async initializeComponent(): Promise<void> {
    this.showLoader();
    const user = await this.authService.getUser();
    this.uid = user.uid;
  }

  /**
   * Displays the loader for a specified duration to simulate loading.
   */
  private showLoader(): void {
    if (this.loader) {
      setTimeout(() => { this.loader = false; }, 2000);
    }
  }

  /**
   * Calculates the time difference between two timestamps.
   * @param timestamp The timestamp object containing seconds and nanoseconds.
   * @returns A formatted string representing the time difference.
   */
  getTimeDifference(timestamp: { seconds: number, nanoseconds: number }): string {
    const currentDate = new Date();
    const postDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return this.calculateTimeDifference(currentDate, postDate);
  }

  /**
   * Calculates the detailed time difference between two dates.
   * @param currentDate The current date.
   * @param postDate The date of the post.
   * @returns A formatted string representing the detailed time difference.
   */
  private calculateTimeDifference(currentDate: Date, postDate: Date): string {
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

  /**
   * Adds the current post to the user's wishlist.
   * @param id The ID of the post to add to the wishlist.
   */
  async addToWishlist(id: string): Promise<void> {
    try {
      const response = await this.wishlistService.addToWishlist(id, this.uid);
      this.toastrService.show(response, 'Wishlist', 'success');
    } catch (err) {
      this.toastrService.show(err, "Wishlist", 'error');
    }
  }

  /**
   * Initiates a chat with the post owner.
   * @param post The post object representing the item for sale.
   */
  async createChat(post: Post): Promise<void> {
    try {
      await this.chatService.createChat(post.ownerId, post.title);
    } catch (error) {
      this.toastrService.show("Failed to create chat", "Chat", 'error');
    }
  }
}
