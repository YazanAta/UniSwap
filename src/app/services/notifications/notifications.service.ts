import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/shared/interfaces/notification';

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  constructor(private firestore: AngularFirestore) { }

  // Function to push a notification to Firestore
  pushNotification(recieverId: string, message: string, type: string): Promise<void> {
    // Reference to the Firestore collection for user notifications
    const notificationsRef = this.firestore.collection('notifications').doc(recieverId).collection('userNotifications');
    
    // Data to include in the notification document
    const notificationData: Notification = {
      message: message,
      timestamp: new Date(),
      type: type,
    };
  
    // Return a Promise that resolves when the notification is successfully added
    return notificationsRef.add(notificationData)
      .then(() => console.log('Notification added successfully'))
      .catch(error => console.error('Error adding notification:', error));
  }
  
  // Function to get user notifications from Firestore
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