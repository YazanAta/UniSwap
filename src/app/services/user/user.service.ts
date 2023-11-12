import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fs: AngularFirestore) { }

  addNewUser(userId: string, user: User) {
    return this.fs.doc(`users/${userId}`).set(
      {
        firstName: user.firstName ,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        verified: false,
        points: 0   //you can put => name and address by themself because the name of property is the same ass var
      }
    )
  }

  getUserInfo(userId: string) {
    return this.fs.doc(`users/${userId}`).valueChanges();
  }
  
}
