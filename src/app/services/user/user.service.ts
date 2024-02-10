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

  addNewUser(userId: string, user: User) {
    return this.fs.doc(`users/${userId}`).set(
      {
        firstName: user.firstName ,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        points: 0   //you can put => name and address by themself because the name of property is the same ass var
      }
    )
  }

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
