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
  @Input() themeLogo: string = 'assets/images/logos/logo.png';

  /** Flag indicating whether a user is authenticated. */
  public isUser: boolean = false;

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
    this.subscriptions.add(
      this.authService.user$
        .subscribe(user => {
          this.isUser = !!user; // Set isUser based on user existence
        })
    );
  }

  /**
   * Lifecycle hook that runs when the component is being destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Scrolls to the 'about' section on the page.
   * If not on the home page, navigates to the home page first and then scrolls to 'about' section.
   */
  scrollToAboutSection(): void {
    if (this.router.url === '') {
      // Already on home page, scroll to 'about' section
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page and then scroll to 'about' section
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const aboutSection = document.getElementById('about');
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 1000); // Adjust timing as needed
      });
    }
  }
}
