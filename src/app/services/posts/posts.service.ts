import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap, from, Observable, take} from 'rxjs';
import { Post, PostState } from 'src/app/shared/interfaces/post.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  // Get posts where ownerId matches the current user's uid
  getUserPosts(uid: string): Observable<Post[]> {
    return this.firestore
      .collection(`posts`, ref => ref.where('ownerId', '==', uid))
      .valueChanges({idField: 'id'});
  }

  // Get all approved posts, excluding the current user's posts
  getAllPosts(uid: string): Promise<Post[]> {
    return lastValueFrom(this.firestore.collection('posts', (ref) =>
      ref.where('ownerId', '!=', uid).where('state', '==', 'approved')
    )
      .valueChanges({idField: 'id'})
      .pipe(take(1)))
  }

  // Add a new post with or without an image
  async addPost(post: Post, image: File | null, uid: string): Promise<void> {
    try {
      const filePath = image ? `posts/${new Date().getTime()}_${image.name}` : null;

      if (filePath) {
        const fileRef = this.storage.ref(filePath);
        await fileRef.put(image);
        post.image = await lastValueFrom(fileRef.getDownloadURL());
      }

      await this.firestore.collection(`posts`).add({
        ...post,
        createdAt: new Date(),
        ownerId: uid,
        state: "pending"
      });

    } catch (error) {
      // Handle any errors here
      console.error("Error adding post:", error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }
  

  // Delete a post and its associated image
  deletePost(post: Post): any {
//    const postRef = this.firestore.doc(`posts/${post.id}`);
//
//    return lastValueFrom(postRef.get()).then((doc) => {
//      const postData = doc.data() as { image?: string };
//      
//      // Delete the post document from Firestore
//      return postRef.delete().then(() => {
//        // If the post had an image, delete it from Firebase Storage
//        if (postData && postData.image) {
//          const storageRef = this.storage.refFromURL(postData.image);
//          return storageRef.delete();
//        }
//      });
//    });
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
                  createdAt: new Date(),
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

  // Change the state of a post (e.g., from 'pending' to 'approved' or 'rejected')
  async updateState(postId: string, newState: PostState): Promise<void>{
    await this.firestore.doc(`posts/${postId}`).update({
      state: newState
    })
  }

}
