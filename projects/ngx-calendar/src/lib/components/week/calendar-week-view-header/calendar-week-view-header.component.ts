import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarEvent, WeekDay } from '../../../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'calendar-week-view-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './calendar-week-view-header.component.html',
  styleUrl: './calendar-week-view-header.component.sass'
})
export class CalendarWeekViewHeaderComponent {
  @Input() days: WeekDay[] = []

  @Output() dayHeaderClicked = new EventEmitter<{ day: WeekDay; sourceEvent: MouseEvent; }>()
  @Output() eventDropped = new EventEmitter<{ event: CalendarEvent; newStart: Date; }>();
  @Output() dragEnter = new EventEmitter<{ date: Date }>();

  trackByWeekDayHeaderDate = (index: number, day: WeekDay) => day.date
}
