import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResiterSuccessPageComponent } from './resiter-success-page.component';

describe('ResiterSuccessPageComponent', () => {
  let component: ResiterSuccessPageComponent;
  let fixture: ComponentFixture<ResiterSuccessPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResiterSuccessPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResiterSuccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
