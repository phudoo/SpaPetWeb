import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailcontactComponent } from './detailcontact.component';

describe('DetailcontactComponent', () => {
  let component: DetailcontactComponent;
  let fixture: ComponentFixture<DetailcontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailcontactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
