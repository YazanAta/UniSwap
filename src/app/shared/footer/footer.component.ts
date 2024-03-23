import { Component, Input, OnInit } from '@angular/core';
import { CATEGORIES, Category } from '../interfaces/category.interface';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit{

  @Input() themeLogo: string = 'assets/logo.png' // Default Logo
  isUser: boolean = false; // Initialized isUser to prevent undefined behavior
  private subscriptions = new Subscription(); // To manage subscriptions for cleanup

  public categories: Category[] = CATEGORIES;

  constructor(private router: Router,  private authService: AuthService) { }

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


  scrollToAboutSection() {
    // Check if already on home page
    if (this.router.url === '') {
      // Scroll to about section
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page
      this.router.navigate(['/']).then(() => {
        // Scroll to about section after navigation
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
