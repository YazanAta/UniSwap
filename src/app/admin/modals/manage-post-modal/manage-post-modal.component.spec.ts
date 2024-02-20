import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePostModalComponent } from './manage-post-modal.component';

describe('ManagePostModalComponent', () => {
  let component: ManagePostModalComponent;
  let fixture: ComponentFixture<ManagePostModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePostModalComponent]
    });
    fixture = TestBed.createComponent(ManagePostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
