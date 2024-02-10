import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { switchMap, from, Observable} from 'rxjs';
import { Post } from 'src/app/interfaces/post.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { collection, increment } from "firebase/firestore";


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  // Inject the AuthService, AngularFirestore, and AngularFireStorage
  constructor(private authService: AuthService, private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  

  // Get all posts from the current user
  // Use the switchMap operator to get the current user from the AuthService
  // Return the observable from Firestore
  getUserPosts() {
    return this.authService.user.pipe(
      switchMap(user => {
        // Get the posts collection from Firestore where the ownerId field equals the current user's uid
        return this.firestore.collection(`posts`, ref => ref.where('ownerId', '==', user.uid)).snapshotChanges();
      })
    );
  }

  // Get all posts from all users
  getAllPosts(): Observable<DocumentChangeAction<unknown>[]> {
    return new Observable((observer) => {
      this.authService.getUserId().then((uid) => {
        const subscription = this.firestore.collection('posts', (ref) =>
          ref.where('ownerId', '!=', uid)
        )
        .snapshotChanges()
        .subscribe(
          (posts) => {
            observer.next(posts);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
        return () => {
          if (subscription) {
            subscription.unsubscribe();
          }
        };
      });
    });
  }


  addPost(post: Post, image: File) {
    // Get the current user and add the post to their posts collection in Firestore
    // If the post has an image, upload it to Firebase Storage and add the image URL to the post
    // Return the promise from Firestore
    // If the post has no image, return the image url is null in Firestore
    return this.authService.user.pipe(
      switchMap(user => {
        if(image != null) {
          const filePath = `posts/${new Date().getTime()}_${image.name}`;
          const fileRef = this.storage.ref(filePath);
          return from(fileRef.put(image).then(() => {
            return fileRef.getDownloadURL().toPromise();
          })).pipe(
            switchMap(url => {
              return this.firestore.collection(`posts`).add(
                {
                  image: url,
                  createdAt: new Date(),
                  ...post,
                  ownerId: user.uid
                }
              ).then(() => { 
                if(post.type === 'Free'){
                  this.firestore.doc(`users/${user.uid}`).update({
                    points: increment(1)
                  });
                }
              });
            })
          );
        } else {
          // Handle the case where image is null
          return this.firestore.collection(`users/${user.uid}/posts`).add(
            {
              image: null,
              createdAt: new Date(),
              ...post,
              ownerId: user.uid
            }
          ).then(() => { 
            if(post.type === 'Free'){
              this.firestore.doc(`users/${user.uid}`).update({
                points: increment(1)
              });
            }
          });
        }
      })
    )
  }

  deletePost(postId){
    return this.firestore.doc(`posts/${postId}`).delete();
  }

}
