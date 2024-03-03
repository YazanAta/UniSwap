import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { switchMap, from, Observable, of, take} from 'rxjs';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { increment } from "firebase/firestore";
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage) { }

  // Get the posts collection from Firestore where the ownerId field equals the current user's uid
  getUserPosts(uid: string) {
      return this.firestore.collection(`posts`, ref => ref.where('ownerId', '==', uid)).valueChanges( {idField: 'id'} );
  }

  getAllPosts(uid: string): Promise<Post[]> {
    return new Promise((resolve, reject) => {

      // Fetches all approved posts from the Firestore collection based on certain criteria.
      this.firestore.collection('posts', (ref) =>
        ref.where('ownerId', '!=', uid).where('state', '==', 'approved')
      )
      .valueChanges({idField: 'id'})
      .pipe(take(1))
      .subscribe({
        // Callback for handling successful emissions (next)
        next: (posts: Post[]) => {
          resolve(posts);
        },
        // Callback for handling errors (error)
        error: (error) => {
          reject(error);
        }

      });

    });

  }
  
  async addPost(post: Post, image: File, uid: string): Promise<void> {
    try {
      // If upload image exists
      if (image !== null) {
        // storage reference
        const filePath = `posts/${new Date().getTime()}_${image.name}`;
        const fileRef = this.storage.ref(filePath);
  
        // upload image to the reference and save the url
        await fileRef.put(image);
        const url = await lastValueFrom(fileRef.getDownloadURL());
  
        // add post to firestore
        await this.firestore.collection(`posts`).add({
          ...post,
          image: url,
          createdAt: new Date(),
          ownerId: uid,
          state: "pending"
        });
      } else {
        // add post to firestore without image
        await this.firestore.collection(`posts`).add({
          ...post,
          image: null,
          createdAt: new Date(),
          ownerId: uid,
          state: "pending"
        });
      }
    } catch (error) {
      // Handle any errors here
      console.error("Error adding post:", error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }
  

  // Not Completed
  deletePost(post: Post) {
    //if(post.state === "approved" || post.state === "rejected")
    // Get the post data including the image URL
    const postRef = this.firestore.doc(`posts/${post.id}`);
    return postRef.get().toPromise().then((doc) => {
      const postData = doc.data() as { image?: string };
      // Delete the post document from Firestore
      return postRef.delete().then(() => {
        // If the post had an image, delete it from Firebase Storage
        if (postData && postData.image) {
          const storageRef = this.storage.refFromURL(postData.image);
          return storageRef.delete();
        }
      });
    });
  }
  
  editPost(postId: string, updatedPost: Post, newImage: File | null, uid: string): Observable<void> {
    // Get the reference to the existing post document
    const postRef = this.firestore.doc(`posts/${postId}`);

    // Retrieve existing post data
    return postRef.get().pipe(
      switchMap((doc) => {
        const postData = doc.data() as Post;
        
        // Check if the user owns the post
        if (postData && postData.ownerId === uid) {
          if (newImage !== null) {
            // Update post with a new image
            const filePath = `posts/${new Date().getTime()}_${newImage.name}`;
            const fileRef = this.storage.ref(filePath);

            return from(fileRef.put(newImage).then(() => {
              return fileRef.getDownloadURL().toPromise();
            })).pipe(
              switchMap(url => {
                // Delete the existing image if it exists
                if (postData.image) {
                  const existingImageRef = this.storage.refFromURL(postData.image);
                  existingImageRef.delete();
                }

                // Update post data in Firestore with the new image URL
                return postRef.update({
                  image: url,
                  ...updatedPost,
                  cratedAt: new Date(),
                  state: "pending"
                }).then(() => {
                  // Additional logic if needed
                });
              })
            );
          } else {
            // Update post without changing the image
            return postRef.update({
              ...updatedPost,
              updatedAt: new Date(),
              state: "pending"
            }).then(() => {
              // Additional logic if needed
            });
          }
        } else {
          // Handle the case where the user doesn't own the post
          throw new Error("User does not have permission to edit this post.");
        }
      })
    );

    
  }

  changeState(id, newState: string){
    return this.firestore.doc(`posts/${id}`).update({
      state: newState
    })
  }

}
