import { Component, Input } from '@angular/core';
import { WeekViewHourSegment } from '../../../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'calendar-week-view-hour-segment',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './calendar-week-view-hour-segment.component.html',
  styleUrl: './calendar-week-view-hour-segment.component.sass'
})
export class CalendarWeekViewHourSegmentComponent {
  @Input() segment!: WeekViewHourSegment
  @Input() segmentHeight!: number
  @Input() isTimeLabel!: boolean
  @Input() daysInWeek!: number
}
