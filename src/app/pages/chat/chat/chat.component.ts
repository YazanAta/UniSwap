import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, from, map, of, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { Chat, Message } from 'src/app/shared/interfaces/chat.interface';
import { User } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatId: string;
  chat: Chat | null = null;
  messages: Message[] = [];

  newMessage: string = '';

  recipientUsername: string;
  currentUserId: string;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private us: UserService,
    private authService: AuthService) { }
  
    
  ngOnInit() {
    from(this.authService.getUser()).pipe(
      switchMap(user => {
        this.currentUserId = user.uid;
        this.chatId = this.route.snapshot.paramMap.get('chatId');
        return this.chatService.getChat(this.chatId, user.uid);
      }),
      switchMap(chat => {
        this.chat = chat;
        if (this.chat) {
          return this.getRecipientUsername(chat).pipe(
            switchMap(recipientUsername => {
              this.recipientUsername = recipientUsername;
              return this.chatService.getMessages(this.chatId);
            })
          );
        } else {
          return of([]);  // Returning an empty observable if there is no chat
        }
      })
    ).subscribe(messages => this.messages = messages, error => console.error('Error:', error));
  }
  
  getRecipientUsername(chat: Chat): Observable<string> {
    const recipientId = chat.participants.find(id => id !== this.currentUserId);
  
    return this.us.getUserInfoById(recipientId).pipe(
      take(1),
      map((user) => user.firstName + " " + user.lastName)
    );
  }

  sendMessage() {
    if (!this.newMessage || !this.chat) {
      return;
    }
    
    this.chatService.sendMessage(this.chatId, this.newMessage);
    this.newMessage = ''; // Clear the message input after sending
  }

}