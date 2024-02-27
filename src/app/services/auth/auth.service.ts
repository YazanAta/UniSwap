import { Injectable } from '@angular/core';
import { Observable, first, from, of, switchMap, lastValueFrom} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from 'src/app/shared/interfaces/user.interface';
import { CustomToastrService } from '../toastr/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null>

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: CustomToastrService,
    private fs: AngularFirestore) {
    //// Get auth data, then get firestore user document || null
    this.user$ = this.afAuth.user.pipe(
      switchMap(user => {
        if (user) {
          return this.fs.doc<User>(`users/${user.uid}`).valueChanges( {idField: 'uid'} );
        } else {
          return of(null);
        }
      })
    );
  }

  async getUser() : Promise<firebase.User>{
    return await lastValueFrom(this.afAuth.user.pipe(first()));
  }

  async register(email: string, password: string, user: User) : Promise<firebase.auth.UserCredential>{
    try {

      // Firebase Authentication 
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);

      // Firestore add user information
      const userRef: AngularFirestoreDocument<any> = this.fs.doc(`users/${result.user.uid}`);
      const data: User ={
        firstName : user.firstName,
        lastName  : user.lastName,
        email     : user.email,
        gender    : user.gender,
        role      : "user",
        points    : 0
      }
      await userRef.set(data, { merge: true });

      //Send Verification Email
      await result.user.sendEmailVerification();

      return result;

    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<string | void> {
    try {

      // Firebase Authentication 
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      
      // Get User Credential
      if (userCredential.user) {

        const uid = userCredential.user.uid;
  
        // Get user role from firestore
        const userData = await this.fs.doc(`users/${uid}`).get().toPromise();
        const userRole = userData.get('role'); 
  
        // If Email is verified
        if (userCredential.user.emailVerified) {

          // If role is user -> Navigate to home
          if (userRole === 'user') {
            this.router.navigate(['']);
          }
        
          // If role is admin -> Navigate to admin
          else if (userRole === 'admin') {
            this.router.navigate(['/admin']);
          } 
          // Other roles if needed
          else {
            this.toastr.show("Invalid user role", "Error", "error");
          }
        } 
        // If Email isn't verified
        else {
          // Don't log them in
          this.toastr.show("User is not verified, not logging in.", "Info", "error");
          this.logout();
        }
      }
    } catch (error) {
      this.toastr.show("Email or Password are not correct. Please try again.", "Info", "error");
    }
  }
  
  logout(): Promise<void>{
    return this.afAuth.signOut()
  }

  recoverPassword(email: string): Observable<void>{
    return from(this.afAuth.sendPasswordResetEmail(email));
  }

}
