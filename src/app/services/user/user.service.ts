import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from '../auth/auth.service';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private fs: AngularFirestore, private authService: AuthService) { }
  
  getUserInfo(){
    return this.authService.user.pipe(
      switchMap(user => {
        return (this.fs.doc(`users/${user.uid}`).valueChanges());
      })
    );
  }

  getUserInfoById(id: string){
    return (this.fs.doc(`users/${id}`).valueChanges());
  }
  
}
