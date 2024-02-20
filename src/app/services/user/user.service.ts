import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private fs: AngularFirestore, private authService: AuthService) { }
  
  private uid: string = this.authService.uid;

  getUserInfoById(id: string){
    return (this.fs.doc(`users/${id}`).valueChanges());
  }
  
}
