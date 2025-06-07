import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceuserComponent } from './interfaceuser.component';

describe('InterfaceuserComponent', () => {
  let component: InterfaceuserComponent;
  let fixture: ComponentFixture<InterfaceuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterfaceuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterfaceuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
