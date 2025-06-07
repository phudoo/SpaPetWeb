import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListmypetsComponent } from './listmypets.component';

describe('ListmypetsComponent', () => {
  let component: ListmypetsComponent;
  let fixture: ComponentFixture<ListmypetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListmypetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListmypetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
