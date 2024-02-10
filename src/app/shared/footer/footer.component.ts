import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @Input() class: string = 'footer-light' // Default class 
  @Input() themeLogo: string = 'assets/logo2.png' // Default Logo
  @Input() newsletter: boolean = false; // Default True

  public today: number = Date.now();

  constructor() { }

}
