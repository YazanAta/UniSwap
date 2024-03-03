import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, catchError } from 'rxjs';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { UserService } from '../user/user.service';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private userService: UserService) {}

  //-------------------Users Service------------------//

  // Retrieves users by their role
  getUsersByRole(role: string): Observable<any[]> {
    return this.firestore
      .collection('users', (ref) => ref.where('role', '==', role))
      .valueChanges({idField : 'id'})
  }

  //-------------------Admins Service------------------//

  // Registers a new admin with the provided email and password
  async registerNewAdmin(email: string, password: string): Promise<void> {
    try {

      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Additional data can be added to the user document if needed
      await this.firestore.collection('users').doc(user.uid).set({
        email,
        role: "admin",
      });

      // Send email verification
      return user.sendEmailVerification();
      
    } 
    catch (error) {

      throw error;

    }
  }

  //-------------------Posts Service-----------------//

  // Retrieves all posts
  getAllPosts(): Observable<Post[]> {
    return this.firestore.collection('posts')
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError(error => {
          console.error('Error fetching posts:', error);
          // Handle the error as needed
          throw error; // rethrow the error or return a default value
        })
      );
  }

  // Updates the state of a post and increments user points if necessary
  async updatePostState(postId: string, data: Post): Promise<void> {
    try {
      await this.firestore.doc(`/posts/${postId}`).update({
        ...(data || {})
      });
  
      // Check for truthiness and use optional chaining
      if (data?.type === 'free' && data?.state === 'approved') {
        // Ensure incrementPoints returns a Promise
        await this.userService.incrementPoints(data.ownerId);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }
  
}
