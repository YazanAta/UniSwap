import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Post } from 'src/app/shared/interfaces/post.interface';
import { User } from 'src/app/shared/interfaces/user.interface';

import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { lastValueFrom, take } from 'rxjs';

/**
 * Component for displaying a quick view of a post.
 */
@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent implements OnInit, OnDestroy {
  /**
   * Input property representing the post to display.
   */
  @Input() post: Post;

  /**
   * Reference to the quick view modal template.
   */
  @ViewChild('quickView', { static: false }) quickViewTemplateRef: TemplateRef<any>;

  /**
   * Result of the modal close operation.
   */
  public closeResult: string;

  /**
   * Flag indicating whether the modal is currently open.
   */
  public modalOpen = false;

  /**
   * Information about the owner of the displayed post.
   */
  ownerInfo: User;

  /**
   * The UID of the authenticated user.
   */
  uid: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal,
    private authService: AuthService,
    private userService: UserService,
    private wishlistService: WishlistService,
    private toastrService: CustomToastrService,
    private chatService: ChatService
  ) {}

  /**
   * Lifecycle hook called after component initialization.
   * Initializes the component and loads owner information.
   */
  ngOnInit(): void {
    this.authService.getUser().then(user => {
      this.uid = user.uid;
      this.loadOwnerInfo();
    }).catch(error => {
      console.error('Error fetching user info', error);
    });
  }

  /**
   * Lifecycle hook called before component destruction.
   * Closes the modal if it's open to prevent memory leaks.
   */
  ngOnDestroy(): void {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

  /**
   * Opens the quick view modal.
   */
  openModal(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService.open(this.quickViewTemplateRef, { 
        size: 'lg', 
        ariaLabelledBy: 'modal-basic-title', 
        centered: true, 
        windowClass: 'quickview' 
      }).result.then(
        result => this.handleModalClose(result),
        reason => this.handleModalDismiss(reason)
      );
      this.modalOpen = true;
    }
  }

  /**
   * Adds the post to the user's wishlist.
   * @param id The ID of the post to add to the wishlist.
   */
  async addToWishlist(id: string): Promise<void> {
    try {
      const response = await this.wishlistService.addToWishlist(id, this.uid);
      this.toastrService.show(response, 'Wishlist', 'success');
    } catch (error) {
      this.toastrService.show(error, 'Wishlist', 'error');
    }
  }

  /**
   * Initiates a chat with the owner of the post.
   * @param post The post with which to initiate the chat.
   */
  async createChat(post: Post): Promise<void> {
    try {
      await this.chatService.createChat(post.ownerId, post.title);
    } catch (error) {
      this.toastrService.show('Unable to create chat', 'Chat', 'error');
      console.error('Error creating chat', error);
    }
  }

  /**
   * Loads information about the owner of the post.
   */
  private async loadOwnerInfo(): Promise<void> {
    try {
      this.ownerInfo = await lastValueFrom(this.userService.getUserInfoById(this.post.ownerId).pipe(take(1)));
    } catch (error) {
      console.error('Error loading owner info', error);
    }
  }

  /**
   * Handles the result of the modal close operation.
   * @param result The result of the modal close operation.
   */
  private handleModalClose(result: any): void {
    this.closeResult = `Closed with: ${result}`;
  }

  /**
   * Handles the reason for dismissing the modal.
   * @param reason The reason for dismissing the modal.
   */
  private handleModalDismiss(reason: any): void {
    const reasons = {
      [ModalDismissReasons.ESC]: 'by pressing ESC',
      [ModalDismissReasons.BACKDROP_CLICK]: 'by clicking on a backdrop'
    };
    this.closeResult = `Dismissed ${reasons[reason] || `with: ${reason}`}`;
  }
}
