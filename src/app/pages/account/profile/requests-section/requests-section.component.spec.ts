import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsSectionComponent } from './requests-section.component';

describe('RequestsSectionComponent', () => {
  let component: RequestsSectionComponent;
  let fixture: ComponentFixture<RequestsSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestsSectionComponent]
    });
    fixture = TestBed.createComponent(RequestsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
