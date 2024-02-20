import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-notifications-section',
  templateUrl: './notifications-section.component.html',
  styleUrls: ['./notifications-section.component.scss']
})
export class NotificationsSectionComponent implements OnInit{
  constructor(private notificationsService: NotificationsService){}
  notifications: any[] = [];
  ngOnInit(): void {
    this.notificationsService.getUserNotifications().subscribe((notifications) => {
      // Convert Timestamp to JavaScript Date
      this.notifications = notifications.map(notification => {
        return {
          ...notification,
          timestamp: (notification.timestamp as Timestamp).toDate()
        };
      });
    });
  }

  @Output() toggleNotificationEvent = new EventEmitter<void>();

  toggleNotification() {
    this.toggleNotificationEvent.emit();
  }



}
