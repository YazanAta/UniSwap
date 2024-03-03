import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs';
import { PostsService } from 'src/app/services/posts/posts.service';
import { SwapService } from 'src/app/services/swap/swap.service';
import { UserService } from 'src/app/services/user/user.service';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { User } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-swap-list',
  templateUrl: './swap-list.component.html',
  styleUrls: ['./swap-list.component.scss']
})
export class SwapListComponent implements OnInit{
  constructor(
    public activeModal: NgbActiveModal,
    private postsService: PostsService,
    private swapService: SwapService,
    private userService: UserService
  ){}

  @Input() otherParticipant: User;
  @Input() uid: string;

  public posts: Post[];


  ngOnInit(): void {
    this.getUserPosts(this.uid)
  }

  // Get user posts method
  public getUserPosts(uid: string) {
    this.swapService.getSwapList(uid).pipe(take(1))
    .subscribe({
      next: (posts: Array<any>) => {
        this.posts = posts
      },
      error: (err) => {
        console.error(err);
        // Handle the error here
      }
    });
  }


  isSwapping: Boolean = false
  async swapRequest(otherParticipantId, uid, post){
    if(this.isSwapping){
      return
    }
    this.isSwapping = true
    const user = await this.userService.getUserInfoById(uid).pipe(take(1)).toPromise();
    this.swapService.swapRequest(otherParticipantId, user.firstName, post).then(() => {
      console.log("Sent To ", otherParticipantId);
      this.isSwapping = false
    })
  }












  isSubmitting: boolean = false

  closeModal(){
    const onComplete = () => {
      this.isSubmitting = false;
      this.activeModal.close();
    };
    this.activeModal.close();
  }

}
