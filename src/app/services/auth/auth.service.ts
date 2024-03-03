import { Injectable } from '@angular/core';
import { Observable, first, from, of, switchMap, lastValueFrom, catchError} from 'rxjs';
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

  // Observable representing the user authentication state
  user$: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: CustomToastrService,
    private fs: AngularFirestore
  ) {
    // Set up the user observable based on authentication state
    this.user$ = this.afAuth.user.pipe(
      switchMap(user => {
        if (user) {
          // If authenticated, fetch user details from Firestore
          return this.fs.doc<User>(`users/${user.uid}`).valueChanges({ idField: 'uid' });
        } else {
          // If not authenticated, emit null
          return of(null);
        }
      }),
      catchError(error => {
        // Handle errors in the observable
        console.error('Error in user$ observable:', error);
        return of(null);
      })
    );
  }


  // Get the current user asynchronously
  async getUser(): Promise<firebase.User> {
    return await lastValueFrom(this.afAuth.user.pipe(first()));
  }

  // Register a new user with email, password, and additional information
  async register(email: string, password: string, user: User): Promise<firebase.auth.UserCredential> {
    try {
      // Firebase Authentication
      const result = await this.registerUserWithEmailAndPassword(email, password);
      
      // Firestore: Add user information
      await this.addUserInformation(result.user.uid, user);
      
      // Send Verification Email
      await this.sendVerificationEmail(result.user);

      // Return the authentication result
      return result;
    } catch (error) {
      // Propagate the error to the calling code
      throw error;
    }
  }

  // Private helper function to register user with email and password
  private async registerUserWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Private helper function to add user information to Firestore
  private async addUserInformation(uid: string, user: User): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.fs.doc(`users/${uid}`);
    const data: User = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      role: "user",
      points: 0
    };
    await userRef.set(data, { merge: true });
  }

  // Private helper function to send a verification email
  private async sendVerificationEmail(user: firebase.User): Promise<void> {
    await user.sendEmailVerification();
  }

  // Log in the user with email and password
  async login(email: string, password: string): Promise<void> {
    try {
      // Firebase Authentication
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      
      // Process user credential
      if (userCredential.user) {
        const uid = userCredential.user.uid;
        
        // Get user role from Firestore
        const userData = await lastValueFrom(this.fs.doc(`users/${uid}`).get());
        const userRole = userData.get('role');
        
        // Check if the email is verified
        if (userCredential.user.emailVerified) {
          // If the role is 'user', navigate to home; if 'admin', navigate to admin
          if (userRole === 'user') {
            this.router.navigate(['']);
          } else if (userRole === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            // Handle other roles if needed
            this.toastr.show("Invalid user role", "Error", "error");
          }
        } else {
          // If email isn't verified, display a message and log the user out
          this.toastr.show("User is not verified, not logging in.", "Info", "error");
          await this.logout();
        }
      }
    } catch (error) {
      // Display an error message for invalid email or password
      this.toastr.show("Email or Password are not correct. Please try again.", "Info", "error");
    }
  }

  // Log out the user
  async logout(): Promise<void> {
    await this.afAuth.signOut();
  }

  // Send a password recovery email
  async recoverPassword(email: string): Promise<void> {
    await this.afAuth.sendPasswordResetEmail(email);
  }
}
