import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Timestamp } from 'firebase/firestore';
import { Observable, from, map, of, switchMap, take } from 'rxjs';
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
  toggled

  newMessage: string = '';

  otherParticipant: User;
  currentUserId: string;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private us: UserService,
    private authService: AuthService,
    private modalService: NgbModal) { }
  
    
  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => {
        const chatId = params.get('chatId');
        if (chatId) {
          return from(this.authService.getUser()).pipe(
            switchMap(user => this.processChatData(chatId, user))
          );
        } else {
          return of(null); // Handle the case where there's no chatId in the URL
        }
      })
    ).subscribe(
      messages => {
        this.messages = messages.map(message => {
          return {
            ...message,
            timestamp: (message.timestamp as Timestamp).toDate()
          }
        })
      },
      error => console.error('Error:', error)
    );
  }


  private processChatData(chatId: string, user: any): Observable<any> {
    this.currentUserId = user.uid;
    this.chatId = chatId;
  
    return this.chatService.getChat(this.chatId, user.uid).pipe(
      switchMap(chat => {
        this.chat = chat;
        if (this.chat) {
          return this.getRecipientUsername(chat).pipe(
            switchMap(user => {
              this.otherParticipant = user;
              return this.chatService.getMessages(this.chatId);
            })
          );
        } else {
          return of([]);  // Returning an empty observable if there is no chat
        }
      })
    );
  }
  
  getRecipientUsername(chat: Chat): Observable<User> {
    const recipientId = chat.participants.find(id => id !== this.currentUserId);
  
    return this.us.getUserInfoById(recipientId).pipe(take(1));
  }

  sendMessage() {
    if (!this.newMessage || !this.chat) {
      return;
    }
    
    this.chatService.sendMessage(this.chatId, this.newMessage);
    this.newMessage = ''; // Clear the message input after sending
  }

  // Open add post modal
  public openModal(otherParticipant: User, uid: string) {
    const modalRef = this.modalService.open(SwapListComponent);
    modalRef.componentInstance.otherParticipant = otherParticipant;
    modalRef.componentInstance.uid = uid;

  }

}