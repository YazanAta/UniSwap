import { Injectable, Injector } from '@angular/core';
import { Observable, from, take} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<firebase.User>
  userId: string;
  modalService = this.injector.get(NgbModal);

  
  constructor(private afAuth: AngularFireAuth, private router: Router, private injector: Injector) {
    this.user = afAuth.user
  }

  register(email, password){
    return this.afAuth.createUserWithEmailAndPassword(email, password)
  }

  async login(email, password): Promise<string | void> {
    try{
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      if(userCredential.user){
        if(userCredential.user.emailVerified){
          this.router.navigate(['/'])
        }else{
          // User is not verified, don't log them in
          this.modalService.open("User is not verified, not logging in.");
          this.logout();
        }
      }
    } catch(error){
      this.modalService.open("Email or Password are not correct. Please try again.");
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

  //deleteAccount(){
  //  this.afAuth.currentUser.then(user => {
  //    user?.delete()
  //  })
  //}

  recoverPassword(email: string): Observable<void>{
    return from(this.afAuth.sendPasswordResetEmail(email));
  }
}
