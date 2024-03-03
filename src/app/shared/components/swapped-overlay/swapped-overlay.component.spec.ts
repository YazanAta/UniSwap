import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwappedOverlayComponent } from './swapped-overlay.component';

describe('SwappedOverlayComponent', () => {
  let component: SwappedOverlayComponent;
  let fixture: ComponentFixture<SwappedOverlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwappedOverlayComponent]
    });
    fixture = TestBed.createComponent(SwappedOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
