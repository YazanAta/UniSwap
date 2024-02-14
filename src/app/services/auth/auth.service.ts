import { Injectable, Injector } from '@angular/core';
import { Observable, from, of, switchMap, take} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from 'src/app/interfaces/user.interface';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<firebase.User>
  user$: Observable<any>;

  
  constructor(private afAuth: AngularFireAuth, private router: Router, private notification: NotificationsService, private fs: AngularFirestore) {
    this.user = afAuth.user;
    //// Get auth data, then get firestore user document || null
    this.user$ = this.afAuth.authState.pipe(
    switchMap(user => {
      if (user) {
        return this.fs.doc<any>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    })
    );
  }

  async register(email: string, password: string, user: User) {
    try {
      //Firebase Authentication
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      //Firebase Firestore add user information
      const userRef: AngularFirestoreDocument<any> = this.fs.doc(`users/${result.user.uid}`);
      const data: User ={
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        role: "user",
        points: 0
      }
      await userRef.set(data, { merge: true });
      //Send Verification Email
      await result.user.sendEmailVerification();

      return result;

    } catch (error) {
      throw error;
    }
  }

  async login(email, password): Promise<string | void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
  
      if (userCredential.user) {
        const userId = userCredential.user.uid;
  
        // Fetch additional user data from Firestore
        const userData = await this.fs.doc(`users/${userId}`).get().toPromise();
        const userRole = userData.get('role'); // Assuming there's a 'role' field in the user document
  
        if (userCredential.user.emailVerified) {
          if (userRole === 'user') {
            // Logic for user role
            this.router.navigate(['/home']);
          } else if (userRole === 'admin') {
            // Logic for admin role
            this.router.navigate(['/admin']);
          } else {
            // Handle other roles if needed
            this.notification.show("Invalid user role", "Error", "error");
            this.logout();
          }
        } else {
          // User is not verified, don't log them in
          this.notification.show("User is not verified, not logging in.", "Info", "error");
          this.logout();
        }
      }
    } catch (error) {
      this.notification.show("Email or Password are not correct. Please try again.", "Info", "error");
    }
  }
  
  logout(){
    return this.afAuth.signOut()
  }

  getUserId(){
    return new Promise((resolve, reject) => {
      this.user.pipe(take(1)).subscribe(user => {
        user.uid ? resolve(user.uid) : reject('No user logged in');
      });
    });
  }

  recoverPassword(email: string): Observable<void>{
    return from(this.afAuth.sendPasswordResetEmail(email));
  }
}
