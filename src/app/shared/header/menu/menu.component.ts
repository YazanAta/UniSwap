import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CATEGORIES, Category } from 'src/app/shared/interfaces/category.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy{

  public categories: Category[] = CATEGORIES;
  public menuToggle: boolean = false;
  isUser: boolean = false; // Initialized isUser to prevent undefined behavior
  private subscriptions = new Subscription(); // To manage subscriptions for cleanup

  constructor(private router: Router, private authService: AuthService) {
    // Subscribe to router events and filter for NavigationEnd events to reset menuToggle only when navigation actually occurs
    this.subscriptions.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.menuToggle = false;
        }
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to authService user observable to set isUser
    this.subscriptions.add(
      this.authService.user$
      .subscribe(user => {
        this.isUser = !!user; // Simplified truthy/falsy assignment
      })
    );
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  mainMenuToggleFunction(): void {
    this.menuToggle = !this.menuToggle;
  }

  // Click Toggle menu (Mobile)
  active: boolean = false;
  toggleNavActive() {
    this.active = !this.active;
  }

  async logout() {
    try {
      await this.authService.logout();
      await this.router.navigate(['/']);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

}
