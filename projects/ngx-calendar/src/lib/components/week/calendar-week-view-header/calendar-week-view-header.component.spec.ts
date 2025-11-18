import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarWeekViewHeaderComponent } from './calendar-week-view-header.component';

describe('CalendarWeekViewHeaderComponent', () => {
  let component: CalendarWeekViewHeaderComponent;
  let fixture: ComponentFixture<CalendarWeekViewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarWeekViewHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarWeekViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
