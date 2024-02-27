import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private fs: AngularFirestore, private authService: AuthService) { }

  getUserInfoById(id: string): Observable<User | null> {
    return this.fs.doc(`users/${id}`).valueChanges({ idField: 'uid' });
  }
  
}
