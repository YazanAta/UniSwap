import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { Notification } from '../../interfaces/notification';

/**
 * Angular component representing the section for displaying notifications.
 */
@Component({
  selector: 'app-notifications-section',
  templateUrl: './notifications-section.component.html',
  styleUrls: ['./notifications-section.component.scss']
})
export class NotificationsSectionComponent implements OnInit, OnDestroy {
  /** Array containing the notifications to display. */
  notifications: Notification[] = [];

  /** Flag indicating whether notifications are currently being loaded. */
  isLoading: boolean = true;

  /** Event emitter to toggle the visibility of notifications in the parent component. */
  @Output() toggleNotificationEvent = new EventEmitter<void>();

  /** Subscription object to manage subscriptions for cleanup. */
  private subscriptions: Subscription = new Subscription();

  /**
   * Constructs a new NotificationsSectionComponent.
   * @param authService The authentication service used to retrieve the current user.
   * @param notificationsService The service responsible for fetching user notifications.
   */
  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService
  ) {}

  /**
   * Emits an event to toggle the visibility of notifications in the parent component.
   */
  toggleNotification(): void {
    this.toggleNotificationEvent.emit();
  }

  /**
   * Initializes the component by fetching user notifications asynchronously.
   */
  async ngOnInit(): Promise<void> {
    try {
      const user = await this.authService.getUser();
      if (user) {
        this.fetchUserNotifications(user.uid);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error appropriately, e.g., show a toast notification
    }
  }

  /**
   * Fetches user notifications using the provided UID.
   * @param uid The user ID used to fetch notifications.
   */
  private fetchUserNotifications(uid: string): void {
    this.isLoading = true;
    const subscription = this.notificationsService.getUserNotifications(uid).subscribe({
      next: (notifications) => {
        this.processNotifications(notifications);
        this.isLoading = false; // Toggle loading flag on successful response
      },
      error: (error) => {
        console.error('Error fetching notifications:', error);
        // Handle error appropriately, e.g., show a toast notification
        this.isLoading = false; // Set isLoading to false on error
      },
      complete: () => {
        this.isLoading = false; // Set isLoading to false when subscription completes
      }
    });
    this.subscriptions.add(subscription);
  }

  /**
   * Processes the fetched notifications, converting timestamps and updating the local array.
   * @param notifications The array of notifications fetched from the service.
   */
  private processNotifications(notifications: Notification[]): void {
    this.notifications = notifications.map(notification => ({
      ...notification,
      timestamp: (notification.timestamp as any).toDate() // Convert Firestore Timestamp to Date
    }));
  }

  /**
   * Cleans up subscriptions when the component is destroyed to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
