import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { NotificationsService } from '../notifications/notifications.service';
import { PostsService } from '../posts/posts.service';
import { UserService } from '../user/user.service';
import { lastValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwapService {

  constructor(
    private firestore: AngularFirestore,
    private notification: NotificationsService,
    private postsService: PostsService,
    private usersService: UserService
  ) { }


  getSwapList(uid: string) {
      return this.firestore.collection(`posts`, ref => ref
      .where('ownerId', '==', uid)
      .where('state', '==', "approved"))
      .valueChanges( {idField: 'id'} );
  }

  getRequests(uid){
    return this.firestore.collection(`users/${uid}/requests`).valueChanges( {idField: 'requestId'} )
  }


  async swapRequest(otherParticipantId, username, post: Post){

    // Check if the user has enough points to initiate the swap
    if(post.type == 'free'){
      const user = await lastValueFrom(this.usersService.getUserInfoById(otherParticipantId).pipe(take(1)));
      if (!user || user.points <= 0) {
        // Handle the case where the user doesn't have enough points
        console.error('User does not have enough points to initiate the swap.');
        return;
      }
    }


    // Change Post State To Waiting ..
    await this.postsService.changeState(post.id, "waiting");

    // Add post data to requests collection with the requessted from name to display on the 
    await this.firestore.collection(`users/${otherParticipantId}/requests`).add({
      ...post,
      requestFrom: username
    })

    // Push Notification To Other User
    await this.notification.pushNotification(otherParticipantId, `Swapping Request, ${post.title} From ${username}`, "swap");
  
  }

  async acceptSwap(post: Post, uid: string){
    
    // Change Post State To "Swapped"
    await this.postsService.changeState(post.id, "swapped");

    // If type of post is free -> decreament point by 1
    if(post.type == 'free'){

      await this.usersService.decrementPoints(uid)
    }

    // Add "SwappedTo" field to the post
    await this.firestore.doc(`posts/${post.id}`).set({
      swappedTo: uid
    }, {merge: true});

    // delete request
    await this.firestore.doc(`users/${uid}/requests/${post.requestId}`).delete();

    // Push Notification To Other User
    return this.notification.pushNotification(post.ownerId, `Congratulations, ${post.title} successfully swapped`, "swap");

  }

  async rejectSwap(post: Post, uid){

    // Change Post State To "approved"
    await this.postsService.changeState(post.id, "approved");

    // delete request
    await this.firestore.doc(`users/${uid}/requests/${post.requestId}`).delete();

    // Push Notification To Other User
    return this.notification.pushNotification(post.ownerId, `Swapping Reject, ${post.title}`, "swap");
  }
}
