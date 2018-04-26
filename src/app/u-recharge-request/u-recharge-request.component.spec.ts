import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { URechargeRequestComponent } from './u-recharge-request.component';

describe('URechargeRequestComponent', () => {
  let component: URechargeRequestComponent;
  let fixture: ComponentFixture<URechargeRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ URechargeRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(URechargeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
