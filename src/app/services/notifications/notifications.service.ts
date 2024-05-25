import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/shared/interfaces/notification';
import { CustomToastrService } from '../toastr/custom-toastr.service';

/**
 * Service for managing user notifications with Firestore.
 */
@Injectable({ providedIn: 'root' })
export class NotificationsService {

  constructor(private firestore: AngularFirestore, private toastr: CustomToastrService) { }

  /**
   * Pushes a notification to Firestore for a specific user.
   * @param receiverId The ID of the user receiving the notification.
   * @param message The message content of the notification.
   * @param type The type of notification (e.g., 'info', 'alert', 'reminder').
   * @returns A Promise that resolves when the notification is successfully added.
   */
  pushNotification(receiverId: string, message: string, type: string): Promise<void> {
    // Reference to the Firestore collection for user notifications
    const notificationsRef = this.firestore.collection('notifications').doc(receiverId).collection('userNotifications');
    
    // Data to include in the notification document
    const notificationData: Notification = {
      message: message,
      timestamp: new Date(),
      type: type,
    };
  
    // Return a Promise that resolves when the notification is successfully added
    return notificationsRef.add(notificationData)
      .then(() => this.toastr.show('Notification added successfully', 'success', 'success'))
      .catch(error => this.toastr.show('Error adding notification:', 'error', 'error'));
  }
  
  /**
   * Retrieves user notifications from Firestore for a specific user.
   * @param uid The ID of the user to fetch notifications for.
   * @returns An Observable emitting an array of user notifications, ordered by timestamp (latest first).
   */
  getUserNotifications(uid: string): Observable<any[]> {  
    // Reference to the Firestore collection for user notifications, ordered by timestamp
    const userNotificationsRef: AngularFirestoreCollection<any> = this.firestore
      .collection('notifications')
      .doc(uid)
      .collection('userNotifications', ref => ref.orderBy('timestamp', 'desc'));

    // Return an Observable that emits user notifications
    return userNotificationsRef.valueChanges();
  }
  
}
