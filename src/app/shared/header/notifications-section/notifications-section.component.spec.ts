import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSectionComponent } from './notifications-section.component';

describe('NotificationsSectionComponent', () => {
  let component: NotificationsSectionComponent;
  let fixture: ComponentFixture<NotificationsSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsSectionComponent]
    });
    fixture = TestBed.createComponent(NotificationsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
