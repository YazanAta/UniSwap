import { Component, Input, HostListener, ViewChild } from '@angular/core';
import { NotificationsModalComponent } from '../components/modal/notifications-modal/notifications-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  
  @Input() class: string;
  @Input() themeLogo: string = 'assets/logo.png'; // Default Logo
  @Input() sticky: boolean = false; // Default false

  showNotification: boolean = false;
  toggleNotification() {
    this.showNotification = !this.showNotification;
  }

  public stick: boolean = false;
  isUser: Boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      if(user){
        this.isUser = true
      }else{
        this.isUser = false
      }
    })
  }

  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  	if (number >= 150 && window.innerWidth > 400) { 
  	  this.stick = true;
  	} else {
  	  this.stick = false;
  	}
  }


  

}
