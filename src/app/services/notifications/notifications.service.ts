import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { Observable, switchMap, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  constructor(private fs: AngularFirestore,private authService: AuthService) { }

  private uid: string = this.authService.uid;

  pushNotification(recieverId: string, message: string, type: string): Promise<void>{
    // Reference to firestore collection and add the message as a document
    const notificationsRef = this.fs.collection('notifications').doc(recieverId).collection('userNotifications');
    
    // Return a Promise that resolves when the notification is successfully added
    return notificationsRef.add({
        message: message,
        timestamp: new Date(),
        type: type, // Include a type to distinguish different types of notifications
    }).then();
  }

  getUserNotifications(): Observable<any[]> {
    
    // Get notifications from the collection by user id, order by time
    const userNotificationsRef: AngularFirestoreCollection<any> = this.fs
    .collection('notifications')
    .doc(this.uid)
    .collection('userNotifications', ref => ref.orderBy('timestamp', 'desc'));

    return userNotificationsRef.valueChanges();
    
  }
  
}