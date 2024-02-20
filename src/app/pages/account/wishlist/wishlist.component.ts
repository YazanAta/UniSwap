import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { PostsService } from 'src/app/services/posts/posts.service';
import { CustomToastrService } from 'src/app/services/toastr/custom-toastr.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy{

  constructor(private ws: WishlistService, private ps: PostsService, private toastr: CustomToastrService) { }

  wishlist: Post[] = [];
  subscription$: Subscription;

  ngOnInit(): void {
    this.getUserWishlist();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  getUserWishlist(){
    this.subscription$ = this.ws.getUserWishlist().subscribe(
      (postsWithIds) => {
        // Clear the existing wishlist array
        this.wishlist = [];

        // Add the new wishlist items
        postsWithIds.forEach(item => {
          this.wishlist.push({ 
            id: item.id, 
            ...item.post });
        });
        
      },
      error => {
        console.error('Error getting wishlist:', error);
      }
    );
  }

  removeFromWishlist(id: string): void {
    this.ws.removeFromWishlist(id)
    .then(
      (value) => {
        this.toastr.show(value,'Wishlist', "success");
      })
    .catch(
      (err) => {
        this.toastr.show(err, "Wishlist", "error")
      })
  }
}
