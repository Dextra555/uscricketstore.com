import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookALaneComponent } from './book-a-lane.component';

describe('BookALaneComponent', () => {
  let component: BookALaneComponent;
  let fixture: ComponentFixture<BookALaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookALaneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookALaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
