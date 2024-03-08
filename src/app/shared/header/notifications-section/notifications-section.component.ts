import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { Notification } from '../../interfaces/notification';

@Component({
  selector: 'app-notifications-section',
  templateUrl: './notifications-section.component.html',
  styleUrls: ['./notifications-section.component.scss']
})
export class NotificationsSectionComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscriptions: Subscription = new Subscription();
  isLoading: boolean = true; // Indicates if the notifications are being loaded


  @Output() toggleNotificationEvent = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService
  ){}

  // Emit an event to toggle the notification view in the parent component.
  toggleNotification(): void {
    this.toggleNotificationEvent.emit();
  }

  // Asynchronously fetch the current user and then their notifications on component initialization.
  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;
      // Await the promise to resolve for getting the current user details.
      const user = await this.authService.getUser();
      if (user) {
        // Fetch notifications if the user data is successfully retrieved.
        this.getUserNotifications(user.uid);
      }
    } catch (error) {
      // Log any errors that occur during the fetch operation.
      console.error('Error fetching user data:', error);
    }
  }

  // Fetch user notifications using the provided UID and subscribe to the observable.
  private getUserNotifications(uid: string): void {
    const subscription = this.notificationsService.getUserNotifications(uid).subscribe({
      next: (notifications) => this.processNotifications(notifications),
      error: (error) => console.error('Error fetching notifications:', error)
    });
    // Add the subscription to the subscriptions list for cleanup.
    this.subscriptions.add(subscription);
  }

  // Process the fetched notifications, converting timestamps and updating the local array.
  private processNotifications(notifications: Notification[]): void {
    this.notifications = notifications.map(notification => ({
      ...notification,
      // Convert the timestamp from Firestore Timestamp to JavaScript Date object.
      timestamp: (notification.timestamp as any).toDate()
    }));
    this.isLoading = false;
  }

  // Unsubscribe from all subscriptions when the component is destroyed to prevent memory leaks.
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
