import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SwapService } from 'src/app/services/swap/swap.service';
import { Post } from 'src/app/shared/interfaces/post.interface';

/**
 * Component responsible for managing requests section.
 */
@Component({
  selector: 'app-requests-section',
  templateUrl: './requests-section.component.html',
  styleUrls: ['./requests-section.component.scss']
})
export class RequestsSectionComponent implements OnInit {
  /** User ID of the current user. */
  uid: string;

  /** Flag to indicate if the confirmation modal is open. */
  confirmationModalOpen = false;

  /** Selected post for swap. */
  selectedPostSwap: Post;

  /** Reference to the confirmation modal. */
  modalRef: NgbModalRef;

  /** Flag to indicate if a swap action is in progress. */
  isSwapping = false;

  /** Array to hold requests as post objects. */
  requestsAsPost: any[];

  /** Reference to the confirmation modal content template. */
  @ViewChild("confirmationModalContent") confirmationModalContent: TemplateRef<any>;

  constructor(
    private swapService: SwapService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  /**
   * Lifecycle hook called after component initialization.
   * Initializes the user and fetches requests.
   */
  ngOnInit(): void {
    this.initializeUser();
  }

  /**
   * Initializes the current user and fetches their requests.
   */
  async initializeUser(): Promise<void> {
    try {
      const user = await this.authService.getUser();
      this.uid = user.uid;
      await this.getRequests(this.uid);
    } catch (error) {
      console.error('Failed to initialize user:', error);
      // Handle error (e.g., show error message)
    }
  }

  /**
   * Fetches requests for the specified user ID.
   * @param uid The user ID whose requests are to be fetched.
   */
  getRequests(uid: string): void {
    this.swapService.getRequests(uid)
      .pipe(
        catchError((error) => {
          console.error('Failed to fetch requests:', error);
          // Handle error (e.g., show error message)
          return throwError(error); // Re-throw the error to propagate it
        })
      )
      .subscribe((requests) => {
        this.requestsAsPost = requests;
      });
  }


  /**
   * Opens the confirmation modal with the selected post for swap.
   * @param post The post selected for swap.
   */
  openConfirmationModal(post: Post): void {
    this.modalRef = this.modalService.open(this.confirmationModalContent);
    this.selectedPostSwap = post;
    this.confirmationModalOpen = true;
  }

  /**
   * Handles the action to accept a swap request.
   * @param post The post representing the swap request to accept.
   */
  async accept(post: Post): Promise<void> {
    try {
      if (this.isSwapping) {
        return; // Do nothing if already submitting
      }
      this.isSwapping = true;
      await this.swapService.acceptSwap(post);
      setTimeout(() => {
        this.isSwapping = false;
        this.modalRef.close();
      }, 2000); // Close modal after 2 seconds (adjust as needed)
    } catch (error) {
      console.error('Failed to accept swap:', error);
      // Handle error (e.g., show error message)
    } finally {
      this.isSwapping = false;
    }
  }

  /**
   * Handles the action to reject a swap request.
   * @param post The post representing the swap request to reject.
   */
  async reject(post: Post): Promise<void> {
    try {
      if (this.isSwapping) {
        return; // Do nothing if already submitting
      }
      this.isSwapping = true;
      await this.swapService.rejectSwap(post);
    } catch (error) {
      console.error('Failed to reject swap:', error);
    } finally {
      this.isSwapping = false;
    }
  }
}
