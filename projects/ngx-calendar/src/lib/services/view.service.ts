import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarEvent, DayViewScheduler, GetWeekViewArgs, GetWeekViewArgsWithUsers, WeekDay, WeekView } from '../models/models';
import { addDate, getDayObject, getWeekViewPeriod } from '../utils/myutils';
import { DefaultLibConfiguration, LibConfigurationProvider, LibToConfigureConfiguration } from '../config/calendar-config';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  config: LibToConfigureConfiguration = {}

  private _days = new BehaviorSubject<WeekDay[]>([])
  public days$ = this._days.asObservable()

  private _view = new BehaviorSubject<WeekView | undefined>(undefined)
  public view$ = this._view.asObservable()

  private _events = new BehaviorSubject<CalendarEvent[]>([])
  public events$ = this._events.asObservable()
  
  constructor(public configurationProvider: LibConfigurationProvider, private defaultLibConfiguration: DefaultLibConfiguration) {
    this.config = Object.assign(defaultLibConfiguration.config, configurationProvider.config)
  }

  createDays(viewDate: Date, viewStart?: Date, viewEnd?: Date) {
    let days: any[] = []
    if (viewStart && viewEnd) {
      while (viewStart <= viewEnd) {
        const dayObj = getDayObject(viewStart, this.config.weekStartsOn!, this.config.excludeDays!, this.config.weekendDays!)
        days.push(dayObj)
        viewStart = addDate(viewStart, 1)
      }
      this._days.next(days)
    }
  }

  createWeekView(viewDate: Date) {
    this._view.next(this.prepareWeekView(viewDate, this._events.value!))
  }

  prepareWeekView(viewDate: any, events: CalendarEvent[]) {
    return this.getWeekView({
      events,
      viewDate,
      users: [],
      weekStartsOn: this.config.weekStartsOn!,
      excluded: this.config.excludeDays!,
      precision: this.config.precision!,
      hourSegments: this.config.hourSegments!,
      hourDuration: this.config.hourDuration!,
      dayStart: {
        hour: this.config.dayStartHour!,
        minute: this.config.dayStartMinute!,
      },
      dayEnd: {
        hour: this.config.dayEndHour!,
        minute: this.config.dayEndMinute!,
      },
      segmentHeight: this.config.hourSegmentHeight!,
      weekendDays: this.config.weekendDays!,
      minimumEventHeight: this.config.minimumEventHeight!,
      ...getWeekViewPeriod(
        viewDate,
        this.config.weekStartsOn!,
        this.config.excludeDays!,
        this.config.daysInWeek!
      )
    })
  }

  getWeekView(args: GetWeekViewArgsWithUsers): DayViewScheduler {
    // const { period } = super.getWeekView(args);
    const period = { start: args.viewStart ? args.viewStart : args.viewDate, end: args.viewEnd ? args.viewEnd : args.viewDate, events: args.events ? args.events : [] }
    const users = { id: 1, name: 'User 1', colors: null }
    const view: DayViewScheduler = {
      period,
      allDayEventRows: [],
      hourColumns: [],
      users: [...args.users],
    }

    // export interface CalendarEvent<MetaType = any> {
    //     id?: string | number;
    //     start: Date;
    //     end?: Date;
    //     title: string;
    //     color?: EventColor;
    //     actions?: EventAction[];
    //     allDay?: boolean;
    //     cssClass?: string;
    //     resizable?: {
    //         beforeStart?: boolean;
    //         afterEnd?: boolean;
    //     };
    //     draggable?: boolean;
    //     meta?: MetaType;
    // }
    let testEvent: CalendarEvent = {
      start: new Date("2024-12-15T23:00:00.000Z"),
      end: new Date("2024-12-18T12:03:23.019Z"),
      title: "A 3 day event",
      color: {
        primary: "#ad2121",
        secondary: "#FAE3E3"
      },
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
    let allDayEventRow = { event: testEvent, offset: 0, span: 1, startsBeforeWeek: true, endsAfterWeek: true }

    view.allDayEventRows = [{ id: '1', row: [allDayEventRow] }]
  


    // view.users.forEach((user, columnIndex) => {
    //   const events = args.events!.filter(
    //     (event: any) => event.meta.user.id === user.id
    //   );
    //   const columnView = super.getWeekView({
    //     ...args,
    //     events,
    //   });
    //   view.hourColumns.push(columnView.hourColumns[0]);
    //   columnView.allDayEventRows.forEach(({ row }: any, rowIndex: any) => {
    //     view.allDayEventRows[rowIndex] = view.allDayEventRows[rowIndex] || {
    //       row: [],
    //     };
    //     view.allDayEventRows[rowIndex].row.push({
    //       ...row[0],
    //       offset: columnIndex,
    //       span: 1,
    //     });
    //   });
    // });

    return view
  }
}
