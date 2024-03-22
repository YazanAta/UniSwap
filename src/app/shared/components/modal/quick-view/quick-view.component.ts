import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { Post } from 'src/app/shared/interfaces/post.interface';
import { User } from 'src/app/shared/interfaces/user.interface';

import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { lastValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent implements OnInit, OnDestroy {
  @Input() post: Post;
  @ViewChild('quickView', { static: false }) quickViewTemplateRef: TemplateRef<any>;

  public closeResult: string;
  public modalOpen = false;

  ownerInfo: User;
  uid: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private userService: UserService,
    private wishlistService: WishlistService,
    private toastrService: CustomToastrService,
    private chatService: ChatService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const user = await this.authService.getUser();
      this.uid = user.uid;
      await this.loadOwnerInfo();
    } catch (error) {
      console.error('Error fetching user info', error);
    }
  }

  ngOnDestroy(): void {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

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

  async addToWishlist(id: string): Promise<void> {
    try {
      await this.wishlistService.addToWishlist(id, this.uid);
      this.toastrService.show('Product added to wishlist', 'Wishlist', 'success');
    } catch (error) {
      this.toastrService.show(error, 'Wishlist', 'error');
    }
  }

  async createChat(post: Post): Promise<void> {
    try {
      await this.chatService.createChat(post.ownerId, post.title);
    } catch (error) {
      this.toastrService.show('Unable to create chat', 'Chat', 'error');
      console.error('Error creating chat', error);
    }
  }

  private async loadOwnerInfo(): Promise<void> {
    try {
      this.ownerInfo = await lastValueFrom(this.userService.getUserInfoById(this.post.ownerId).pipe(take(1)));
    } catch (error) {
      console.error('Error loading owner info', error);
    }
  }

  private handleModalClose(result: any): void {
    this.closeResult = `Closed with: ${result}`;
  }

  private handleModalDismiss(reason: any): void {
    const reasons = {
      [ModalDismissReasons.ESC]: 'by pressing ESC',
      [ModalDismissReasons.BACKDROP_CLICK]: 'by clicking on a backdrop'
    };
    this.closeResult = `Dismissed ${reasons[reason] || `with: ${reason}`}`;
  }
}
