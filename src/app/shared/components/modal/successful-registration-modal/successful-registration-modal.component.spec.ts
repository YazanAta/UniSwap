import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulRegistrationModalComponent } from './successful-registration-modal.component';

describe('SuccessfulRegistrationModalComponent', () => {
  let component: SuccessfulRegistrationModalComponent;
  let fixture: ComponentFixture<SuccessfulRegistrationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessfulRegistrationModalComponent]
    });
    fixture = TestBed.createComponent(SuccessfulRegistrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
