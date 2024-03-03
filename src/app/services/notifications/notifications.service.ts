import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Post } from 'src/app/shared/interfaces/post.interface';

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  constructor(private fs: AngularFirestore) { }

  pushNotification(recieverId: string, message: string, type: string): Promise<void>{
    // Reference to firestore collection and add the message as a document
    const notificationsRef = this.fs.collection('notifications').doc(recieverId).collection('userNotifications');
    
    // Additional data to include in the notification
    const notificationData: any = {
      message: message,
      timestamp: new Date(),
      type: type,
    };

    
    // Return a Promise that resolves when the notification is successfully added
    return notificationsRef.add(notificationData).then();
  }

  getUserNotifications(uid: string): Observable<any[]> {
    
    // Get notifications from the collection by user id, order by time
    const userNotificationsRef: AngularFirestoreCollection<any> = this.fs
    .collection('notifications')
    .doc(uid)
    .collection('userNotifications', ref => ref.orderBy('timestamp', 'desc'));

    return userNotificationsRef.valueChanges();
    
  }
  
}