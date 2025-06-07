import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GioithieuComponent } from './gioithieu.component';

describe('GioithieuComponent', () => {
  let component: GioithieuComponent;
  let fixture: ComponentFixture<GioithieuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GioithieuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GioithieuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
