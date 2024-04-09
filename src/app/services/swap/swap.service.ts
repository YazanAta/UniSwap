import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/app/shared/interfaces/post.interface';
import { NotificationsService } from '../notifications/notifications.service';
import { PostsService } from '../posts/posts.service';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';

/**
 * Service responsible for managing swap-related operations.
 */
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

  /**
   * Retrieves a list of approved posts owned by a user.
   * @param uid The ID of the user whose approved posts are to be retrieved.
   * @returns An Observable emitting an array of approved posts.
   */
  getSwapList(uid: string): Observable<Post[]> {
    return this.firestore.collection<Post>('posts', ref => ref
      .where('ownerId', '==', uid)
      .where('state', '==', 'approved'))
      .valueChanges({ idField: 'id' });
  }

  /**
   * Retrieves swap requests for a user.
   * @param uid The ID of the user whose swap requests are to be retrieved.
   * @returns An Observable emitting an array of swap requests.
   */
  getRequests(uid: string): Observable<Post[]> {
    return this.firestore.collection<Post>(`users/${uid}/requests`).valueChanges({ idField: 'requestId' });
  }

  /**
   * Initiates a swap request between two users.
   * @param otherParticipantId The ID of the participant receiving the swap request.
   * @param user The initiating user.
   * @param post The post object associated with the swap request.
   * @throws Throws an error if the user does not have enough points to initiate the swap for a free post.
   */
  async swapRequest(otherParticipantId: string, user: User, post: Post): Promise<void> {
    if (post.pricing === 'free') {
      if (user.points <= 0) {
        throw new Error("You don't have enough points to initiate the swap.");
      }
    }

    // Change Post State To Waiting
    await this.postsService.updateState(post.id, 'waiting');

    // Add post data to requests collection with the requested from name to display on the UI
    await this.firestore.collection(`users/${otherParticipantId}/requests`).add({
      ...post,
      requestFrom: {
        id: user.uid,
        name: `${user.firstName} ${user.lastName}`,
      }
    });

    // Push Notification To Other User
    await this.notification.pushNotification(otherParticipantId, `Swapping Request: ${post.title} to ${user.firstName}`, 'swap');
  }

  /**
   * Accepts a swap request from another user.
   * @param post The post associated with the swap request.
   */
  async acceptSwap(post: Post): Promise<void> {
    // Delete Post After Swapping
    await this.postsService.deletePost(post);

    // Delete request
    await this.firestore.doc(`users/${post.ownerId}/requests/${post.requestId}`).delete();

    // If the post type is free, decrement the requesting user's points by 1
    if (post.pricing === 'free') {
      await this.userService.decrementPoints(post.requestFrom.id);
    }

    // Push Notification To Other User
    await this.notification.pushNotification(post.requestFrom.id, `Congratulations! ${post.title} successfully swapped.`, 'swap');
  }

  /**
   * Rejects a swap request from another user.
   * @param post The post associated with the swap request.
   * @returns A Promise resolving after the swap rejection process is completed.
   */
  async rejectSwap(post: Post): Promise<void> {
    // Change Post State To "approved"
    await this.postsService.updateState(post.id, 'approved');

    // Delete request
    await this.firestore.doc(`users/${post.ownerId}/requests/${post.requestId}`).delete();

    // Push Notification To Other User
    return this.notification.pushNotification(post.requestFrom.id, `Swapping Rejected: ${post.title}`, 'swap');
  }
}