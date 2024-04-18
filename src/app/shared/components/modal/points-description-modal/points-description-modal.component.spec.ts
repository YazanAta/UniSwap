import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsDescriptionModalComponent } from './points-description-modal.component';

describe('PointsDescriptionModalComponent', () => {
  let component: PointsDescriptionModalComponent;
  let fixture: ComponentFixture<PointsDescriptionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PointsDescriptionModalComponent]
    });
    fixture = TestBed.createComponent(PointsDescriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
