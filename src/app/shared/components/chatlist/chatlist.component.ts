import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { Chat, Message } from 'src/app/shared/interfaces/chat.interface';

/**
 * Component responsible for displaying a list of chats.
 */
@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss']
})
export class ChatListComponent implements OnInit, OnDestroy {
  chats: Chat[] = []; // Array to hold the list of chats
  recipientUsernames: { [chatId: string]: Observable<string> } = {}; // Map of chat IDs to recipient usernames
  lastMessages = {}; // Map to store the last message of each chat
  uid: string; // User ID of the currently logged-in user
  isLoading: boolean = true; // Flag to indicate if chat list is loading
  private subscriptions = new Subscription(); // Subscription to manage observables

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getChats();
  }

  /**
   * Fetches the list of chats for the current user and initializes necessary data.
   */
  private getChats(): void {
    this.authService.getUser().then(user => {
      this.uid = user.uid;
      // Subscribe to chat updates
      const chatSubscription = this.chatService.getChats(user.uid)
        .subscribe(chats => {
          this.chats = chats;
          this.updateRecipientUsernames();
          this.updateLastMessageFromChat();
          this.isLoading = false;
        });

      this.subscriptions.add(chatSubscription);
    });
  }

  /**
   * Updates recipient usernames for each chat.
   */
  private updateRecipientUsernames(): void {
    this.recipientUsernames = {};
    this.chats.forEach(chat => {
      this.recipientUsernames[chat.id] = this.getRecipientUsername(chat);
    });
  }

  /**
   * Retrieves the username of the chat recipient.
   * @param chat The chat object.
   * @returns An observable string representing the recipient's username.
   */
  getRecipientUsername(chat: Chat): Observable<string> {
    if (!chat) {
      return of(null);
    } else {
      const recipientId = chat.participants.find(id => id !== this.uid);
      return this.userService.getUserInfoById(recipientId).pipe(
        map(user => user?.firstName || 'Unknown') // Use optional chaining to handle null case
      );
    }
  }

  /**
   * Updates the last message for each chat.
   */
  private updateLastMessageFromChat(): void {
    this.chats.forEach(chat => {
      this.getLastMessageFromChat(chat.id).subscribe((message) => {
        this.lastMessages[chat.id] = message;
      });
    });
  }

  /**
   * Retrieves the last message of a chat.
   * @param chatId The ID of the chat.
   * @returns An observable representing the last message of the chat.
   */
  getLastMessageFromChat(chatId: string): Observable<Message | null> {
    return this.chatService.getLastMessage(chatId); // You already have this method
  }

  /** Event emitter to toggle the chat list visibility. */
  @Output() toggleChatListEvent = new EventEmitter<void>();

  /**
   * Emits an event to toggle the chat list visibility.
   */
  toggleChatList(): void {
    this.toggleChatListEvent.emit();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
