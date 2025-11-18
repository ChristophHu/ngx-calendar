import { Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { PlacementArray, WeekViewAllDayEvent, WeekViewHourColumn, WeekViewTimeEvent } from '../../../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'calendar-week-view-event',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './calendar-week-view-event.component.html',
  styleUrl: './calendar-week-view-event.component.sass'
})
export class CalendarWeekViewEventComponent {
  @Input() locale!: string
  @Input() weekEvent!: WeekViewAllDayEvent | WeekViewTimeEvent
  @Input() column!: WeekViewHourColumn
  @Input() daysInWeek!: number
  @Output() eventClicked = new EventEmitter<{
    sourceEvent: MouseEvent | KeyboardEvent | any
  }>()

  constructor() {
    console.log('CalendarWeekViewEventComponent', this.weekEvent)
  }
}
