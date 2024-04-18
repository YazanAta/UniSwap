import { Component } from '@angular/core';
import { CATEGORIES, Category } from '../shared/interfaces/category.interface';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public isUser: boolean 
  
  // Categories
  public categories : Category[] = CATEGORIES

  // for unsubscribing
  private destroy$ = new Subject<void>();

  public sliders = [{
    title: 'Unleash the UniSwap Experience!',
    subTitle: 'Give, Swap, Buy',
    image: 'assets/images/slider/slider1.png'
  }, {
    title: 'More Than a Swap, It\'s a Community Sharing Platform',
    subTitle: 'UniSwap',
    image: 'assets/images/slider/slider2.png',
  }];
  
  constructor(
    private authService: AuthService,
    private router: Router) { }

  // Collection banner
  public collections = [{
    image: 'assets/images/collection/collection1.png',
    title: 'Give',
    class: 'p-left'
  }, {
    image: 'assets/images/collection/collection2.png',
    title: 'Exchange',
    class: 'p-right'
  }];

  ngOnInit(): void {
    this.authService.user$.pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        // Handle the error appropriately (e.g., log, display message)
        console.error('Error fetching user:', error);
        // Return a new observable or rethrow the error
        return throwError(error); // Re-throw the error to propagate it
      })
    ).subscribe((user) => {
      if (user) {
        this.isUser = true;
      } else {
        this.isUser = false;
      }
    });
  }

  ngOnDestroy() {
    // Emit a value to signal the destruction of the component
    this.destroy$.next();
    // Complete the subject to release resources
    this.destroy$.complete();
  }

  openPostsPage(category) {
    this.router.navigate(
      ['/pages/posts'],
      { queryParams: { category: category.linkParam } }
    );
  }

}
