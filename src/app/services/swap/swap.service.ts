import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { NotificationsService } from '../notifications/notifications.service';
import { PostsService } from '../posts/posts.service';
import { UserService } from '../user/user.service';
import { Observable, lastValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwapService {

  constructor(
    private firestore: AngularFirestore,
    private notification: NotificationsService,
    private postsService: PostsService,
    private userService: UserService
  ) { }

  // Get the list of approved posts for a user
  getSwapList(uid: string): Observable<Post[]> {
      return this.firestore.collection(`posts`, ref => ref
      .where('ownerId', '==', uid)
      .where('state', '==', "approved"))
      .valueChanges( {idField: 'id'} );
  }

  // Get the swap requests for a user
  getRequests(uid: string): Observable<Post[]>{
    return this.firestore.collection(`users/${uid}/requests`).valueChanges( {idField: 'requestId'} )
  }


  // Initiate a swap request
  async swapRequest(otherParticipantId: string, username: string, post: Post): Promise<void>{

    // Check if the user has enough points to initiate the swap for a free post
    if(post.pricing == 'free'){
      const user = await lastValueFrom(this.userService.getUserInfoById(otherParticipantId).pipe(take(1)));
      if (!user || user.points <= 0) {
        // Handle the case where the user doesn't have enough points
        throw('User does not have enough points to initiate the swap.');
      }
    }


    // Change Post State To Waiting
    await this.postsService.updateState(post.id, "waiting");

    // Add post data to requests collection with the requested from name to display on the UI
    await this.firestore.collection(`users/${otherParticipantId}/requests`).add({
      ...post,
      requestFrom: username
    })

    // Push Notification To Other User
    await this.notification.pushNotification(otherParticipantId, `Swapping Request, ${post.title} From ${username}`, "swap");
  
  }

  // Accept a swap request
  async acceptSwap(post: Post, uid: string) : Promise<void>{
    
    // Change Post State To "Swapped"
    await this.postsService.updateState(post.id, "swapped");

    // If type of post is free -> decreament point by 1
    if(post.pricing == 'free'){
      await this.userService.decrementPoints(uid)
    }

    // Add "SwappedTo" field to the post
    await this.firestore.doc(`posts/${post.id}`).set({
      swappedTo: uid
    }, {merge: true});

    // Delete request
    await this.firestore.doc(`users/${uid}/requests/${post.requestId}`).delete();

    // Push Notification To Other User
    await this.notification.pushNotification(post.ownerId, `Congratulations, ${post.title} successfully swapped`, "swap");

  }

  // Reject a swap request
  async rejectSwap(post: Post, uid: string){

    // Change Post State To "approved"
    await this.postsService.updateState(post.id, "approved");

    // Delete request
    await this.firestore.doc(`users/${uid}/requests/${post.requestId}`).delete();

    // Push Notification To Other User
    return this.notification.pushNotification(post.ownerId, `Swapping Reject, ${post.title}`, "swap");
  }
}
