import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { Post } from 'src/app/interfaces/post.interface';
import { Observable, combineLatest, from, map, of, switchMap } from 'rxjs';

interface Wishlist {
  postIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private fs: AngularFirestore, private as: AuthService) {
    
  }

  getUserWishlist(): Observable<{ id: string, post: Post }[]> {
    return from(this.as.getUserId()).pipe(
      switchMap((uid: string) => {
        return this.fs.collection<Wishlist>('wishlists').doc(uid).valueChanges()
          .pipe(
            switchMap((wishlist: Wishlist) => {
              // If the wishlist is empty, return an empty array
              if (!wishlist || !wishlist.postIds || wishlist.postIds.length === 0) {
                return of([]); // Use 'of' to emit an observable of an empty array
              }
  
              // Fetch the detailed information of each post in the wishlist
              const postObservables: Observable<{ id: string, post: Post }>[] = wishlist.postIds.map(postId =>
                this.fs.collection<Post>('posts').doc(postId).snapshotChanges().pipe(
                  switchMap((snapshot: any) => {
                    const post = snapshot.payload.data() as Post;
                    const id = snapshot.payload.id;
                    // Check if the post exists
                    if (post) {
                      return of({ id, post }); // Emit the post with its ID if it exists
                    } else {
                      // If the post doesn't exist, remove it from the wishlist array
                      const updatedWishlist = wishlist.postIds.filter(id => id !== postId);
                      const wishlistRef = this.fs.collection<Wishlist>('wishlists').doc(uid);
                      wishlistRef.set({ postIds: updatedWishlist })
                        .then(() => console.log('Post removed from wishlist because it does not exist'))
                        .catch(error => console.error('Error updating wishlist: ', error));
                      return of(null); // Emit null for non-existent post
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
      })
    );
  }
  
  addToWishlist(postId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      //get user id
      this.as.getUserId().then((uid: string) => {
        const wishlistRef = this.fs.collection<Wishlist>('wishlists').doc(uid);
        wishlistRef.get().subscribe((wishlistDoc) => {
          const currentWishlist = wishlistDoc.exists ? (wishlistDoc.data() as Wishlist)?.postIds || [] : [];
          // Check if the post is not already in the wishlist
          if (!currentWishlist.includes(postId)) {
            currentWishlist.push(postId);
            // Update the wishlist document in Firestore
            wishlistRef.set({ postIds: currentWishlist })
              .then(() => {
                resolve('Post added to wishlist successfully');
              })
              .catch(error => {
                reject('Error adding post to wishlist: ' + error);
              });
          } else {
            resolve('Post is already in the wishlist');
          }
        });
      });
    });
  }
  
  removeFromWishlist(postId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.as.getUserId().then((uid: string) => {
        const wishlistRef = this.fs.collection<Wishlist>('wishlists').doc(uid);
        wishlistRef.get().subscribe((wishlistDoc) => {
          const currentWishlist = wishlistDoc.exists ? (wishlistDoc.data() as Wishlist)?.postIds || [] : [];
  
          // Check if the post is in the wishlist
          if (currentWishlist.includes(postId)) {
            // Remove the post from the wishlist
            const updatedWishlist = currentWishlist.filter(id => id !== postId);
  
            // Update the wishlist document in Firestore
            wishlistRef.set({ postIds: updatedWishlist })
              .then(() => {
                resolve('Post removed from wishlist successfully');
              })
              .catch(error => {
                reject('Error removing post from wishlist: ' + error);
              });
          } else {
            resolve('Post not found in the wishlist');
          }
        });
      });
    });
  }
  
}
