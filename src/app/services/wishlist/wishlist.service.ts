import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { Observable, combineLatest, from, map, of, switchMap, take } from 'rxjs';

interface Wishlist {
  postIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private fs: AngularFirestore, private as: AuthService) {}

  uid: string = this.as.uid;

  getUserWishlist(): Observable<{ id: string, post: Post }[]> {
    // Get post id's from wishlist collection
    return this.fs.collection<Wishlist>('wishlists').doc(this.uid).valueChanges()
      .pipe(
        // The wishlist data is an array of post ID's
        switchMap((wishlist: Wishlist) => {
          // If the wishlist is empty, return an empty array
          if (!wishlist || !wishlist.postIds || wishlist.postIds.length === 0) {
            return of([]); // Use 'of' to emit an observable of an empty array
          }

          // Fetch the detailed information of each post in the wishlist
          const postObservables: Observable<{ id: string, post: Post }>[] = wishlist.postIds.map(postId =>
            // map through the Id's and get the posts from firestore
            this.fs.collection('posts').doc(postId).snapshotChanges().pipe(
              switchMap((snapshot: any) => {
                // if the post is removed from posts collection => update wishlist
                if (snapshot.type === 'removed') {
                  const updatedWishlist = wishlist.postIds.filter(id => id !== postId);
                  const wishlistRef = this.fs.collection<Wishlist>('wishlists').doc(this.uid);
                  wishlistRef.set({ postIds: updatedWishlist })
                    .then(() => console.log('Post removed from wishlist because it does not exist'))
                    .catch(error => console.error('Error updating wishlist: ', error));
                  return of(null); // Emit null for non-existent post
                }
                // if post exists => return data
                else{ 
                  const post = snapshot.payload.data() as Post;
                  const id = snapshot.payload.id;
                  // Emit the post with its ID if it exists
                  console.log(post.state)
                  if (post && post.state == "approved") {
                    return of({ id, post }); 
                  }
                }

              })
            )

          );

          // Combine the observables to emit an array of existing posts with their IDs
          return combineLatest(postObservables).pipe(
            map(posts => posts.filter(post => post !== null)) // Filter out non-existent posts
          );
        })
      );
  }
  
  addToWishlist(postId: string): Promise<string> {

    return new Promise<string>((resolve, reject) => {

      const wishlistRef = this.fs.collection<Wishlist>('wishlists').doc(this.uid);

      wishlistRef.get().subscribe((wishlistDoc) => {
        const currentWishlist = wishlistDoc.exists ? (wishlistDoc.data() as Wishlist)?.postIds || [] : [];
        // Check if the post is not already in the wishlist
        if (!currentWishlist.includes(postId)) {
          currentWishlist.push(postId);
          // Update the wishlist document in Firestore
          wishlistRef.set({ postIds: currentWishlist })
            .then(() => {
              resolve('Post added to wishlist <span class="h4">&#128150;</span>');
            })
            .catch(error => {
              reject('Error adding post to wishlist: ' + error);
            });
        } else {
          resolve('Post is already in the wishlist <span class="h4">&#128526</span>');
        }
      });
    
    });
  }
  
  removeFromWishlist(postId: string): Promise<string> {

    return new Promise<string>((resolve, reject) => {

      // Get current wishlist
      const wishlistRef = this.fs.collection<Wishlist>('wishlists').doc(this.uid);
      wishlistRef.get().subscribe((wishlistDoc) => {
        const currentWishlist = wishlistDoc.exists ? (wishlistDoc.data() as Wishlist)?.postIds || [] : [];

        // Check if the post is in the wishlist
        if (currentWishlist.includes(postId)) {
          // Remove the post from the wishlist
          const updatedWishlist = currentWishlist.filter(id => id !== postId);

          // Update the wishlist document in Firestore
          wishlistRef.set({ postIds: updatedWishlist })
            .then(() => {
              resolve('Post removed from wishlist <span class="h4">&#128516</span>');
            })
            .catch(error => {
              reject('Error removing post from wishlist: ' + error);
            });
        } else {
          resolve('Post not found in the wishlist');
        }
      });
    
    });
    
  }
  
}
