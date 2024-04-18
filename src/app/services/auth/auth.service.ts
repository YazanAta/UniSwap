import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from 'src/app/shared/interfaces/user.interface';
import { CustomToastrService } from '../toastr/custom-toastr.service';
import { catchError, first, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/**
 * Service handling authentication and user management.
 */
export class AuthService {

  // Observable representing the authenticated user
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
          return this.fs.doc<User>(`users/${user.uid}`).valueChanges({ idField: 'id' });
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

  /**
   * Get the currently authenticated user.
   * @returns Promise containing the authenticated Firebase User object.
   */
  async getUser(): Promise<firebase.User> {
    return await lastValueFrom(this.afAuth.user.pipe(first()));
  }

  /**
   * Register a new user with email, password, and user information.
   * @param email The user's email address.
   * @param password The user's chosen password.
   * @param user Additional information about the user.
   * @returns Promise containing the user authentication result.
   */
  async register(user: User): Promise<firebase.auth.UserCredential> {
    try {
      const result = await this.registerUserWithEmailAndPassword(user.email, user.password);
      await this.addUserInformation(result.user.uid, user);
      await this.sendVerificationEmail(result.user);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log in a user with email and password.
   * @param email The user's email address.
   * @param password The user's password.
   * @returns Promise with no explicit return value.
   */
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (userCredential.user) {
        const uid = userCredential.user.uid;
        const userData = await lastValueFrom(this.fs.doc(`users/${uid}`).get());
        const userRole = userData.get('role');
        if (userCredential.user.emailVerified) {
          if (userRole === 'user') {
            this.router.navigate(['']);
          } else if (userRole === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.toastr.show("Invalid user role", "Error", "error");
          }
        } else {
          this.toastr.show("User is not verified, not logging in.", "Info", "error");
          await this.logout();
        }
      }
    } catch (error) {
      this.toastr.show("Email or Password are not correct. Please try again.", "Info", "error");
    }
  }

  /**
   * Log out the currently authenticated user.
   * @returns Promise with no explicit return value.
   */
  async logout(): Promise<void> {
    await this.afAuth.signOut();
  }

  /**
   * Send a password recovery email to the specified email address.
   * @param email The email address for password recovery.
   * @returns Promise with no explicit return value.
   */
  async recoverPassword(email: string): Promise<void> {
    await this.afAuth.sendPasswordResetEmail(email);
  }

  // Private helper functions

  private async registerUserWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

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

  private async sendVerificationEmail(user: firebase.User): Promise<void> {
    await user.sendEmailVerification();
  }

}
