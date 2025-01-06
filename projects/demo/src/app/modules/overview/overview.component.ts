import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CalendarWeekViewComponent } from '../../../../../ngx-calendar/src/lib/components/week/calendar-week-view/calendar-week-view.component';
import { CalendarDayViewComponent, CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from '../../../../../ngx-calendar/src/public-api';
import { isSameDay } from '../../../../../ngx-calendar/src/lib/utils/myutils';
import { Subject } from 'rxjs';

export const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#0f3a58',
    secondary: '#16537e',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  }
}

@Component({
  selector: 'overview',
  standalone: true,
  imports: [
    CalendarDayViewComponent,
    CalendarWeekViewComponent,
    CommonModule
    // RouterOutlet
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.sass'
})
export class OverviewComponent {
  view: CalendarView = CalendarView.Week

  viewDate: Date = new Date()
  
  events: CalendarEvent[] = [
    {
      start: new Date("2025-01-02T23:00:00.000Z"),
      end: new Date("2025-01-04T11:35:57.828Z"),
      title: "A 3 day event",
      color: colors.blue,
      actions: [],
      allDay: true,
      resizable: {
          beforeStart: true,
          afterEnd: true
      },
      draggable: true
    },
    {
      title: 'An all day event',
      color: colors.blue,
      start: new Date(),
      allDay: true,
    },
    {
      title: 'A non all day event',
      color: colors.blue,
      start: new Date(),
    },
    { start: new Date("2025-01-08T08:00:00.000Z"), end: new Date("2025-01-08T13:00:00.000Z"),
      title: "A draggable and resizable event2",
      color: colors.blue,
      actions: [],
      resizable: {
          beforeStart: true,
          afterEnd: true
      },
      draggable: true
    }
  ];

  refresh = new Subject<void>()

  validateEventTimesChanged = (
    { event, newStart, newEnd, allDay }: CalendarEventTimesChangedEvent,
    addCssClass = true
  ) => {
    if (event.allDay) {
      return true;
    }

    delete event.cssClass;
    // don't allow dragging or resizing events to different days
    const sameDay = isSameDay(newStart, newEnd!);

    if (!sameDay) {
      return false;
    }

    // don't allow dragging events to the same times as other events
    const overlappingEvent = this.events.find((otherEvent) => {
      return (otherEvent !== event && !otherEvent.allDay && ((otherEvent.start < newStart && newStart < otherEvent.end!) || (otherEvent.start < newEnd! && newStart < otherEvent.end!))
      );
    });

    if (overlappingEvent) {
      if (addCssClass) {
        event.cssClass = 'invalid-position';
      } else {
        return false;
      }
    }

    return true;
  };
  
  eventTimesChanged(
    eventTimesChangedEvent: CalendarEventTimesChangedEvent
  ): void {
    delete eventTimesChangedEvent.event.cssClass;
    if (this.validateEventTimesChanged(eventTimesChangedEvent, false)) {
      const { event, newStart, newEnd } = eventTimesChangedEvent;
      event.start = newStart;
      event.end = newEnd;
      this.refresh.next();
    }
  }
}
