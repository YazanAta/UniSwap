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

  start: any = new Date(2020, 0, 1);
  end: any = new Date()
  randomDate() {
    var date = new Date(+this.start + Math.random() * (this.end - this.start));
    var hour = 0 + Math.random() * (24 - 0) | 0;
    date.setHours(hour);
    return date;
  }
  items: any[] = [
    {
      "title": "Introduction to Machine Learning",
      "condition": "new",
      "createdAt": "2024-03-14T10:20:39.000Z",
      "description": "A comprehensive introduction to the concepts and algorithms of machine learning.",
      "image": "https://picsum.photos/200/300?random=31",
      "ownerId": "zIYoHoKCyFdR22cacnSPGfQsOlo2",
      "pricing": "paid",
      "price": 90,
      "state": "approved",
      "category": "Text Books",
      "subCategory": "Scientific faculties",
      "subSubCategory": "King Abdullah II School for Information Technology"
    },
    {
      "title": "Surgical Instruments Set",
      "condition": "good condition",
      "createdAt": "2024-03-17T16:05:39.000Z",
      "description": "Complete set of surgical instruments for medical students and professionals.",
      "image": "https://picsum.photos/200/300?random=32",
      "ownerId": "zIYoHoKCyFdR22cacnSPGfQsOlo2",
      "pricing": "free",
      "state": "approved",
      "category": "Tools",
      "subCategory": "Medical Tools"
    },
    {
      "title": "Statistical Analysis with R",
      "condition": "new",
      "createdAt": "2024-03-19T12:40:39.000Z",
      "description": "Understanding data analysis and statistical computing using R.",
      "image": "https://picsum.photos/200/300?random=33",
      "ownerId": "zIYoHoKCyFdR22cacnSPGfQsOlo2",
      "pricing": "paid",
      "price": 50,
      "state": "approved",
      "category": "Text Books",
      "subCategory": "Scientific faculties",
      "subSubCategory": "School of Science"
    },
    {
      "title": "Watercolor Painting Set",
      "condition": "fair condition",
      "createdAt": "2024-03-22T09:15:39.000Z",
      "description": "High-quality watercolor paints, brushes, and paper for artists of all levels.",
      "image": "https://picsum.photos/200/300?random=34",
      "ownerId": "zIYoHoKCyFdR22cacnSPGfQsOlo2",
      "pricing": "free",
      "state": "approved",
      "category": "Tools",
      "subCategory": "Art Tools"
    },
    {
      "title": "Theories of Personality",
      "condition": "new",
      "createdAt": "2024-03-18T13:50:39.000Z",
      "description": "A deep dive into the major theories of personality in psychology.",
      "image": "https://picsum.photos/200/300?random=35",
      "ownerId": "zIYoHoKCyFdR22cacnSPGfQsOlo2",
      "pricing": "paid",
      "price": 65,
      "state": "approved",
      "category": "Text Books",
      "subCategory": "Humanitarian faculties",
      "subSubCategory": "School of Educational Sciences"
    },
    {
      "title": "Electric Circuit Analysis Kit",
      "condition": "good condition",
      "createdAt": "2024-03-21T11:35:39.000Z",
      "description": "Kit contains all essential tools for electric circuit analysis.",
      "image": "https://picsum.photos/200/300?random=36",
      "ownerId": "zIYoHoKCyFdR22cacnSPGfQsOlo2",
      "pricing": "free",
      "state": "approved",
      "category": "Tools",
      "subCategory": "Electronic Tools"
    },
    {
      "title": "Contemporary Marketing Strategies",
      "condition": "new",
      "createdAt": "2024-03-20T08:20:39.000Z",
      "description": "Exploring modern marketing strategies and digital marketing trends.",
      "image": "https://picsum.photos/200/300?random=37",
      "ownerId": "zIYoHoKCyFdR22cacnSPGfQsOlo2",
      "pricing": "paid",
      "price": 75,
      "state": "approved",
      "category": "Text Books",
      "subCategory": "Humanitarian faculties",
      "subSubCategory": "School of Business"
    },
    {
      "title": "Basic Carpentry Tools Set",
      "condition": "new",
      "createdAt": "2024-03-23T19:45:39.000Z",
      "description": "Essential carpentry tools for beginners and professionals.",
      "image": "https://picsum.photos/200/300?random=38",
      "ownerId": "zIYoHoKCyFdR22cacnSPGfQsOlo2",
      "pricing": "free",
      "state": "approved",
      "category": "Tools",
      "subCategory": "Engineering Tools"
    },
    {
      "title": "Advanced Biochemistry",
      "condition": "new",
      "createdAt": "2024-03-15T06:55:39.000Z",
      "description": "Covering advanced topics in biochemistry for in-depth study.",
      "image": "https://picsum.photos/200/300?random=39",
      "ownerId": "zIYoHoKCyFdR22cacnSPGfQsOlo2",
      "pricing": "paid",
      "price": 85,
      "state": "approved",
      "category": "Text Books",
      "subCategory": "Medical faculties",
      "subSubCategory": "School of Pharmacy"
    },
    {
      "title": "World History Overview",
      "condition": "good condition",
      "createdAt": "2024-03-16T12:10:39.000Z",
      "description": "A comprehensive overview of world history from ancient times to the present.",
      "image": "https://picsum.photos/200/300?random=40",
      "ownerId": "zIYoHoKCyFdR22cacnSPGfQsOlo2",
      "pricing": "free",
      "state": "approved",
      "category": "Text Books",
      "subCategory": "Humanitarian faculties",
      "subSubCategory": "School of International Studies"
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
        
    //this.items.forEach((data) => {
    //  this.fs.collection('posts').add({
    //    ...data
    //  }).then(() => console.log("Added"))
    //})
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
