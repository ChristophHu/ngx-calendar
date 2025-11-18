import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarWeekViewEventComponent } from './calendar-week-view-event.component';

describe('CalendarWeekViewEventComponent', () => {
  let component: CalendarWeekViewEventComponent;
  let fixture: ComponentFixture<CalendarWeekViewEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarWeekViewEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarWeekViewEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
