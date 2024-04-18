import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, lastValueFrom } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SwapService } from 'src/app/services/swap/swap.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { UserService } from 'src/app/services/user/user.service';
import { SwapConfirmationComponent } from 'src/app/shared/components/modal/swap-confirmation/swap-confirmation.component';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { User } from 'src/app/shared/interfaces/user.interface';

/**
 * Component responsible for displaying a list of posts for swapping and handling swap requests.
 */
@Component({
  selector: 'app-swap-list',
  templateUrl: './swap-list.component.html',
  styleUrls: ['./swap-list.component.scss']
})
export class SwapListComponent implements OnInit, OnDestroy {
  /** Input property representing the other participant in the swap. */
  @Input() otherParticipant: User;

  /** Input property representing the current user's ID. */
  @Input() uid: string;

  /** Array of posts available for swapping. */
  public posts: Post[] = [];

  /** Flag to track if a swap request is in progress. */
  public isSwapping = false;
  private destroy$ = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    private swapService: SwapService,
    private userService: UserService,
    private toastrService: CustomToastrService,
    private modalService: NgbModal
  ) {}

  /**
   * Lifecycle hook called after component initialization.
   * Retrieves posts available for swapping for the other participant.
   */
  ngOnInit(): void {
    this.fetchUserPosts();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Retrieves posts available for swapping from the swap service.
   */
  private fetchUserPosts(): void {
    this.swapService.getSwapList(this.otherParticipant.uid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (posts: Post[]) => this.posts = posts,
        error: (err) => {
          console.error('Failed to fetch user posts:', err);
          this.toastrService.show('Failed to fetch user posts', 'Error', 'error');
        }
      });
  }

  /**
   * Initiates a swap request with the selected post and the other participant.
   * @param post The post selected for swapping.
   */
  async swapRequest(post: Post): Promise<void> {
    if (this.isSwapping) return;
  
    const modalRef = this.modalService.open(SwapConfirmationComponent, { centered: true });
  
    modalRef.result.then(async (result) => {
      if (result === 'confirm') {
        this.isSwapping = true;
        try {
          // Retrieve user information of the current user
          const user = await lastValueFrom(this.userService.getUserInfoById(this.uid).pipe(take(1)));
          
          // Send swap request to the other participant
          await this.swapService.swapRequest(this.otherParticipant.uid, user, post);
  
          // Show success message upon successful swap request
          this.toastrService.show("Success", "Swapping Request sent", "success");
        } catch (err) {
          // Show error message if swap request fails
          this.toastrService.show(err, "Swapping Failed", "error");
        } finally {
          // Close the modal and reset the isSwapping flag
          this.closeModal();
          this.isSwapping = false;
        }
      }
    }).catch((reason) => {
      // Handle modal dismissal (optional)
      console.log('Modal dismissed:', reason);
    });
  }

  /**
   * Closes the modal dialog.
   */
  closeModal(): void {
    this.activeModal.close();
  }
}
