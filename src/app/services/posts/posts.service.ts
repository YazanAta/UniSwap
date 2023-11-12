import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private authService: AuthService, private firestore: AngularFirestore) { }

  getUserPosts(uid: string) {
    return this.firestore.collection(`users/${uid}/posts`).snapshotChanges();
  }
  
}
