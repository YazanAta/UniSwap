import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SwapService } from 'src/app/services/swap/swap.service';
import { Post } from 'src/app/shared/interfaces/post.interface';

@Component({
  selector: 'app-requests-section',
  templateUrl: './requests-section.component.html',
  styleUrls: ['./requests-section.component.scss']
})
export class RequestsSectionComponent implements OnInit {
  uid: string;
  confirmationModalOpen = false;
  selectedPostSwap: Post;
  modalRef: NgbModalRef;
  isSwapping = false;
  requestsAsPost: any[];

  @ViewChild("confirmationModalContent") confirmationModalContent: TemplateRef<any>;

  constructor(
    private swapService: SwapService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initializeUser();
  }

  async initializeUser(): Promise<void> {
    const user = await this.authService.getUser();
    this.uid = user.uid;
    await this.getRequests(this.uid);
  }

  async getRequests(uid: string): Promise<void> {
    this.swapService.getRequests(uid).subscribe((requests) => {
      this.requestsAsPost = requests;
    });
  }

  openConfirmationModal(post: Post): void {
    this.modalRef = this.modalService.open(this.confirmationModalContent);
    this.selectedPostSwap = post;
    this.confirmationModalOpen = true;
  }

  async accept(post: Post, uid: string): Promise<void> {
    try {
      if (this.isSwapping) {
        return; // Do nothing if already submitting
      }
      this.isSwapping = true;
      await this.swapService.acceptSwap(post, uid);
      setTimeout(() => {
        this.isSwapping = false;
        this.modalRef.close();
      }, 2000);
    } catch (error) {
      console.error(error);
      this.isSwapping = false;
    }
  }

  async reject(post: Post, uid: string): Promise<void> {
    try {
      if (this.isSwapping) {
        return; // Do nothing if already submitting
      }
      this.isSwapping = true;
      await this.swapService.rejectSwap(post, uid);
    } catch (error) {
      console.error(error);
    } finally {
      this.isSwapping = false;
    }
  }
}
