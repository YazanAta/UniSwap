import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Timestamp } from 'firebase/firestore';
import { Observable, Subject, from, of, switchMap } from 'rxjs';

import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { Chat, Message } from 'src/app/shared/interfaces/chat.interface';
import { User } from 'src/app/shared/interfaces/user.interface';
import { SwapListComponent } from '../swap-list/swap-list.component';

/**
 * Component responsible for managing and displaying chat interactions.
 */
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  /** ID of the current chat. */
  chatId: string;

  /** Chat object representing the current chat. */
  chat: Chat | null = null;

  /** Array of messages within the chat. */
  messages: Message[] = [];

  /** Information about the other participant in the chat. */
  otherParticipant: User;

  /** ID of the currently authenticated user. */
  currentUserId: string;

  /** Flag to track loading state of the component. */
  isLoading: boolean = true;

  /** Text for the new message being composed. */
  newMessage: string = '';
  
  /** Holds selected emoji */
  emoji: any;

  /** Flag to control visibility of emoji picker */
  showEmojiPicker: boolean = false;

  private destroy$ = new Subject<void>();

  /** Reference to the chat messages container in the template. */
  @ViewChild('chatMessages') private chatMessages: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService,
    private modalService: NgbModal,
  ) {}

  /**
   * Lifecycle hook called after component initialization.
   * Initializes the chat based on the route parameter.
   */
  ngOnInit(): void {
    this.initializeChat();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initializes the chat by fetching chat data based on the route parameter.
   * Uses the current user's information to process chat data.
   */
  private initializeChat(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const chatId = params.get('chatId');
        if (!chatId) return of(null);
        return from(this.authService.getUser()).pipe(
          switchMap(user => this.processChatData(chatId, user))
        );
      })
    ).subscribe({
      next: messages => this.processMessages(messages),
      error: error => console.error('Error:', error)
    });
  }

  /**
   * Processes chat data based on the chat ID and current user information.
   * @param chatId The ID of the chat to retrieve.
   * @param user The current authenticated user.
   * @returns An observable stream of messages.
   */
  private processChatData(chatId: string, user: User): Observable<Message[]> {
    this.currentUserId = user.uid;
    this.chatId = chatId;
    return this.chatService.getChat(chatId, user.uid).pipe(
      switchMap(chat => this.chatAndMessages(chat))
    );
  }

  /**
   * Retrieves chat details and messages based on the provided chat object.
   * @param chat The chat object to process.
   * @returns An observable stream of messages.
   */
  private chatAndMessages(chat: Chat | null): Observable<Message[]> {
    this.chat = chat;
    if (!this.chat) return of([]);
    return this.getRecipientUserInfo(this.chat).pipe(
      switchMap(user => {
        this.otherParticipant = user;
        return this.chatService.getMessages(this.chatId);
      })
    );
  }

  /**
   * Processes messages retrieved for the chat.
   * @param messages An array of messages to process.
   */
  private processMessages(messages: Message[] | null): void {
    if (!messages) return;
    this.isLoading = false;
    this.messages = messages.map(message => ({
      ...message,
      timestamp: message.timestamp ? (message.timestamp instanceof Date ? message.timestamp : (message.timestamp as Timestamp).toDate()) : 'Loading...'
    }));
    setTimeout(() => {
      this.scrollToBottom();
    }, 50)
  }

  /**
   * Scrolls the chat messages container to the bottom.
   */

  private scrollToBottom(): void {
    try {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  /**
   * Retrieves information about the chat recipient.
   * @param chat The chat object containing participant IDs.
   * @returns An observable stream of user information.
   */
  private getRecipientUserInfo(chat: Chat): Observable<User> {
    const recipientId = chat.participants.find(id => id !== this.currentUserId);
    if (!recipientId) throw new Error("Recipient ID not found");
    return this.userService.getUserInfoById(recipientId);
  }

  /**
   * Sends a new message in the chat.
   * If the message text is empty or the chat ID is not set, no action is taken.
   */
  async sendMessage(): Promise<void> {
    if (!this.newMessage.trim() || !this.chatId) return;
    try {
      await this.chatService.sendMessage(this.chatId, this.newMessage.trim());
      this.newMessage = '';
      this.showEmojiPicker = false;
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      this.scrollToBottom();
    }
  }

  /**
   * Opens the swap list modal for the chat's other participant.
   */
  public openSwapListModal(): void {
    const modalRef = this.modalService.open(SwapListComponent);
    modalRef.componentInstance.otherParticipant = this.otherParticipant;
    modalRef.componentInstance.uid = this.currentUserId;
  }

  /**
   * Adds an emoji to the new message being composed.
   * @param event The emoji selection event.
   */
  addEmoji(event: any): void {
    this.newMessage = this.newMessage + event.emoji.native;
  }

  /**
   * Toggles the visibility of the emoji picker.
   */
  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
}
