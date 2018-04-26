import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbalanceComponent } from './ubalance.component';

describe('UbalanceComponent', () => {
  let component: UbalanceComponent;
  let fixture: ComponentFixture<UbalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
