import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isUser: Boolean = false;
  themeLogo: string = 'assets/logo.png'; // Default Logo

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$?.subscribe((user) => {
      if(user){
        this.isUser = true
      }else{
        this.isUser = false
      }
    })
  }
    
  showNotification: boolean = false;
  showChatList: boolean = false;
  toggleList(list: 'notification' | 'chat' = 'notification') {
    this.showNotification = list === 'notification' ? !this.showNotification : false;
    this.showChatList = list === 'chat' ? !this.showChatList : false;
  }
  
}
