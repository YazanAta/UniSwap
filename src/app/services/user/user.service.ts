import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, lastValueFrom } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private firestore: AngularFirestore) { }

  /**
   * Get user information by ID.
   * @param id - User ID.
   * @returns Observable<User | null> - User information or null if not found.
   */
  getUserInfoById(id: string): Observable<User | null> {
    return this.firestore.doc(`users/${id}`).valueChanges({ idField: 'uid' });
  }
    
  /**
   * Update user points by a specified amount.
   * @param id - User ID.
   * @param pointsDelta - The amount to increment or decrement points.
   * @returns Promise<void> - Promise indicating the completion of the operation.
   * @private
   */
  private async updatePoints(id: string, pointsDelta: number): Promise<void> {
    try {
      // Fetch the document and await the result
      const docSnapshot = await lastValueFrom(this.firestore.doc(`users/${id}`).get());
  
      if (!docSnapshot.exists) {
        // Handle the case where the document doesn't exist
        throw new Error("Document not found");
      }
  
      // Extract the points value and handle missing property
      const docData = docSnapshot.data() as User;
      const currentPoints = docData.points || 0;
  
      // Update the points
      const newPoints = currentPoints + pointsDelta;
  
      // Update the document with the new value
      await this.firestore.doc(`users/${id}`).update({ points: newPoints });
    } catch (error) {
      // Handle errors appropriately
      console.error(`Error updating points (${pointsDelta}):`, error);
    }
  }
  
  /**
   * Decrement user points by 1.
   * @param id - User ID.
   * @returns Promise<void> - Promise indicating the completion of the operation.
   */
  async decrementPoints(id: string): Promise<void> {
    return this.updatePoints(id, -1);
  }

  /**
   * Increment user points by 1.
   * @param id - User ID.
   * @returns Promise<void> - Promise indicating the completion of the operation.
   */
  async incrementPoints(id: string): Promise<void> {
    return this.updatePoints(id, 1);
  }
}
