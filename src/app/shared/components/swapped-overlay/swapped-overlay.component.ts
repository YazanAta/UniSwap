import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-swapped-overlay',
  templateUrl: './swapped-overlay.component.html',
  styleUrls: ['./swapped-overlay.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate('500ms ease-in-out')),
    ]),
  ],
})
export class SwappedOverlayComponent implements OnDestroy {
  showOverlay: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  showOverlayOnEvent() {
    this.showOverlay = true;
  }

  onAnimationEnd() {
    this.showOverlay = false;
  }

  ngOnDestroy() {
    console.log('Component destroyed');
    // Clean up resources, subscriptions, etc.
  }

  destroyComponent() {
    // Mark the component for destruction
    this.cdr.detectChanges();
  }
}
