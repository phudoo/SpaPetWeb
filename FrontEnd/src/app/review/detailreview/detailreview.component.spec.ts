import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailreviewComponent } from './detailreview.component';

describe('DetailreviewComponent', () => {
  let component: DetailreviewComponent;
  let fixture: ComponentFixture<DetailreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
