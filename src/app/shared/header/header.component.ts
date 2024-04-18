import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

/**
 * Angular component representing the header of the application.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  /** Flag indicating whether a user is authenticated. */
  isUserAuthenticated = false;

  /** Theme logo path for the header. Defaults to 'assets/images/logos/logo.png'. */
  themeLogo: string = 'assets/images/logos/logo3.png';

  /** Flag to control the visibility of notifications. */
  showNotification: boolean = false;

  /** Flag to control the visibility of the chat list. */
  showChatList: boolean = false;

  private userSubscription: Subscription; // Subscription to manage observable subscriptions

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
    this.subscribeToUserAuthentication();
  }
  
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
  
  private subscribeToUserAuthentication(): void {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.isUserAuthenticated = !!user; // Update authentication state based on user existence
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
