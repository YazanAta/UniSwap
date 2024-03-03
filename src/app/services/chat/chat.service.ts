import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
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

 
  // Get messages for a specific chat
  getMessages(chatId: string): Observable<Message[]> {
    return this.fs.collection<Message>('chats/' + chatId + '/messages', ref => ref.orderBy('timestamp')).valueChanges({ idField: 'id' });
  }

  getLastMessage(chatId: string): Observable<Message> { 
    return this.fs.collection<Message>('chats/' + chatId + '/messages', ref => ref.orderBy('timestamp', 'desc').limit(1))
      .valueChanges({ idField: 'id' })
      .pipe(
        map(messages => messages[0]) // Access the first (and only) element from the array
      );
  }

  // Get all chats for the current user
  getChats(uid: string): Promise<Chat[]> {    
    // Using AngularFire to get real-time updates on the 'chatsCollection'
    return this.chatsCollection.valueChanges().pipe(
        // Filtering the chats based on whether the user is a participant
        map(chats => chats.filter(chat => chat.participants.includes(uid))),
        // Take 1 emission and convert to a Promise
        take(1)
    ).toPromise();
  }


  // Check if a chat already exists between two users
  async doesChatExist(uid: string, recipientId: string): Promise<boolean> {
    const chats = await this.getChats(uid)
      if(chats){
        return chats.some(chat => chat.participants.includes(recipientId));
      }else{
        return false
      } 
  }

  // Create a new chat
  async createChat(recipientId: string, postTitle: string): Promise<string> {
    const user = await this.authService.getUser(); 

    const doesChatExist = await this.doesChatExist(user.uid, recipientId);

    const entryMessageObj = {
      text: "Hey There, im intrested in " + postTitle,
      sender: this.user.uid,
      timestamp: new Date()
    };
    
    if(doesChatExist){
      console.log("Chat Already Exists");
      return null;
    }else{
      const chatId = this.fs.createId();
      await this.chatsCollection.doc(chatId).set({
        id: chatId,
        participants: [user.uid, recipientId]
      });
      this.fs.collection('chats/' + chatId + '/messages').add(entryMessageObj);
      return chatId;
    }
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