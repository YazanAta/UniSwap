import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public menuItems: Menu[];
  isUser: boolean 

  constructor(private router: Router, public navServices: NavService, private as: AuthService) {
    this.navServices.items.subscribe(menuItems => this.menuItems = menuItems );
    this.router.events.subscribe((event) => {
      this.navServices.mainMenuToggle = false;
    });
  }

  ngOnInit(): void {
    this.as.user.subscribe(user => {
      if (user) {
        this.isUser = true
        this.as.userId = user.uid         
      }
      else {
        this.isUser = false
        this.as.userId = ''
      }
    })
  }

  mainMenuToggle(): void {
    this.navServices.mainMenuToggle = !this.navServices.mainMenuToggle;
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
