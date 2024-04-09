import { Component, HostListener } from '@angular/core';
import { ViewportScroller } from '@angular/common';

/**
 * Angular component that implements a "tap-to-top" behavior.
 */
@Component({
  selector: 'app-tap-to-top',
  templateUrl: './tap-to-top.component.html',
  styleUrls: ['./tap-to-top.component.scss']
})
export class TapToTopComponent {
  
  /** Indicates whether to show the "tap-to-top" button. */
  public show: boolean = false;

  /**
   * Constructor for TapToTopComponent.
   * @param viewScroller The ViewportScroller service for scrolling functionality.
   */
  constructor(private viewScroller: ViewportScroller) { }

  /**
   * Host listener for the window scroll event.
   * Toggles the visibility of the "tap-to-top" button based on the scroll position.
   */
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > 600) { 
      this.show = true;
    } else {
      this.show = false;
    }
  }

  /**
   * Scrolls the viewport to the top of the page when the "tap-to-top" button is clicked.
   */
  tapToTop() {
    this.viewScroller.scrollToPosition([0, 0]);
  }

}
