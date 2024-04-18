import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CATEGORIES, Category } from 'src/app/shared/interfaces/category.interface';
import { Subscription, filter } from 'rxjs';

/**
 * Angular component representing the application menu.
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  /** Array of categories used in the menu. */
  public categories: Category[] = CATEGORIES;

  /** Flag to toggle the visibility of the main menu. */
  public menuToggle: boolean = false;

  /** Flag indicating whether a user is authenticated. */
  isUserAuthenticated = false; // Flag indicating whether a user is authenticated

  /** Subscription object to manage subscriptions for cleanup. */
  private subscriptions = new Subscription();

  /** Flag to toggle the active state of the mobile navigation. */
  active: boolean = false;

  /**
   * Constructs a new MenuComponent.
   * @param router The Angular router service.
   * @param authService The authentication service.
   */
  constructor(private router: Router, private authService: AuthService) {}

  /**
   * Subscribes to authentication changes to update `isUserAuthenticated` flag.
   */
  private subscribeToAuthChanges(): void {
    this.subscriptions.add(
      this.authService.user$.subscribe(user => {
        this.isUserAuthenticated = !!user;
      })
    );
  }

  /**
   * Subscribes to router events to reset `menuToggle` on NavigationEnd events.
   */
  private subscribeToRouterEvents(): void {
    this.subscriptions.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.menuToggle = false; // Reset menuToggle on NavigationEnd events
        })
    );
  }

  /**
   * Initializes the component by subscribing to authentication changes and router events.
   */
  ngOnInit(): void {
    this.subscribeToAuthChanges();
    this.subscribeToRouterEvents();
  }

  /**
   * Cleans up subscriptions when the component is destroyed to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Toggles the visibility of the main menu.
   */
  mainMenuToggleFunction(): void {
    this.menuToggle = !this.menuToggle;
  }

  /**
   * Toggles the active state of the mobile navigation.
   */
  toggleNavActive() {
    this.active = !this.active;
  }

  /**
   * Logs out the current user and navigates to the home page.
   */
  async logout() {
    try {
      await this.authService.logout();
      await this.router.navigate(['/']);
    } catch (err) {
      console.error('Logout failed:', err);
    }
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
      }, 100); // Adjust timing as needed
    });
  }
  
}
