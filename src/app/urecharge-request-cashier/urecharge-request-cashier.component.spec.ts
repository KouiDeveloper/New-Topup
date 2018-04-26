import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrechargeRequestCashierComponent } from './urecharge-request-cashier.component';

describe('UrechargeRequestCashierComponent', () => {
  let component: UrechargeRequestCashierComponent;
  let fixture: ComponentFixture<UrechargeRequestCashierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrechargeRequestCashierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrechargeRequestCashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
