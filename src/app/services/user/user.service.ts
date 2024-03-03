import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { Observable, lastValueFrom } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';
import { increment } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private fs: AngularFirestore, private authService: AuthService) { }

  getUserInfoById(id: string): Observable<User | null> {
    return this.fs.doc(`users/${id}`).valueChanges({ idField: 'uid' });
  }
  

  async decrementPoints(id: string) {
    try {
      // Fetch the document and await the result
      const docSnapshot = await lastValueFrom(this.fs.doc(`users/${id}`).get());
  
      if (!docSnapshot.exists) {
        // Handle the case where the document doesn't exist
        throw new Error("Document not found");
      }
  
      // Extract the points value and handle missing property
      const docData = docSnapshot.data() as User;
      const currentPoints = docData.points || 0;
  
      // Decrement the points
      const newPoints = currentPoints - 1;
  
      // Update the document with the new value
      await this.fs.doc(`users/${id}`).update({ points: newPoints });
    } catch (error) {
      // Handle errors appropriately
      console.error("Error decrementing points:", error);
    }
  }

  async incrementPoints(id: string) {
    try {
      // Fetch the document and await the result
      const docSnapshot = await lastValueFrom(this.fs.doc(`users/${id}`).get());
  
      if (!docSnapshot.exists) {
        // Handle the case where the document doesn't exist
        throw new Error("Document not found");
      }
  
      // Extract the points value and handle missing property
      const docData = docSnapshot.data() as User;
      const currentPoints = docData.points || 0;
  
      // Increment the points
      const newPoints = currentPoints + 1;
  
      // Update the document with the new value
      await this.fs.doc(`users/${id}`).update({ points: newPoints });
    } catch (error) {
      // Handle errors appropriately
      console.error("Error incrementing points:", error);
    }
  }
  
  

}
