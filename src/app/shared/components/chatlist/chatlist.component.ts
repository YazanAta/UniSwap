import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { Chat } from 'src/app/shared/interfaces/chat.interface';

/**
 * Component responsible for displaying a list of chats.
 */
@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss']
})
export class ChatListComponent implements OnInit, OnDestroy {
  /** User ID of the currently logged-in user. */
  uid: string;

  /** Event emitter to toggle the chat list visibility. */
  @Output() toggleChatListEvent = new EventEmitter<void>();

  /** Array to hold the list of chats. */
  chats: Chat[] = [];

  /** Map of chat IDs to recipient usernames. */
  recipientUsernames: { [chatId: string]: Observable<string> } = {};

  /** Map to store the last message of each chat. */
  lastMessages = {};

  /** Flag to indicate if chat list is loading. */
  isLoading = true;

  /** Subscription to manage observables. */
  private subscriptions = new Subscription();

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  /**
   * Lifecycle hook called after Angular has initialized all data-bound properties.
   * Fetches the user's chats and initializes the component.
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.authService.getUser()
      .then(user => {
        this.uid = user.uid;
        this.fetchChats();
      })
      .catch(error => {
        console.error('Error retrieving user:', error);
        this.isLoading = false;
      });
  }

  /**
   * Lifecycle hook called before Angular destroys the component.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Fetches the user's chats from the chat service.
   * Handles errors and updates the component state accordingly.
   */
  fetchChats(): void {
    const chatSubscription = this.chatService.getChats(this.uid)
      .pipe(
        catchError(error => {
          console.error('Error fetching chats:', error);
          this.isLoading = false;
          return of([]); // Provide an empty array to continue rendering
        })
      )
      .subscribe(chats => {
        this.chats = chats;
        this.updateRecipientUsernames();
        this.updateLastMessages();
        this.isLoading = false;
      });

    this.subscriptions.add(chatSubscription);
  }

  /**
   * Updates recipient usernames for each chat based on participant IDs.
   * Handles errors and provides a default username for unidentified users.
   */
  private updateRecipientUsernames(): void {
    this.recipientUsernames = {};
    this.chats.forEach(chat => {
      const recipientId = chat.participants.find(id => id !== this.uid);
      if (recipientId) {
        this.recipientUsernames[chat.id] = this.userService.getUserInfoById(recipientId)
          .pipe(
            map(user => user?.firstName || 'Unknown'),
            catchError(() => of('Unknown')) // Handle error with default value
          );
      }
    });
  }

  /**
   * Updates the last message of each chat.
   * Handles errors and sets the last message to `null` if retrieval fails.
   */
  private updateLastMessages(): void {
    this.lastMessages = {};
    this.chats.forEach(chat => {
      this.chatService.getLastMessage(chat.id)
        .pipe(
          catchError(() => of(null)) // Handle error if message retrieval fails
        )
        .subscribe((message) => {
          this.lastMessages[chat.id] = message;
        });
    });
  }

  /**
   * Emits an event to toggle the chat list visibility.
   */
  toggleChatList(): void {
    this.toggleChatListEvent.emit();
  }
}
