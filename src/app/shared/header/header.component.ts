import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

/**
 * Angular component representing the header of the application.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /** Flag indicating whether a user is authenticated. */
  isUser: boolean = false;

  /** Theme logo path for the header. Defaults to 'assets/images/logos/logo.png'. */
  themeLogo: string = 'assets/images/logos/logo.png';

  /** Flag to control the visibility of notifications. */
  showNotification: boolean = false;

  /** Flag to control the visibility of the chat list. */
  showChatList: boolean = false;

  /**
   * Constructs a new HeaderComponent.
   * @param authService The authentication service for user authentication.
   */
  constructor(private authService: AuthService) { }

  /**
   * Lifecycle hook that runs after the component has been initialized.
   * Subscribes to the authService's user observable to determine authentication state.
   */
  ngOnInit(): void {
    this.authService.user$?.subscribe((user) => {
      this.isUser = !!user; // Set isUser based on user existence
    });
  }

  /**
   * Toggles the visibility of the notification or chat list.
   * @param list The list type to toggle ('notification' or 'chat'). Defaults to 'notification'.
   */
  toggleList(list: 'notification' | 'chat' = 'notification'): void {
    if (list === 'notification') {
      this.showNotification = !this.showNotification;
      this.showChatList = false; // Hide chat list when showing notifications
    } else if (list === 'chat') {
      this.showChatList = !this.showChatList;
      this.showNotification = false; // Hide notifications when showing chat list
    }
  }
}
