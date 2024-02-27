import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, map } from 'rxjs';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { getAuth, User } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  //-------------------Users Service------------------//
  getUsersByRole(role: string): Observable<any[]> {
    return this.firestore
      .collection('users', (ref) => ref.where('role', '==', role))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
  
  disableAccount(uid: string) {
    const auth = getAuth();

    // Set a custom property in Firestore indicating whether the account is disabled
    this.firestore.collection('users').doc(uid).update({ disabled: true })
      .then(() => {
        console.log('User disabled successfully');
      })
      .catch((error) => {
        console.error('Error disabling user:', error);
      });
  }

  //-------------------Admins Service------------------//
  async registerNewAdmin(email: string, password: string): Promise<any> {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Additional data can be added to the user document if needed
      await this.firestore.collection('users').doc(user.uid).set({
        email,
        role: "admin",
      });

      // Send email verification
      await user.sendEmailVerification();

      return user;
    } catch (error) {
      throw error;
    }
  }

  //-------------------Posts Service-----------------//
  getAllPosts(): Observable<any[]> {
    return this.firestore.collection('posts') // Assuming 'posts' is the name of your collection
    .valueChanges({idField: 'postId'})
  }

  changePostState(id: string, data: Post){
    return this.firestore.doc(`/posts/${id}`).update({
      ...data
    })
  }

  //-------------------Shared Service---------------//
  sendMessageToUser(userId: string, message: string): Promise<any> {
    // Assuming you have a uniSwapMessages subcollection within each user document
    return this.firestore.collection('users').doc(userId).collection('uniSwapMessages').add({
      message,
      timestamp: new Date(),
    });
  }
}
