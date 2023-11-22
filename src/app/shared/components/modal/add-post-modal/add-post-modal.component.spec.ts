import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostModalComponent } from './add-post-modal.component';

describe('AddPostModalComponent', () => {
  let component: AddPostModalComponent;
  let fixture: ComponentFixture<AddPostModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPostModalComponent]
    });
    fixture = TestBed.createComponent(AddPostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
