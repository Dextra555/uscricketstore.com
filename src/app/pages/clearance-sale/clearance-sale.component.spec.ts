import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearanceSaleComponent } from './clearance-sale.component';

describe('ClearanceSaleComponent', () => {
  let component: ClearanceSaleComponent;
  let fixture: ComponentFixture<ClearanceSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearanceSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearanceSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
