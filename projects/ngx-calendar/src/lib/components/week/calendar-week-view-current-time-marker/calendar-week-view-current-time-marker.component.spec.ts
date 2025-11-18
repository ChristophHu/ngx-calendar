import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarWeekViewCurrentTimeMarkerComponent } from './calendar-week-view-current-time-marker.component';

describe('CalendarWeekViewCurrentTimeMarkerComponent', () => {
  let component: CalendarWeekViewCurrentTimeMarkerComponent;
  let fixture: ComponentFixture<CalendarWeekViewCurrentTimeMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarWeekViewCurrentTimeMarkerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarWeekViewCurrentTimeMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
