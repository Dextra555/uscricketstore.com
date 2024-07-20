import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookLaneComponent } from './book-lane.component';

describe('BookLaneComponent', () => {
  let component: BookLaneComponent;
  let fixture: ComponentFixture<BookLaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookLaneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookLaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
