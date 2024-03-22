import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, lastValueFrom, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Chat, Message } from 'src/app/shared/interfaces/chat.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  /**
   * Constructs the chat service with necessary dependencies.
   * 
   * @param firestore - The AngularFirestore service to interact with Firestore.
   * @param authService - The AuthService to manage authentication.
   * @param router - The Router for navigation.
   */
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Gets the Firestore collection path for chats or a specific chat.
   * 
   * @param chatId - Optional ID of the chat for which the path is required.
   * @returns The collection path for chats or a specific chat.
   */
  private getChatCollectionPath(chatId?: string): string {
    return `chats${chatId ? '/' + chatId : ''}`;
  }

  /**
   * Gets the Firestore collection path for messages within a chat.
   * 
   * @param chatId - The ID of the chat.
   * @returns The collection path for messages within the chat.
   */
  private getMessageCollectionPath(chatId: string): string {
    return `${this.getChatCollectionPath(chatId)}/messages`;
  }

  /**
   * Retrieves the current user's UID.
   * 
   * @throws Error if the user is not found.
   * @returns A promise resolving to the current user's UID.
   */
  private async getCurrentUserUID(): Promise<string> {
    const user = await this.authService.getUser();
    if (!user) throw new Error('User not found');
    return user.uid;
  }

  /**
   * Checks if a chat exists between the current user and the specified recipient.
   * 
   * @param uid - The current user's UID.
   * @param recipientId - The recipient's UID.
   * @returns A promise resolving to the chat ID if it exists, or null otherwise.
   */
  private async doesChatExist(uid: string, recipientId: string): Promise<string|null> {
    try {
      // Define the query function to search for chats including the current user
      const queryFn: QueryFn = (ref: CollectionReference) =>
        ref.where('participants', 'array-contains', uid);
  
      // Fetch chats that include the current user
      const chats = await lastValueFrom(
        this.firestore.collection<Chat>(this.getChatCollectionPath(), queryFn)
          .valueChanges({idField: 'id'}).pipe(take(1))
      );
  
      // Find a chat that includes both the current user and the recipient
      const existingChat = chats.find(chat => chat.participants.includes(recipientId));
      console.log(existingChat)
      // Return the chat ID if found, null otherwise
      return existingChat ? existingChat.id : null;
    } catch (error) {
      console.error('Error checking if chat exists:', error);
      return null;
    }
  }
  

  /**
   * Creates a new chat with a specified recipient or adds a message to an existing chat.
   * 
   * @param recipientId - The recipient's UID.
   * @param postTitle - The title of the post related to the chat.
   * @throws Error if an error occurs during chat creation or message sending.
   */
  async createChat(recipientId: string, postTitle: string): Promise<void> {
    try {
      const userUID = await this.getCurrentUserUID();
      const chatId = await this.doesChatExist(userUID, recipientId);

      const entryMessageObj = {
        text: `Hey There, I'm interested in ${postTitle}`,
        sender: userUID,
        timestamp: new Date()
      };

      if (chatId) {
        await this.firestore.collection(this.getMessageCollectionPath(chatId)).add(entryMessageObj);
        this.router.navigate([`/pages/chats/${chatId}`]);
      } else {
        const newChatId = this.firestore.createId();
        await Promise.all([
          this.firestore.collection<Chat>(this.getChatCollectionPath()).doc(newChatId).set({
            id: newChatId,
            participants: [userUID, recipientId]
          }),
          this.firestore.collection(this.getMessageCollectionPath(newChatId)).add(entryMessageObj),
        ]);
        this.router.navigate([`/pages/chats/${newChatId}`]);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      // Handle or propagate error appropriately
    }
  }
  /**
   * Retrieves messages for a specified chat.
   * 
   * @param chatId - The ID of the chat.
   * @returns An Observable of message arrays for the chat.
   */
  getMessages(chatId: string): Observable<Message[]> {
    return this.firestore.collection<Message>(this.getMessageCollectionPath(chatId), ref => ref.orderBy('timestamp'))
      .valueChanges({ idField: 'id' });
  }

  /**
   * Retrieves the last message for a specified chat.
   * 
   * @param chatId - The ID of the chat.
   * @returns An Observable of the last message in the chat.
   */
  getLastMessage(chatId: string): Observable<Message> {
    return this.firestore.collection<Message>(this.getMessageCollectionPath(chatId), ref => ref.orderBy('timestamp', 'desc'))
      .valueChanges({ idField: 'id' })
      .pipe(map(messages => messages[0]));
  }

  /**
   * Retrieves all chats for a specified user.
   * 
   * @param uid - The user's UID.
   * @returns An Observable of chat arrays that the user participates in.
   */
  getChats(uid: string): Observable<Chat[]> {
    const queryFn: QueryFn = (ref: CollectionReference) =>
      ref.where('participants', 'array-contains', uid);

    return this.firestore.collection<Chat>(this.getChatCollectionPath(), queryFn).valueChanges()
      .pipe(catchError(error => {
        console.error('Error fetching chats:', error);
        throw error;
      }));
  }

  /**
   * Retrieves a specific chat by its ID, ensuring the user is a participant.
   * 
   * @param chatId - The ID of the chat.
   * @param uid - The user's UID.
   * @returns An Observable of the chat if the user is a participant, or null otherwise.
   */
  getChat(chatId: string, uid: string): Observable<Chat | null> {
    return this.firestore.collection<Chat>(this.getChatCollectionPath()).doc<Chat>(chatId).valueChanges({ idField: 'id' })
      .pipe(switchMap(chat => {
        if (chat && chat.participants.includes(uid)) {
          return of(chat);
        } else {
          console.warn('Unauthorized access or chat not found.');
          return of(null);
        }
      }), catchError(error => {
        console.error('Error fetching chat details:', error);
        return of(null);
      }));
  }

  /**
   * Sends a message in a specific chat.
   * 
   * @param chatId - The ID of the chat where the message will be sent.
   * @param message - The message text to be sent.
   * @throws Error if an error occurs during message sending.
   */
  async sendMessage(chatId: string, message: string): Promise<void> {
    try {
      const userUID = await this.getCurrentUserUID();
      const messageObj = {
        text: message,
        sender: userUID,
        timestamp: new Date()
      };
      await this.firestore.collection(this.getMessageCollectionPath(chatId)).add(messageObj);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle or propagate error appropriately
    }
  }
  
}
