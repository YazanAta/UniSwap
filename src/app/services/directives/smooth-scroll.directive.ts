import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSmoothScroll]'
})
export class SmoothScrollDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click') onClick() {
    const target = this.el.nativeElement.getAttribute('href');
    if (target) {
      const targetElement = document.querySelector(target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
