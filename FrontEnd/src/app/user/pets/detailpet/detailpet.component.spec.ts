import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailpetComponent } from './detailpet.component';

describe('DetailpetComponent', () => {
  let component: DetailpetComponent;
  let fixture: ComponentFixture<DetailpetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailpetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailpetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
