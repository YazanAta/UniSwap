import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CATEGORIES, Category } from 'src/app/shared/interfaces/category.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public menuItems: Menu[];
  public categories: Category[] = CATEGORIES
  public menuToggle: boolean = false;
  isUser: boolean 
  isVerified: boolean

  constructor(private router: Router, private as: AuthService) {
    this.router.events.subscribe((event) => {
      this.menuToggle = false;
    });
  }

  ngOnInit(): void {
    this.as.user$.subscribe(user => {
      if (user) {
        if(user.emailVerified){
          this.isVerified = true
        }
        this.isUser = true  
      }
      else {
        this.isUser = false
        this.isVerified = false
      }
    })
  }

  mainMenuToggleFunction(): void {
    this.menuToggle = !this.menuToggle;
  }

  // Click Toggle menu (Mobile)
  active: boolean = false
  toggletNavActive() {
    this.active = !this.active;
  }


  logout(){
    this.as.logout().then(() => {
      this.router.navigate(['/'])
    })
  }

}
