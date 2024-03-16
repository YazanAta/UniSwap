import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, lastValueFrom } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Chat, Message } from 'src/app/shared/interfaces/chat.interface';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) { }

  // Create a new chat
  async createChat(recipientId: string, postTitle: string): Promise<string> {
    // Get the current user
    const user = await this.authService.getUser();

    // Check if the chat already exists
    const doesChatExist = await this.doesChatExist(user.uid, recipientId);

    // Initial message to be sent when creating a new chat
    const entryMessageObj = {
      text: "Hey There, im intrested in " + postTitle,
      sender: user.uid,
      timestamp: new Date()
    };
    
    if(doesChatExist){
      console.log("Chat Already Exists");
      return null;
    }else{
      // Generate a new chatId
      const chatId = this.firestore.createId();
      // Create a new chat and add the entry message
      await Promise.all([
        this.firestore.collection<Chat>('chats').doc(chatId).set({
          id: chatId,
          participants: [user.uid, recipientId]
        }),
        this.firestore.collection('chats/' + chatId + '/messages').add(entryMessageObj),
      ])
      
      return chatId;
    }
  }

  // Get messages for a specific chat
  getMessages(chatId: string): Observable<Message[]> {
    return this.firestore.collection<Message>('chats/' + chatId + '/messages', ref => ref.orderBy('timestamp')).valueChanges({ idField: 'id' });
  }

  // Get the last message in a chat
  getLastMessage(chatId: string): Observable<Message> { 
    return this.firestore.collection<Message>('chats/' + chatId + '/messages', ref => ref.orderBy('timestamp', 'desc').limit(1))
      .valueChanges({ idField: 'id' })
      .pipe(
        map(messages => messages[0]) // Access the first (and only) element from the array
      );
  }

  // Get all chats for the current user
  getChats(uid: string): Observable<Chat[]> {    
    // Using AngularFire to get real-time updates on the 'chatsCollection'
    return this.firestore.collection<Chat>('chats').valueChanges().pipe(
        // Filtering the chats based on whether the user is a participant
        map(chats => chats.filter(chat => chat.participants.includes(uid)))
    );
  }

  // Get details of a specific chat
  getChat(chatId: string, uid: string): Observable<Chat | null> {
    return this.firestore.collection<Chat>('chats').doc<Chat>(chatId).valueChanges( { idField: 'id' } ).pipe(
      map(chat => {
        if (chat && chat.participants.includes(uid)){
          return chat;
        }else{
          return null;  // Return null for unauthorized access
        }
      })
    );
  }

  // Check if a chat already exists between two users
  private async doesChatExist(uid: string, recipientId: string): Promise<boolean> {
    try {
      const chats = await this.getChats(uid);
      this.getChats(uid).pipe(take(1)).subscribe((chats) => {
        if (chats) {
          return chats.some(chat => chat.participants.includes(recipientId));
        } else {
          return false;
        }
      })
    } catch (error) {
      console.error('Error checking if chat exists:', error);
      return false;
    }
  }

  // Send a message to a chat
  async sendMessage(chatId: string, message: string): Promise<void> {
    // Get the current user
    const user = await this.authService.getUser(); 

    // Create the message object
    const messageObj = {
      text: message,
      sender: user.uid,
      timestamp: new Date()
    };

    // Add the message to the chat
    this.firestore.collection('chats/' + chatId + '/messages').add(messageObj);

  }


}