import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CATEGORIES, Category } from 'src/app/shared/interfaces/category.interface';
import { Subscription } from 'rxjs';

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
  isUser: boolean = false;

  /** Subscription object to manage subscriptions for cleanup. */
  private subscriptions = new Subscription();

  /**
   * Constructs a new MenuComponent.
   * @param router The Angular router service.
   * @param authService The authentication service.
   */
  constructor(private router: Router, private authService: AuthService) {
    // Subscribe to router events to reset menuToggle on NavigationEnd events
    this.subscriptions.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.menuToggle = false;
        }
      })
    );
  }

  /**
   * Initializes the component by subscribing to authentication changes.
   */
  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.user$.subscribe(user => {
        this.isUser = !!user;
      })
    );
  }

  /**
   * Cleans up subscriptions when the component is destroyed.
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
  active: boolean = false;
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
   * Scrolls to the about section on the home page or navigates to the home page and scrolls.
   */
  scrollToAboutSection() {
    if (this.router.url === '') {
      // Scroll to about section if already on home page
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page and then scroll to about section
      this.router.navigate(['']).then(() => {
        setTimeout(() => {
          const aboutSection = document.getElementById('about');
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500); // Adjust timing as needed
      });
    }
  }
}
