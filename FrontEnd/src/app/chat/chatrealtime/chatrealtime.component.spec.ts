import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatrealtimeComponent } from './chatrealtime.component';

describe('ChatrealtimeComponent', () => {
  let component: ChatrealtimeComponent;
  let fixture: ComponentFixture<ChatrealtimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatrealtimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatrealtimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
