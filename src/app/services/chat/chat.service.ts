import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, map } from 'rxjs';
import { Chat, Message } from 'src/app/interfaces/chat.interface';
import firebase from 'firebase/compat/app';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(private firestore: AngularFirestore) { }

    getChat(chatId: string) {
        return this.firestore.collection('chats').doc(chatId).valueChanges();
    }

    async createChat(user1Id: string, user2Id: string) {
        const chat: Chat = {
            user1Id,
            user2Id,
            messages: []
        };

        const chatRef = await this.firestore.collection('chats').add(chat);
        return chatRef.id;
    }

    sendMessage(chatId: string, message: Message) {
      this.firestore.collection('chats').doc(chatId).update({
        messages: firebase.firestore.FieldValue.arrayUnion(message)
      });
    }

    getChatsForUser(userId: string) {
      const user1Chats$ = this.firestore.collection('chats', ref => ref.where('user1Id', '==', userId)).snapshotChanges();
      const user2Chats$ = this.firestore.collection('chats', ref => ref.where('user2Id', '==', userId)).snapshotChanges();

    
      return combineLatest([user1Chats$, user2Chats$]).pipe(
        map(([user1Chats, user2Chats]) => [...user1Chats, ...user2Chats])
      );
    }
}
