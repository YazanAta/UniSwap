import { Injectable } from '@angular/core';
import { Observable, from} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<firebase.User>
  userId: string
  
  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user = afAuth.user
  }

  register(email, password){
    return this.afAuth.createUserWithEmailAndPassword(email, password)
  }

  async login(email, password): Promise<string | void> {
    try{
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      if(userCredential.user){
        console.log(userCredential.user.emailVerified)
        if(userCredential.user.emailVerified){
          this.router.navigate(['/'])
        }else{
          console.log('Email not verified. Please check your email for verification.');
        }
      }
    } catch(error){
      console.log('An unexpected error occurred. Please try again.');
    }
  }

  logout(){
    return this.afAuth.signOut()
  }

  //deleteAccount(){
  //  this.afAuth.currentUser.then(user => {
  //    user?.delete()
  //  })
  //}

  recoverPassword(email: string): Observable<void>{
    return from(this.afAuth.sendPasswordResetEmail(email));
  }
}
