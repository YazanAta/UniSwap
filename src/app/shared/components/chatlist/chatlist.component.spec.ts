import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListComponent } from './chatlist.component';

describe('ChatlistComponent', () => {
  let component: ChatListComponent;
  let fixture: ComponentFixture<ChatListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatListComponent]
    });
    fixture = TestBed.createComponent(ChatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
