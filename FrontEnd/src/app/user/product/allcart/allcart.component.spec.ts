import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllcartComponent } from './allcart.component';

describe('AllcartComponent', () => {
  let component: AllcartComponent;
  let fixture: ComponentFixture<AllcartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllcartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
