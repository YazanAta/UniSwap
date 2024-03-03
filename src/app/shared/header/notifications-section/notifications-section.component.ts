import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-notifications-section',
  templateUrl: './notifications-section.component.html',
  styleUrls: ['./notifications-section.component.scss']
})
export class NotificationsSectionComponent implements OnInit{

  notifications: any[] = [];

  constructor(
    private notificationsService: NotificationsService,
    private authService: AuthService,
  ){}
  
  @Output() toggleNotificationEvent = new EventEmitter<void>();

  toggleNotification() {
    this.toggleNotificationEvent.emit();
  }

  async ngOnInit() {

    const user = await this.authService.getUser();
    

    this.getUserNotifictions(user.uid);

  }


  getUserNotifictions(uid: string){
    this.notificationsService.getUserNotifications(uid).subscribe((notifications) => {
      // Convert Timestamp to JavaScript Date
      this.notifications = notifications.map(notification => {
        return {
          ...notification,
          timestamp: (notification.timestamp as Timestamp).toDate()
        };
      });
    });
  }

}
