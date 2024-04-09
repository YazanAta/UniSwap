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

  /** Subscription object to manage subscriptions for cleanup. */
  private subscriptions: Subscription = new Subscription();

  /** Flag indicating whether notifications are currently being loaded. */
  isLoading: boolean = true;

  /** Event emitter to toggle the visibility of notifications in the parent component. */
  @Output() toggleNotificationEvent = new EventEmitter<void>();

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
      this.isLoading = true;
      const user = await this.authService.getUser();
      if (user) {
        this.getUserNotifications(user.uid);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  /**
   * Fetches user notifications using the provided UID and subscribes to the observable.
   * @param uid The user ID used to fetch notifications.
   */
  private getUserNotifications(uid: string): void {
    const subscription = this.notificationsService.getUserNotifications(uid).subscribe({
      next: (notifications) => this.processNotifications(notifications),
      error: (error) => console.error('Error fetching notifications:', error)
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
      timestamp: (notification.timestamp as any).toDate()
    }));
    this.isLoading = false;
  }

  /**
   * Cleans up subscriptions when the component is destroyed to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
