import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private fs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) { }


  getChat(chatId){
    return this.fs
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return {id: doc.payload.id, ...doc.payload.data() }
        })
      )
  }


  async create() {
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      createdAt: Date.now(),
      count: 0,
      messages: []
    }

    const docRef = await this.fs.collection('chats').add(data);

    return this.router.navigate(['chats', docRef.id]);
  }


  async sendMessage(chatId, content){
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if(uid) {
      const ref = this.fs.collection('chat').doc(chatId);
      return ref.update({
        //message: fires
      })
    }
  }
}
