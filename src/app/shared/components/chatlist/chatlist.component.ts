import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { Chat } from 'src/app/shared/interfaces/chat.interface';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss']
})
export class ChatListComponent implements OnInit {
  chats: Chat[] = [];
  recipientUsernames: { [chatId: string]: Observable<string> } = {};

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    from(this.authService.getUser()).pipe(
      switchMap(user => {
        return this.chatService.getChats(user.uid);
      })
    ).subscribe(chats => {
      this.chats = chats;
      this.updateRecipientUsernames();
    });
  }

  private updateRecipientUsernames(): void {
    this.recipientUsernames = {};
    this.chats.forEach(chat => {
      this.recipientUsernames[chat.id] = this.getRecipientUsername(chat);
    });
  }
  
  getRecipientUsername(chat: Chat): Observable<string> {
    if(!chat){
      return of(null)
    }else{
      const recipientId = chat.participants.find(id => id !== this.chatService.user.uid);
      return this.userService.getUserInfoById(recipientId).pipe(
        map(user => user?.firstName || 'Unknown') // Use optional chaining to handle null case
      );
    }
  }

  @Output() toggleChatListEvent = new EventEmitter<void>();

  toggleChatList() {
    this.toggleChatListEvent.emit();
  }
}