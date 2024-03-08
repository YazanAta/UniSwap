import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Timestamp } from 'firebase/firestore';
import { Observable, from, of, switchMap } from 'rxjs';

import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { Chat, Message } from 'src/app/shared/interfaces/chat.interface';
import { User } from 'src/app/shared/interfaces/user.interface';
import { SwapListComponent } from '../swap-list/swap-list.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chatId: string;
  chat: Chat | null = null;
  messages: Message[] = [];
  otherParticipant: User;
  currentUserId: string;
  isLoading: boolean = true;
  newMessage: string = '';

  @ViewChild('chatMessages') private chatMessages: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.initializeChat();
  }

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

  private processChatData(chatId: string, user: User): Observable<Message[]> {
    this.currentUserId = user.uid;
    this.chatId = chatId;
    return this.chatService.getChat(chatId, user.uid).pipe(
      switchMap(chat => this.chatAndMessages(chat))
    );
  }

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

  private processMessages(messages: Message[] | null): void {
    if (!messages) return;
    this.isLoading = false;
    this.messages = messages.map(message => ({
      ...message,
      timestamp: (message.timestamp as Timestamp).toDate()
    }));
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    } catch(err) {}
  }

  private getRecipientUserInfo(chat: Chat): Observable<User> {
    const recipientId = chat.participants.find(id => id !== this.currentUserId);
    if (!recipientId) throw new Error("Recipient ID not found");
    return this.userService.getUserInfoById(recipientId);
  }

  async sendMessage(): Promise<void> {
    if (!this.newMessage.trim() || !this.chatId) return;
    await this.chatService.sendMessage(this.chatId, this.newMessage.trim());
    this.newMessage = '';    
  }

  public openSwapListModal(): void {
    const modalRef = this.modalService.open(SwapListComponent);
    modalRef.componentInstance.otherParticipant = this.otherParticipant;
    modalRef.componentInstance.uid = this.currentUserId;
  }
}
