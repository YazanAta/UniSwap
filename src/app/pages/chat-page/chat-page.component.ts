import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit{
  constructor(private chatService: ChatService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe(user => {
      console.log(user);
    })
  }

  chats$ = this.chatService.getChatsForUser('user1');

}
