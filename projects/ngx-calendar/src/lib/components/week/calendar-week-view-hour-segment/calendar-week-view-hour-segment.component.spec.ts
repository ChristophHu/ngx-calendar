import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarWeekViewHourSegmentComponent } from './calendar-week-view-hour-segment.component';

describe('CalendarWeekViewHourSegmentComponent', () => {
  let component: CalendarWeekViewHourSegmentComponent;
  let fixture: ComponentFixture<CalendarWeekViewHourSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarWeekViewHourSegmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarWeekViewHourSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
