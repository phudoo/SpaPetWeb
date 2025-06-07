import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailappointmentComponent } from './detailappointment.component';

describe('DetailappointmentComponent', () => {
  let component: DetailappointmentComponent;
  let fixture: ComponentFixture<DetailappointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailappointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailappointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
