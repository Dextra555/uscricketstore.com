import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummerCampPageComponent } from './summer-camp-page.component';

describe('SummerCampPageComponent', () => {
  let component: SummerCampPageComponent;
  let fixture: ComponentFixture<SummerCampPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummerCampPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SummerCampPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
