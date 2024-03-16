import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { SwapService } from 'src/app/services/swap/swap.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { UserService } from 'src/app/services/user/user.service';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { User } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-swap-list',
  templateUrl: './swap-list.component.html',
  styleUrls: ['./swap-list.component.scss']
})
export class SwapListComponent implements OnInit {
  @Input() otherParticipant: User;
  @Input() uid: string;

  public posts: Post[] = [];
  public isSwapping = false;

  constructor(
    public activeModal: NgbActiveModal,
    private swapService: SwapService,
    private userService: UserService,
    private toastrService: CustomToastrService
  ) {}

  ngOnInit(): void {
    this.getUserPosts();
  }

  private getUserPosts(): void {
    this.swapService.getSwapList(this.uid)
      .pipe(take(1))
      .subscribe({
        next: (posts: Post[]) => this.posts = posts,
        error: (err) => console.error(err) // Optionally, handle the error in a more user-friendly way
      });
  }

  async swapRequest(otherParticipantId: string, post: Post): Promise<void> {
    if (this.isSwapping) return;

    this.isSwapping = true;
    try {
      const user = await lastValueFrom(this.userService.getUserInfoById(this.uid).pipe(take(1)));
      await this.swapService.swapRequest(otherParticipantId, user.firstName, post);
      this.toastrService.show("Success","Swapping Request sent","success");
    } catch (err) {
      this.toastrService.show(err,"Swapping Faild","error")
    } finally {
      this.closeModal();
      this.isSwapping = false;
    }
  }

  closeModal(): void {
    this.activeModal.close();
  }
}
