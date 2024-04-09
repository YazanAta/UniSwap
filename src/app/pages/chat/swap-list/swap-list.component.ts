import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { SwapService } from 'src/app/services/swap/swap.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { UserService } from 'src/app/services/user/user.service';
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
export class SwapListComponent implements OnInit {
  /** Input property representing the other participant in the swap. */
  @Input() otherParticipant: User;

  /** Input property representing the current user's ID. */
  @Input() uid: string;

  /** Array of posts available for swapping. */
  public posts: Post[] = [];

  /** Flag to track if a swap request is in progress. */
  public isSwapping = false;

  constructor(
    public activeModal: NgbActiveModal,
    private swapService: SwapService,
    private userService: UserService,
    private toastrService: CustomToastrService
  ) {}

  /**
   * Lifecycle hook called after component initialization.
   * Retrieves posts available for swapping for the other participant.
   */
  ngOnInit(): void {
    this.getUserPosts();
  }

  /**
   * Retrieves posts available for swapping from the swap service.
   */
  private getUserPosts(): void {
    this.swapService.getSwapList(this.otherParticipant.uid)
      .pipe(take(1))
      .subscribe({
        next: (posts: Post[]) => this.posts = posts,
        error: (err) => console.error(err) // Optionally, handle the error in a more user-friendly way
      });
  }

  /**
   * Initiates a swap request with the selected post and the other participant.
   * @param post The post selected for swapping.
   */
  async swapRequest(post: Post): Promise<void> {
    if (this.isSwapping) return;

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

  /**
   * Closes the modal dialog.
   */
  closeModal(): void {
    this.activeModal.close();
  }
}
