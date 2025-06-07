import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailalbumComponent } from './detailalbum.component';

describe('DetailalbumComponent', () => {
  let component: DetailalbumComponent;
  let fixture: ComponentFixture<DetailalbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailalbumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailalbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
