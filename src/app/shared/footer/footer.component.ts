import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CATEGORIES, Category } from '../interfaces/category.interface';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

/**
 * Angular component representing the footer of the application.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  /** Theme logo path for the footer. Defaults to 'assets/images/logos/logo.png'. */
  @Input() themeLogo: string = 'assets/images/logos/logo2.png';

  /** Flag indicating whether a user is authenticated. */
  public isUserAuthenticated = false;

  /** Array of categories used in the footer. */
  public categories: Category[] = CATEGORIES;

  /** Subscription to manage observable subscriptions for cleanup. */
  private subscriptions = new Subscription();

  /**
   * Constructs a new FooterComponent.
   * @param router The Angular Router service.
   * @param authService The authentication service for user authentication.
   */
  constructor(private router: Router, private authService: AuthService) { }

  /**
   * Lifecycle hook that runs after the component has been initialized.
   * Subscribes to the authService's user observable to determine authentication state.
   */
  ngOnInit(): void {
   this.subscribeToUserAuthentication();
  }

  /**
   * Lifecycle hook that runs when the component is being destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToUserAuthentication(): void {
    this.subscriptions.add(
      this.authService.user$.subscribe(user => {
        this.isUserAuthenticated = !!user; // Update authentication state based on user existence
      })
    );
  }

  /**
   * Scrolls to the 'about' section on the page.
   * If not on the home page, navigates to the home page first and then scrolls to 'about' section.
   */
  scrollToAboutSection(): void {
    if (this.router.url === '') {
      this.scrollToElementById('about');
    } else {
      this.navigateToHomePageAndScrollToAboutSection();
    }
  }

  private scrollToElementById(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private navigateToHomePageAndScrollToAboutSection(): void {
    this.router.navigate(['']).then(() => {
      setTimeout(() => {
        this.scrollToElementById('about');
      }, 1000); // Adjust timing as needed
    });
  }
  
}
