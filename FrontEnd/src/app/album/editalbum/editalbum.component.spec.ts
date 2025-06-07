import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditalbumComponent } from './editalbum.component';

describe('EditalbumComponent', () => {
  let component: EditalbumComponent;
  let fixture: ComponentFixture<EditalbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditalbumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditalbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
