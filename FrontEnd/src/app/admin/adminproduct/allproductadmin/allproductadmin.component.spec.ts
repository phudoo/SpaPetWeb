import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllproductadminComponent } from './allproductadmin.component';

describe('AllproductadminComponent', () => {
  let component: AllproductadminComponent;
  let fixture: ComponentFixture<AllproductadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllproductadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllproductadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
