import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostsService } from 'src/app/services/posts/posts.service';
import { AddPostModalComponent } from 'src/app/shared/components/modal/add-post-modal/add-post-modal.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/app/shared/interfaces/post.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy{

   testData: Post[] = [
    {
      "category": "Text Books",
      "subCategory": "Humanitarian Faculties",
      "subSubCategory": "School Of Foreign Languages",
      "title": "Advanced Language Patterns",
      "description": "Exploring complex linguistic structures across languages.",
      "type": "paid",
      "price": "65",
      "createdAt": new Date(),
      "state": "approved",
      "ownerId": "taUw2XSRd2arhb7UJTXTnYojFHN2",
      "image": "https://picsum.photos/200/300?random=73"
    },
    {
      "category": "Text Books",
      "subCategory": "Humanitarian Faculties",
      "subSubCategory": "School Of Archaeology And Tourism",
      "title": "Ancient Civilizations and Their Discoveries",
      "description": "Unveiling the mysteries of ancient societies and their cultures.",
      "type": "free",
      "createdAt": new Date(),
      "state": "approved",
      "ownerId": "taUw2XSRd2arhb7UJTXTnYojFHN2",
      "image": "https://picsum.photos/200/300?random=74"
    },
    {
      "category": "Text Books",
      "subCategory": "Scientific Faculties",
      "subSubCategory": "School Of Agriculture",
      "title": "Future of Sustainable Farming",
      "description": "Innovative techniques for eco-friendly agriculture.",
      "type": "paid",
      "price": "75",
      "createdAt": new Date(),
      "state": "approved",
      "ownerId": "taUw2XSRd2arhb7UJTXTnYojFHN2",
      "image": "https://picsum.photos/200/300?random=75"
    },
    {
      "category": "Text Books",
      "subCategory": "Scientific Faculties",
      "subSubCategory": "King Abdullah II School For Information Technology",
      "title": "Emerging Technologies in IT",
      "description": "A deep dive into blockchain, AI, and IoT.",
      "type": "free",
      "createdAt": new Date(),
      "state": "approved",
      "ownerId": "taUw2XSRd2arhb7UJTXTnYojFHN2",
      "image": "https://picsum.photos/200/300?random=76"
    },
    {
      "category": "Text Books",
      "subCategory": "Medical Faculties",
      "subSubCategory": "School Of Rehabilitation Sciences",
      "title": "Innovations in Rehabilitation Therapy",
      "description": "Cutting-edge practices for physical and occupational therapy.",
      "type": "paid",
      "price": "80",
      "createdAt": new Date(),
      "state": "approved",
      "ownerId": "taUw2XSRd2arhb7UJTXTnYojFHN2",
      "image": "https://picsum.photos/200/300?random=77"
    },
    {
      "category": "Uniforms",
      "subCategory": "Medical Uniforms",
      "title": "Eco-Friendly Scrubs",
      "description": "Sustainable and comfortable scrubs for healthcare workers.",
      "type": "free",
      "createdAt": new Date(),
      "state": "approved",
      "ownerId": "taUw2XSRd2arhb7UJTXTnYojFHN2",
      "image": "https://picsum.photos/200/300?random=78"
    },
    {
      "category": "Uniforms",
      "subCategory": "Art Uniforms",
      "title": "Designer Art Aprons",
      "description": "Stylish aprons for the modern artist.",
      "type": "paid",
      "price": "45",
      "createdAt": new Date(),
      "state": "approved",
      "ownerId": "taUw2XSRd2arhb7UJTXTnYojFHN2",
      "image": "https://picsum.photos/200/300?random=79"
    },
    {
      "category": "Uniforms",
      "subCategory": "Science Uniforms",
      "title": "High-Tech Lab Wear",
      "description": "Lab coats and gear equipped with the latest technology.",
      "type": "free",
      "createdAt": new Date(),
      "state": "approved",
      "ownerId": "taUw2XSRd2arhb7UJTXTnYojFHN2",
      "image": "https://picsum.photos/200/300?random=80"
    },
    {
      "category": "Tools",
      "subCategory": "Medical Tools",
      "title": "Emergency Medical Kit",
      "description": "Comprehensive first aid supplies for urgent healthcare needs.",
      "type": "paid",
      "price": "90",
      "createdAt": new Date(),
      "state": "approved",
      "ownerId": "taUw2XSRd2arhb7UJTXTnYojFHN2",
      "image": "https://picsum.photos/200/300?random=81"
    },
    {
      "category": "Tools",
      "subCategory": "Engineering Tools",
      "title": "Digital Engineering Gadgets",
      "description": "Precision tools for the digital era engineer.",
      "type": "free",
      "createdAt": new Date(),
      "state": "approved",
      "ownerId": "taUw2XSRd2arhb7UJTXTnYojFHN2",
      "image": "https://picsum.photos/200/300?random=82"
    },
    {
      "category": "Tools",
      "subCategory": "Science Tools",
      "title": "Advanced Chemistry Kit",
      "description": "Everything needed for high-level chemistry experiments.",
      "type": "paid",
      "price": "100",
      "createdAt": new Date(),
      "state": "approved",
      "ownerId": "taUw2XSRd2arhb7UJTXTnYojFHN2",
      "image": "https://picsum.photos/200/300?random=83"
    },
    {
      "category": "Tools",
      "subCategory": "Art Tools",
      "title": "Sculpture Tools for Professionals",
      "description": "High-quality tools for sculptors and model makers.",
      "type": "free",
      "createdAt": new Date(),
      "state": "approved",
      "ownerId": "taUw2XSRd2arhb7UJTXTnYojFHN2",
      "image": "https://picsum.photos/200/300?random=84"
    }
  ]
  
  
  
  

  // For displaying user data in the template
  public userData$ : Observable<User | null> = this.authService.user$;

  // user posts
  public posts: any[] = []

  // for unsubscribing
  private destroy$ = new Subject<void>();
  
  constructor(
    private authService: AuthService,
    private postsService: PostsService,
    private modalService: NgbModal, private fs: AngularFirestore) {}


  async ngOnInit() {

    // Get current userId and then and only then get his posts
    const user = await this.authService.getUser();
    this.getUserPosts(user.uid);
        
  }

  // Open add post modal
  public openModal() {
    this.modalService.open(AddPostModalComponent);
  }

  // Get user posts method
  public getUserPosts(uid: string) {
    this.postsService.getUserPosts(uid).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (posts: Array<any>) => {
        this.posts = posts
      },
      error: (err) => {
        console.error(err);
        // Handle the error here
      }
    });
  }

  // unsubscribing
  ngOnDestroy() {
    // Emit a value to signal the destruction of the component
    this.destroy$.next();
    // Complete the subject to release resources
    this.destroy$.complete();
  }

}
