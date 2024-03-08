import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { Observable, combineLatest, lastValueFrom, map, of, switchMap, take} from 'rxjs';
import { Wishlist } from 'src/app/shared/interfaces/wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private firestore: AngularFirestore) {}

  /**
   * Retrieves a user's wishlist from Firestore.
   * @param uid The user ID.
   * @returns An observable of an array of retrieved and approved posts in the wishlist.
   */
  getUserWishlist(uid: string): Observable<Post[]> {
    // Get wishlist data from Firestore
    return this.firestore.collection<Wishlist>('wishlists').doc<Wishlist>(uid).valueChanges()
      .pipe(
        switchMap((wishlist: Wishlist) => {
          // Check if the wishlist is empty
          if (!wishlist || !wishlist.postIds || wishlist.postIds.length === 0) {
            // Return an observable of an empty array if the wishlist is empty
            return of([]);
          }
  
          // Fetch detailed information for each post in the wishlist
          const postObservables: Observable<any>[] = wishlist.postIds.map(postId =>
            // Get post details from Firestore
            this.firestore.collection<Post>('posts').doc<Post>(postId).valueChanges({ idField: 'id' })
              .pipe(
                switchMap((post: Post) => {
                  if (!post || post.state !== 'approved') {
                    // Remove non-existent or unapproved posts from the wishlist
                    const updatedWishlist = wishlist.postIds.filter(id => id !== postId);
                    const wishlistRef = this.firestore.collection<Wishlist>('wishlists').doc(uid);
  
                    // Update the wishlist in Firestore
                    wishlistRef.set({ postIds: updatedWishlist })
                      .then(() => console.log('Post removed from wishlist because it does not exist'))
                      .catch(error => console.error('Error updating wishlist: ', error));
  
                    // Emit null for non-existent or unapproved posts
                    return of(null);
                  } else {
                    // Emit the post details for existing and approved posts
                    return of( post );
                  }
                })
              )
          );
  
          // Combine observables to emit an array of existing posts with their IDs
          return combineLatest(postObservables).pipe(
            // Filter out non-existent posts (null values)
            map(posts => posts.filter(post => post !== null))
          );
        })
      );
  }
  
    /**
   * Adds a post to a user's wishlist in Firestore.
   * @param postId The ID of the post to add.
   * @param uid The user ID.
   * @returns A promise that resolves to a message indicating success or an error message.
   */
  async addToWishlist(postId: string, uid: string): Promise<string> {
    const wishlistRef = this.firestore.collection<Wishlist>('wishlists').doc(uid);
  
    try {
      const wishlistDoc = await lastValueFrom(wishlistRef.get().pipe(take(1)));
      const currentWishlist = wishlistDoc.exists ? (wishlistDoc.data() as Wishlist)?.postIds || [] : [];
  
      // Check if the post is not already in the wishlist
      if (!currentWishlist.includes(postId)) {
        currentWishlist.push(postId);
        // Update the wishlist document in Firestore
        await wishlistRef.set({ postIds: currentWishlist });
        return 'Post added to wishlist <span class="h4">&#128150;</span>';
      } else {
        return 'Post is already in the wishlist <span class="h4">&#128526</span>';
      }
    } catch (error) {
      return 'Error adding post to wishlist: ' + error;
    }
  }
  
    /**
   * Removes a post from a user's wishlist in Firestore.
   * @param postId The ID of the post to remove.
   * @param uid The user ID.
   * @returns A promise that resolves to a message indicating success or an error message.
   */
  async removeFromWishlist(postId: string, uid: string): Promise<string> {
    const wishlistRef = this.firestore.collection<Wishlist>('wishlists').doc(uid);
  
    try {
      const wishlistDoc = await lastValueFrom(wishlistRef.get().pipe(take(1)));
      const currentWishlist = wishlistDoc.exists ? (wishlistDoc.data() as Wishlist)?.postIds || [] : [];
  
      // Check if the post is in the wishlist
      if (currentWishlist.includes(postId)) {
        // Remove the post from the wishlist
        const updatedWishlist = currentWishlist.filter(id => id !== postId);
  
        // Update the wishlist document in Firestore
        await wishlistRef.set({ postIds: updatedWishlist });
        return 'Post removed from wishlist <span class="h4">&#128516</span>';
      } else {
        return 'Post not found in the wishlist';
      }
    } catch (error) {
      return 'Error removing post from wishlist: ' + error;
    }
  }
  
}
