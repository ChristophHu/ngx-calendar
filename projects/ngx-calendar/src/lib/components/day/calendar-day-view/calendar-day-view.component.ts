import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from '../../../models/models';
import { ResizeCursors } from '@christophhu/ngx-resizeable';
import { CalendarWeekViewBeforeRenderEvent, CalendarWeekViewComponent } from '../../week/calendar-week-view/calendar-week-view.component';
import { Subject } from 'rxjs';

export type CalendarDayViewBeforeRenderEvent = CalendarWeekViewBeforeRenderEvent

@Component({
  selector: 'calendar-day-view',
  standalone: true,
  imports: [
    CalendarWeekViewComponent
  ],
  templateUrl: './calendar-day-view.component.html',
  styleUrl: './calendar-day-view.component.sass'
})
export class CalendarDayViewComponent {
  @Input() viewDate: Date = new Date()
  @Input() events: CalendarEvent[] = []
  @Input() hourSegments: number = 2
  @Input() hourSegmentHeight: number = 30
  @Input() hourDuration: number = 60
  @Input() minimumEventHeight: number = 30
  @Input() dayStartHour: number = 0
  @Input() dayStartMinute: number = 0
  @Input() dayEndHour: number = 23
  @Input() dayEndMinute: number = 59
  @Input() refresh!: Subject<any>
  @Input() eventSnapSize!: number

  @Input() snapDraggedEvents: boolean = true

  @Input() validateEventTimesChanged!: (event: CalendarEventTimesChangedEvent) => boolean
  @Input() resizeCursors!: Partial<Pick<ResizeCursors, 'leftOrRight' | 'topOrBottom'>>
  @Output() eventClicked = new EventEmitter<{ event: CalendarEvent; sourceEvent: MouseEvent | KeyboardEvent; }>()
  @Output() hourSegmentClicked = new EventEmitter<{ date: Date; sourceEvent: MouseEvent; }>()
  @Output() eventTimesChanged = new EventEmitter<CalendarEventTimesChangedEvent>()
  @Output() beforeViewRender = new EventEmitter<CalendarDayViewBeforeRenderEvent>()
}
