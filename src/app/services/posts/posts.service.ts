import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap, from, Observable, take } from 'rxjs';
import { Post, PostState } from 'src/app/shared/interfaces/post.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { lastValueFrom } from 'rxjs';

/**
 * Service responsible for managing posts in Firestore.
 */
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  /**
   * Retrieves user-specific posts from Firestore based on ownerId.
   * @param uid The ID of the user whose posts are to be retrieved.
   * @returns An Observable emitting an array of user-specific posts.
   */
  getUserPosts(uid: string): Observable<Post[]> {
    return this.firestore
      .collection<Post>('posts', ref => ref.where('ownerId', '==', uid))
      .valueChanges({ idField: 'id' });
  }

  /**
   * Retrieves all approved posts excluding the current user's posts.
   * @param uid The ID of the current user.
   * @returns A Promise resolving to an array of approved posts.
   */
  getAllPosts(uid: string): Promise<Post[]> {
    return lastValueFrom(this.firestore.collection<Post>('posts', (ref) =>
      ref.where('ownerId', '!=', uid).where('state', '==', 'approved')
    )
      .valueChanges({ idField: 'id' })
      .pipe(take(1)));
  }

  /**
   * Adds a new post to Firestore with an optional image upload.
   * @param post The post object to be added.
   * @param image The image file associated with the post (optional).
   * @param uid The ID of the user adding the post.
   * @returns A Promise resolving when the post is successfully added.
   */
  async addPost(post: Post, image: File | null, uid: string): Promise<void> {
    try {
      const filePath = image ? `posts/${new Date().getTime()}_${image.name}` : null;

      if (filePath) {
        const fileRef = this.storage.ref(filePath);
        await fileRef.put(image);
        post.image = await lastValueFrom(fileRef.getDownloadURL());
      }

      await this.firestore.collection('posts').add({
        ...post,
        createdAt: new Date(),
        ownerId: uid,
        state: 'pending'
      });

    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  }

  /**
   * Deletes a post from Firestore along with its associated image (if exists).
   * @param post The post object to be deleted.
   * @returns A Promise resolving when the post and its image (if exists) are successfully deleted.
   */
  async deletePost(post: Post): Promise<void> {
    const postRef = this.firestore.doc(`posts/${post.id}`);

    return lastValueFrom(postRef.get()).then((doc) => {
      const postData = doc.data() as Post;

      return postRef.delete().then(() => {
        if (postData && postData.image) {
          const storageRef = this.storage.refFromURL(postData.image);
          return lastValueFrom(storageRef.delete());
        }
      });
    });
  }
  
  /**
   * Edits an existing post in Firestore with optional image update.
   * @param postId The ID of the post to be edited.
   * @param updatedPost The updated post object.
   * @param newImage The new image file for the post (optional).
   * @param uid The ID of the user editing the post.
   * @returns An Observable emitting when the post is successfully updated.
   */
  editPost(postId: string, updatedPost: Post, newImage: File | null, uid: string): Observable<void> {
    const postRef = this.firestore.doc(`posts/${postId}`);

    return postRef.get().pipe(
      switchMap((doc) => {
        const postData = doc.data() as Post;

        if (postData && postData.ownerId === uid) {
          if (newImage !== null) {
            const filePath = `posts/${new Date().getTime()}_${newImage.name}`;
            const fileRef = this.storage.ref(filePath);

            return from(fileRef.put(newImage).then(() => {
              return fileRef.getDownloadURL().toPromise();
            })).pipe(
              switchMap(url => {
                if (postData.image) {
                  const existingImageRef = this.storage.refFromURL(postData.image);
                  existingImageRef.delete();
                }

                return postRef.update({
                  image: url,
                  ...updatedPost,
                  createdAt: new Date(),
                  state: 'pending'
                });
              })
            );
          } else {
            return postRef.update({
              ...updatedPost,
              updatedAt: new Date(),
              state: 'pending'
            });
          }
        } else {
          throw new Error('User does not have permission to edit this post.');
        }
      })
    );
  }

  /**
   * Updates the state of a post in Firestore (e.g., 'pending' to 'approved' or 'rejected').
   * @param postId The ID of the post to update.
   * @param newState The new state for the post.
   * @returns A Promise resolving when the post state is successfully updated.
   */
  async updateState(postId: string, newState: PostState): Promise<void> {
    await this.firestore.doc(`posts/${postId}`).update({
      state: newState
    });
  }

}
