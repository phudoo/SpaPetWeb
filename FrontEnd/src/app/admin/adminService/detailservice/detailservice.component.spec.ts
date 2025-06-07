import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailserviceComponent } from './detailservice.component';

describe('DetailserviceComponent', () => {
  let component: DetailserviceComponent;
  let fixture: ComponentFixture<DetailserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailserviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
