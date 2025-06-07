import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllalbumComponent } from './allalbum.component';

describe('AllalbumComponent', () => {
  let component: AllalbumComponent;
  let fixture: ComponentFixture<AllalbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllalbumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllalbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
