import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  getUsers(): Observable<any[]> {
    return this.firestore.collection('users').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  updateUserBlockedStatus(userId: string, blocked: boolean): Promise<void> {
    return this.firestore.collection('users').doc(userId).update({ blocked });
  }

  sendMessageToUser(userId: string, message: string): Promise<any> {
    // Assuming you have a uniSwapMessages subcollection within each user document
    return this.firestore.collection('users').doc(userId).collection('uniSwapMessages').add({
      message,
      timestamp: new Date(),
    });
  }

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
}
