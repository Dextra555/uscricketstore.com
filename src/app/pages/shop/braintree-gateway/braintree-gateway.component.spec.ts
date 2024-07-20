import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BraintreeGatewayComponent } from './braintree-gateway.component';

describe('BraintreeGatewayComponent', () => {
  let component: BraintreeGatewayComponent;
  let fixture: ComponentFixture<BraintreeGatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BraintreeGatewayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BraintreeGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
