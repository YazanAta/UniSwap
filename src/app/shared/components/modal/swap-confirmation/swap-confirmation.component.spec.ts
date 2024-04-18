import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapConfirmationComponent } from './swap-confirmation.component';

describe('SwapConfirmationComponent', () => {
  let component: SwapConfirmationComponent;
  let fixture: ComponentFixture<SwapConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwapConfirmationComponent]
    });
    fixture = TestBed.createComponent(SwapConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
