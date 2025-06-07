import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdoctorComponent } from './orderdoctor.component';

describe('OrderdoctorComponent', () => {
  let component: OrderdoctorComponent;
  let fixture: ComponentFixture<OrderdoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderdoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderdoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
