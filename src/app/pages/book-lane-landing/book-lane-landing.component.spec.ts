import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookLaneLandingComponent } from './book-lane-landing.component';

describe('BookLaneLandingComponent', () => {
  let component: BookLaneLandingComponent;
  let fixture: ComponentFixture<BookLaneLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookLaneLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookLaneLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
