import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Chat, Message } from 'src/app/shared/interfaces/chat.interface';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatsCollection: AngularFirestoreCollection<Chat>;
  public user: any;

  constructor(
    private fs: AngularFirestore,
    private authService: AuthService
  ) {
    this.chatsCollection = this.fs.collection<Chat>('chats');
    this.authService.user$.subscribe(user => this.user = user);
  }

  // Get all chats for the current user
  getChats(uid: string): Observable<Chat[]> {
    return this.chatsCollection.valueChanges().pipe(
      map(chats => chats.filter(chat => chat.participants.includes(uid)))
    );
  }

  // Get messages for a specific chat
  getMessages(chatId: string): Observable<Message[]> {
    return this.fs.collection<Message>('chats/' + chatId + '/messages', ref => ref.orderBy('timestamp')).valueChanges({ idField: 'id' });
  }

  // Create a new chat
  async createChat(recipientId: string): Promise<string> {
    const chatId = this.fs.createId();
    await this.chatsCollection.doc(chatId).set({
      id: chatId,
      participants: [this.user.uid, recipientId]
    });
    return chatId;
  }

  // Send a message to a chat
  sendMessage(chatId: string, message: string): void {
    const messageObj = {
      text: message,
      sender: this.user.uid,
      timestamp: new Date()
    };
    this.fs.collection('chats/' + chatId + '/messages').add(messageObj);
  }

  // Check if a chat already exists between two users
  async doesChatExist(recipientId: string): Promise<boolean> {
    const chats = await this.getChats(recipientId).toPromise();
    return chats.some(chat => chat.participants.includes(recipientId));
  }

  getChat(chatId: string, uid: string): Observable<Chat | null> {
    return this.chatsCollection.doc<Chat>(chatId).valueChanges( { idField: 'id' } ).pipe(
      map(chat => {
        if (chat && chat.participants.includes(uid)){
          return chat;
        }else{
          return null;  // Return null for unauthorized access
        }
      })
    );
  }

}