import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HometopupComponent } from './hometopup.component';

describe('HometopupComponent', () => {
  let component: HometopupComponent;
  let fixture: ComponentFixture<HometopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HometopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HometopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
