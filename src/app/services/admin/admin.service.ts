import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, catchError, lastValueFrom, take } from 'rxjs';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private userService: UserService
  ) {}

  //-------------------Users Service------------------//

  /**
   * Retrieves users by their role.
   * @param role The role of the users to retrieve.
   * @returns A Promise that resolves to an array of users.
   */
  getUsersByRole(role: string): Promise<any[]> {
    return lastValueFrom(
      this.firestore
        .collection('users', (ref) => ref.where('role', '==', role))
        .valueChanges({ idField: 'id' })
        .pipe(take(1))
    );
  }

  //-------------------Admins Service------------------//

  /**
   * Registers a new admin with the provided email and password.
   * @param email The email address of the new admin.
   * @param password The password for the new admin.
   * @returns A Promise that resolves when the admin registration is successful.
   * @throws Error if there is an issue during admin registration.
   */
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
    } catch (error) {
      throw error;
    }
  }

  //-------------------Posts Service-----------------//

  /**
   * Retrieves all posts from Firestore.
   * @returns An Observable emitting an array of Post objects.
   */
  getAllPosts(): Observable<Post[]> {
    return this.firestore.collection('posts')
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError(error => {
          console.error('Error fetching posts:', error);
          throw error; // Rethrow the error or handle as needed
        })
      );
  }

  /**
   * Updates the state of a post and increments user points if necessary.
   * @param postId The ID of the post to update.
   * @param data The updated data for the post.
   * @returns A Promise that resolves when the post update is successful.
   */
  async updatePostState(postId: string, data: Post): Promise<void> {
    try {
      await this.firestore.doc(`/posts/${postId}`).update({
        ...(data || {})
      });

      // Check for truthiness and use optional chaining
      if (data?.pricing === 'free' && data?.state === 'approved') {
        await this.userService.incrementPoints(data.ownerId);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }
}

