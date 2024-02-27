import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { PostsService } from 'src/app/services/posts/posts.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy{

  constructor(
    private ws: WishlistService,
    private toastr: CustomToastrService,
    private authService: AuthService) {}

  // user wishlist
  wishlist: Post[] = [];
  
  uid: string;

  // for unsubscribing
  private destroy$ = new Subject<void>();

  async ngOnInit() {

    const user = await this.authService.getUser();
    
    this.uid = user.uid;
    
    this.getUserWishlist(user.uid);
  
  }

  getUserWishlist(uid: string){
    this.ws.getUserWishlist(uid).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((postsWithIds) => {
      // Clear the existing wishlist array
      this.wishlist = [];

      // Add the new wishlist items
      postsWithIds.forEach(item => {
        this.wishlist.push({ 
          id: item.id, 
          ...item.post });
      });

    })
    
  }

  removeFromWishlist(id: string): void {
    this.ws.removeFromWishlist(id, this.uid)
    .then(
      (value) => {
        this.toastr.show(value,'Wishlist', "success");
      })
    .catch(
      (err) => {
        this.toastr.show(err, "Wishlist", "error")
      })
  }

  ngOnDestroy() {
    // Emit a value to signal the destruction of the component
    this.destroy$.next();
    // Complete the subject to release resources
    this.destroy$.complete();
  }

}
