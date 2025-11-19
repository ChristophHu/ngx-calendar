import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarEventTimesChangedEvent, DayViewScheduler, GetWeekViewArgs, WeekView, WeekViewAllDayEvent, WeekViewAllDayEventResize, WeekViewAllDayEventRow, WeekViewHour, WeekViewHourColumn, WeekViewHourSegment, WeekViewTimeEvent } from '../../../models/models';
import { Subject, Subscription } from 'rxjs';
import { ResizeableDirective, ResizeCursors, ResizeEvent, ResizeHandleDirective } from '@christophhu/ngx-resizeable';
import { DragDirective, DragMoveEvent, DropEvent } from '@christophhu/ngx-drag-n-drop';
import { addDate, getDayObject, getHours, getWeekViewPeriod, isSameDay, startOfHour, validateEvents } from '../../../utils/myutils';
import { DefaultLibConfiguration, LibConfigurationProvider, LibToConfigureConfiguration } from '../../../config/calendar-config';
import { CalendarWeekViewHeaderComponent } from '../calendar-week-view-header/calendar-week-view-header.component';
import { CalendarWeekViewHourSegmentComponent } from '../calendar-week-view-hour-segment/calendar-week-view-hour-segment.component';
import { CalendarWeekViewCurrentTimeMarkerComponent } from '../calendar-week-view-current-time-marker/calendar-week-view-current-time-marker.component';
import { CalendarWeekViewEventComponent } from '../calendar-week-view-event/calendar-week-view-event.component';
import { NgxIconsComponent } from '@christophhu/ngx-icons';

export interface CalendarWeekViewBeforeRenderEvent extends WeekView {
  header: WeekDay[];
}
export interface WeekDay {
  date: Date;
  day: number;
  isPast: boolean;
  isToday: boolean;
  isFuture: boolean;
  isWeekend: boolean;
  cssClass?: string;
}

@Component({
  selector: 'calendar-week-view',
  standalone: true,
  imports: [
    CalendarWeekViewCurrentTimeMarkerComponent,
    CalendarWeekViewEventComponent,
    CalendarWeekViewHeaderComponent,
    CalendarWeekViewHourSegmentComponent,
    CommonModule,
    // DragDirective,
    NgxIconsComponent,
    ResizeableDirective,
    ResizeHandleDirective,
  ],
  templateUrl: './calendar-week-view.component.html',
  styleUrl: './calendar-week-view.component.sass'
})
export class CalendarWeekViewComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  @Input() viewDate!: Date
  @Input() events: CalendarEvent[] = []
  @Input() excludeDays: number[] = []
  @Input() refresh: Subject<any> = new Subject()
  
  @Input() weekStartsOn: number = 1

  @Input() precision: 'days' | 'minutes' = 'days'
  @Input() weekendDays: number[] = [0, 6]
  @Input() snapDraggedEvents: boolean = true
  @Input() hourSegments: number = 2
  @Input() hourDuration: number = 60
  @Input() hourSegmentHeight: number = 30
  @Input() minimumEventHeight: number = 30
  @Input() dayStartHour: number = 0
  @Input() dayStartMinute: number = 0
  @Input() dayEndHour: number = 23
  @Input() dayEndMinute: number = 59
  @Input() eventSnapSize: number = 30
  @Input() daysInWeek: number = 7

  @Input() validateEventTimesChanged!: (event: CalendarEventTimesChangedEvent) => boolean
  @Input() resizeCursors: Partial<Pick<ResizeCursors, 'leftOrRight' | 'topOrBottom'>> = {}
  @Output() dayHeaderClicked = new EventEmitter<{ day: WeekDay; sourceEvent: MouseEvent; }>()
  @Output() eventClicked = new EventEmitter<{ event: CalendarEvent; sourceEvent: MouseEvent | KeyboardEvent; }>()
  @Output() eventTimesChanged = new EventEmitter<CalendarEventTimesChangedEvent>()
  @Output() beforeViewRender = new EventEmitter<CalendarWeekViewBeforeRenderEvent>()
  @Output() hourSegmentClicked = new EventEmitter<{ date: Date; sourceEvent: MouseEvent; }>()
  days: WeekDay[] = []
  view!: WeekView
  refreshSubscription: Subscription = new Subscription()
  // allDayEventResizes: Map<WeekViewAllDayEvent, WeekViewAllDayEventResize> = new Map()
  // timeEventResizes: Map<CalendarEvent, ResizeEvent> = new Map()
  // eventDragEnterByType = {
  //   allDay: 0,
  //   time: 0,
  // }
  // dragActive = false
  // dragAlreadyMoved = false
  // validateDrag: ValidateDrag
  // validateResize: (args: any) => boolean
  dayColumnWidth: number = 0
  // calendarId = Symbol('angular calendar week view id')
  // lastDraggedEvent: CalendarEvent
  rtl = false

  
  // private lastDragEnterDate: Date

  config: LibToConfigureConfiguration = {}
  
  constructor(protected cdr: ChangeDetectorRef, protected element: ElementRef<HTMLElement>, public configurationProvider: LibConfigurationProvider, private defaultLibConfiguration: DefaultLibConfiguration) {
    this.config = Object.assign(defaultLibConfiguration.config, configurationProvider.config)
    console.log('viewDate', this.viewDate)
    console.log('events', this.events)
    console.warn('view', this.view)
  }

  ngAfterViewInit(): void {
    this.rtl = typeof window !== 'undefined' && getComputedStyle(this.element.nativeElement).direction === 'rtl'
    this.cdr.detectChanges()
  }
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe()
    }
  }
  ngOnInit(): void {
    if (this.refresh) {
      this.refreshSubscription = this.refresh.subscribe(() => {
        this.refreshAll()
        this.cdr.markForCheck()
      })
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    const refreshHeader = changes['viewDate'] || changes['excludeDays'] || changes['weekendDays'] || changes['daysInWeek'] || changes['weekStartsOn']

    const refreshBody = changes['viewDate'] || changes['dayStartHour'] || changes['dayStartMinute'] || changes['dayEndHour'] || changes['dayEndMinute'] || changes['hourSegments'] || changes['hourDuration'] || changes['weekStartsOn'] || changes['weekendDays'] || changes['excludeDays'] || changes['hourSegmentHeight'] || changes['events'] || changes['daysInWeek'] || changes['minimumEventHeight']

    if (refreshHeader) {
      this.refreshHeader()
    }

    if (changes['events']) {
      validateEvents(this.events)
    }

    if (refreshBody) {
      this.refreshBody()
    }

    if (refreshHeader || refreshBody) {
      this.emitBeforeViewRender()
    }
  }

  // timeEventResizeStarted(eventsContainer: HTMLElement, timeEvent: WeekViewTimeEvent, resizeEvent: ResizeEvent): void {
  //   this.timeEventResizes.set(timeEvent.event, resizeEvent);
  //   this.resizeStarted(eventsContainer, timeEvent);
  // }

  // timeEventResizing(timeEvent: WeekViewTimeEvent, resizeEvent: ResizeEvent) {
  //   this.timeEventResizes.set(timeEvent.event, resizeEvent)
  //   const adjustedEvents = new Map<CalendarEvent, CalendarEvent>()

  //   const tempEvents = [...this.events]

  //   this.timeEventResizes.forEach((lastResizeEvent, event) => {
  //     const newEventDates = this.getTimeEventResizedDates(event, lastResizeEvent)
  //     const adjustedEvent = { ...event, ...newEventDates }
  //     adjustedEvents.set(adjustedEvent, event)
  //     const eventIndex = tempEvents.indexOf(event)
  //     tempEvents[eventIndex] = adjustedEvent
  //   });

  //   this.restoreOriginalEvents(tempEvents, adjustedEvents, true)
  // }

  // timeEventResizeEnded(timeEvent: WeekViewTimeEvent) {
  //   this.view = this.getWeekView(this.events);
  //   const lastResizeEvent = this.timeEventResizes.get(timeEvent.event);
  //   if (lastResizeEvent) {
  //     this.timeEventResizes.delete(timeEvent.event);
  //     const newEventDates = this.getTimeEventResizedDates(timeEvent.event, lastResizeEvent);
  //     this.eventTimesChanged.emit({
  //       newStart: newEventDates.start,
  //       newEnd: newEventDates.end,
  //       event: timeEvent.event,
  //       type: CalendarEventTimesChangedEventType.Resize,
  //     });
  //   }
  // }

  // allDayEventResizeStarted(allDayEventsContainer: HTMLElement, allDayEvent: WeekViewAllDayEvent, resizeEvent: ResizeEvent): void {
  //   this.allDayEventResizes.set(allDayEvent, { originalOffset: allDayEvent.offset, originalSpan: allDayEvent.span,edge: typeof resizeEvent.edges.left !== 'undefined' ? 'left' : 'right' });
  //   this.resizeStarted(allDayEventsContainer, allDayEvent, this.getDayColumnWidth(allDayEventsContainer));
  // }

  // allDayEventResizing(allDayEvent: WeekViewAllDayEvent, resizeEvent: ResizeEvent, dayWidth: number): void {
  //   const currentResize: WeekViewAllDayEventResize = this.allDayEventResizes.get(allDayEvent);

  //   const modifier = this.rtl ? -1 : 1;
  //   if (typeof resizeEvent.edges.left !== 'undefined') {
  //     const diff: number =
  //       Math.round(+resizeEvent.edges.left / dayWidth) * modifier;
  //     allDayEvent.offset = currentResize.originalOffset + diff;
  //     allDayEvent.span = currentResize.originalSpan - diff;
  //   } else if (typeof resizeEvent.edges.right !== 'undefined') {
  //     const diff: number =
  //       Math.round(+resizeEvent.edges.right / dayWidth) * modifier;
  //     allDayEvent.span = currentResize.originalSpan + diff;
  //   }
  // }

  // allDayEventResizeEnded(allDayEvent: WeekViewAllDayEvent): void {
  //   const currentResize: WeekViewAllDayEventResize =
  //     this.allDayEventResizes.get(allDayEvent);

  //   if (currentResize) {
  //     const allDayEventResizingBeforeStart = currentResize.edge === 'left';
  //     let daysDiff: number;
  //     if (allDayEventResizingBeforeStart) {
  //       daysDiff = allDayEvent.offset - currentResize.originalOffset;
  //     } else {
  //       daysDiff = allDayEvent.span - currentResize.originalSpan;
  //     }

  //     allDayEvent.offset = currentResize.originalOffset;
  //     allDayEvent.span = currentResize.originalSpan;

  //     const newDates = this.getAllDayEventResizedDates(allDayEvent.event, daysDiff, allDayEventResizingBeforeStart);

  //     this.eventTimesChanged.emit({ newStart: newDates.start, newEnd: newDates.end, event: allDayEvent.event, type: CalendarEventTimesChangedEventType.Resize });
  //     this.allDayEventResizes.delete(allDayEvent);
  //   }
  // }

  getDayColumnWidth(eventRowContainer: HTMLElement): number {
    return Math.floor(eventRowContainer.offsetWidth / this.days.length)
  }
  getEventRowContainerHeight(eventRowContainer: HTMLElement): number {
    return Math.floor(eventRowContainer.offsetHeight)
  }

  // dateDragEnter(date: Date) {
  //   this.lastDragEnterDate = date;
  // }

  // eventDropped(dropEvent: Pick<DropEvent<{ event?: CalendarEvent; calendarId?: symbol }>, 'dropData'>, date: Date, allDay: boolean): void {
  //   if (shouldFireDroppedEvent(dropEvent, date, allDay, this.calendarId) && this.lastDragEnterDate.getTime() === date.getTime() && (!this.snapDraggedEvents || dropEvent.dropData.event !== this.lastDraggedEvent)) {
  //     this.eventTimesChanged.emit({
  //       type: CalendarEventTimesChangedEventType.Drop,
  //       event: dropEvent.dropData.event,
  //       newStart: date,
  //       allDay,
  //     });
  //   }
  //   this.lastDraggedEvent = null;
  // }

  // dragEnter(type: 'allDay' | 'time') {
  //   this.eventDragEnterByType[type]++;
  // }

  // dragLeave(type: 'allDay' | 'time') {
  //   this.eventDragEnterByType[type]--;
  // }

  // dragStarted(eventsContainerElement: HTMLElement, eventElement: HTMLElement, event: WeekViewTimeEvent | WeekViewAllDayEvent, useY: boolean): void {
  //   this.dayColumnWidth = this.getDayColumnWidth(eventsContainerElement);
  //   const dragHelper: CalendarDragHelper = new CalendarDragHelper(
  //     eventsContainerElement,
  //     eventElement
  //   );
  //   this.validateDrag = ({ x, y, transform }) => {
  //     const isAllowed =
  //       this.allDayEventResizes.size === 0 &&
  //       this.timeEventResizes.size === 0 &&
  //       dragHelper.validateDrag({ x, y, snapDraggedEvents: this.snapDraggedEvents, dragAlreadyMoved: this.dragAlreadyMoved, transform });
  //     if (isAllowed && this.validateEventTimesChanged) {
  //       const newEventTimes = this.getDragMovedEventTimes(event, { x, y }, this.dayColumnWidth, useY);
  //       return this.validateEventTimesChanged({
  //         type: CalendarEventTimesChangedEventType.Drag,
  //         event: event.event,
  //         newStart: newEventTimes.start,
  //         newEnd: newEventTimes.end,
  //       });
  //     }

  //     return isAllowed;
  //   };
  //   this.dragActive = true;
  //   this.dragAlreadyMoved = false;
  //   this.lastDraggedEvent = null;
  //   this.eventDragEnterByType = {
  //     allDay: 0,
  //     time: 0,
  //   };
  //   if (!this.snapDraggedEvents && useY) {
  //     this.view.hourColumns.forEach((column) => {
  //       const linkedEvent = column.events.find(
  //         (columnEvent) => columnEvent.event === event.event && columnEvent !== event
  //       );
  //       // hide any linked events while dragging
  //       if (linkedEvent) {
  //         linkedEvent.width = 0;
  //         linkedEvent.height = 0;
  //       }
  //     });
  //   }
  //   this.cdr.markForCheck();
  // }

  // dragMove(dayEvent: WeekViewTimeEvent, dragEvent: DragMoveEvent) {
  //   const newEventTimes = this.getDragMovedEventTimes(dayEvent, dragEvent, this.dayColumnWidth, true);
  //   const originalEvent = dayEvent.event;
  //   const adjustedEvent = { ...originalEvent, ...newEventTimes };
  //   const tempEvents = this.events.map((event) => {
  //     if (event === originalEvent) {
  //       return adjustedEvent;
  //     }
  //     return event;
  //   });
  //   this.restoreOriginalEvents(tempEvents, new Map([[adjustedEvent, originalEvent]]), this.snapDraggedEvents);
  //   this.dragAlreadyMoved = true;
  // }

  // allDayEventDragMove() {
  //   this.dragAlreadyMoved = true;
  // }

  // dragEnded(weekEvent: WeekViewAllDayEvent | WeekViewTimeEvent, dragEndEvent: DragEndEvent, dayWidth: number,useY = false): void {
  //   this.view = this.getWeekView(this.events);
  //   this.dragActive = false;
  //   this.validateDrag = null;
  //   const { start, end } = this.getDragMovedEventTimes(weekEvent, dragEndEvent, dayWidth, useY);
  //   if ((this.snapDraggedEvents || this.eventDragEnterByType[useY ? 'time' : 'allDay'] > 0) && isDraggedWithinPeriod(start, end, this.view.period)) {
  //     this.lastDraggedEvent = weekEvent.event;
  //     this.eventTimesChanged.emit({
  //       newStart: start,
  //       newEnd: end,
  //       event: weekEvent.event,
  //       type: CalendarEventTimesChangedEventType.Drag,
  //       allDay: !useY,
  //     });
  //   }
  // }

  protected refreshHeader(): void {
    this.days = this.prepareWeekViewHeader(this.viewDate);
    console.log('days', this.days)
  }

  prepareWeekViewHeader(viewDate: Date): WeekDay[] {
    let days: WeekDay[] = []
    let { viewStart, viewEnd } = getWeekViewPeriod(viewDate, this.weekStartsOn, this.excludeDays, this.daysInWeek)
    if (viewStart && viewEnd) {
      while (viewStart <= viewEnd) {
        const dayObj = getDayObject(viewStart, this.weekStartsOn, this.excludeDays, this.weekendDays)
        days.push(dayObj)
        viewStart = addDate(viewStart, 1)
      }
    }
    // if (viewStart && viewEnd) {
    //   while (viewStart <= viewEnd) {
    //     const dayObj = getDayObject(viewStart, this.config.weekStartsOn!, this.config.excludeDays!, this.config.weekendDays!)
    //     days.push(dayObj)
    //     viewStart = addDate(viewStart, 1)
    //   }
    //   this._days.next(days)
    // }
    
    return days
  }

  protected refreshBody(): void {
    this.view = this.getWeekView(this.events);
    console.warn('events', this.events)
    console.warn('view', this.view)
    console.warn('allDayEvent', JSON.parse(JSON.stringify(this.view.allDayEventRows)))
  }

  protected refreshAll(): void {
    this.refreshHeader();
    this.refreshBody();
    this.emitBeforeViewRender();
  }

  protected emitBeforeViewRender(): void {
    if (this.days && this.view) {
      this.beforeViewRender.emit({
        header: this.days,
        ...this.view,
      });
    }
  }

  getWeekView(events: CalendarEvent[]) {
    console.log('viewDate', this.viewDate)
    return this.prepareWeekView({
      events,
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      precision: this.precision,
      absolutePositionedEvents: true,
      hourSegments: this.hourSegments,
      hourDuration: this.hourDuration,
      dayStart: {
        hour: this.dayStartHour,
        minute: this.dayStartMinute,
      },
      dayEnd: {
        hour: this.dayEndHour,
        minute: this.dayEndMinute,
      },
      segmentHeight: this.hourSegmentHeight,
      weekendDays: this.weekendDays,
      minimumEventHeight: this.minimumEventHeight,
      ...getWeekViewPeriod(
        // this.dateAdapter,
        this.viewDate,
        this.weekStartsOn,
        this.excludeDays,
        this.daysInWeek
      ),
    });
  }

  prepareWeekView(args: GetWeekViewArgs): WeekView {
    console.warn('args', args)
    const period = { start: args.viewStart ? args.viewStart : args.viewDate, end: args.viewEnd ? args.viewEnd : args.viewDate, events: args.events ? args.events : [] }
    console.log('period', period)
    let hourColumns: WeekViewHourColumn[] = []
    let allDayEventRows: WeekViewAllDayEventRow[] = []

    let startOfView: Date = period.start
    let endOfView: Date = period.end

    // allDayEventRows
    let allDayEvents = args.events?.filter((event: CalendarEvent) => event.allDay)
    allDayEvents?.forEach((event: CalendarEvent) => {
      let offset = 3
      let span = 3
      const endsAfterWeek: boolean = event.end ? event.end > period.end : false
      const startsBeforeWeek: boolean = event.start < period.start

      const newEvent = { endsAfterWeek, event, offset, span, startsBeforeWeek }
      allDayEventRows.push({ row: [newEvent] })
    })

    // dayEvents
    let events = args.events?.filter((event: CalendarEvent) => !event.allDay)

    while (startOfView < endOfView) {
      let hourColumn: WeekViewHourColumn = { date: new Date(startOfView.toString()), events: [], hours: [] }
      
      for (let i = this.dayStartHour; i <= this.dayEndHour; i++) {
        let viewHour: WeekViewHour = { segments: [] }
        let segments: WeekViewHourSegment[] = []
        for (let j = 0; j < this.hourSegments; j++) {
          const date = new Date(startOfView)
          date.setMinutes((i * 60) + j * (60 / this.hourSegments))
          segments.push({ date, isStart: (j==0) ? true : false, cssClass: '', displayDate: date })
        }
        viewHour.segments = segments
        hourColumn.hours.push(viewHour)
      }

      events?.forEach((event: CalendarEvent) => {

        // if (event.start < period.end && (!event.end || event.end > period.start)) {
        //   console.log('event filtered', event)
        // }
        let top: number = 0
        let height: number = 0

        switch (true) {
          case isSameDay(event.start, startOfView) && !event.end:
            
            top = getHours(startOfHour(event.start)) * this.hourSegments * this.hourSegmentHeight
            console.log('top', top)
            break
          case isSameDay(event.start, startOfView) && event.end && isSameDay(event.end, startOfView):
            let startsBeforeDay: boolean = event.start < startOfView
            let endsAfterDay: boolean = event.end ? event.end > endOfView : false
  
            top = getHours(startOfHour(event.start)) * this.hourSegments * this.hourSegmentHeight
            height = getHours(startOfHour(event.end)) * this.hourSegments * this.hourSegmentHeight - top
    
            hourColumn.events.push({ event, height, width: 100, top, left: 0, startsBeforeDay, endsAfterDay })
            break
        }        
      })
      
      
      
      hourColumns.push(hourColumn)
      startOfView = addDate(startOfView, 1)
    }

    console.warn('hourColumns', hourColumns)

    // if (args.viewStart && args.viewEnd) {
    //   hourColumns = this.prepareDayViewHourColumns(period, args.dayStart, args.dayEnd)
    //   allDayEventRows = this.getAllDayEventRows(period, args.events)
    // }
    const view: WeekView = {
      period,
      allDayEventRows,
      hourColumns
    }

    return view
  }

  // protected getDragMovedEventTimes(
  //   weekEvent: WeekViewAllDayEvent | WeekViewTimeEvent,
  //   dragEndEvent: DragEndEvent | DragMoveEvent,
  //   dayWidth: number,
  //   useY: boolean
  // ) {
  //   const daysDragged =
  //     (roundToNearest(dragEndEvent.x, dayWidth) / dayWidth) *
  //     (this.rtl ? -1 : 1);
  //   const minutesMoved = useY
  //     ? getMinutesMoved(
  //         dragEndEvent.y,
  //         this.hourSegments,
  //         this.hourSegmentHeight,
  //         this.eventSnapSize,
  //         this.hourDuration
  //       )
  //     : 0;

  //   const start = this.dateAdapter.addMinutes(
  //     addDaysWithExclusions(
  //       this.dateAdapter,
  //       weekEvent.event.start,
  //       daysDragged,
  //       this.excludeDays
  //     ),
  //     minutesMoved
  //   );
  //   let end: Date;
  //   if (weekEvent.event.end) {
  //     end = this.dateAdapter.addMinutes(
  //       addDaysWithExclusions(
  //         this.dateAdapter,
  //         weekEvent.event.end,
  //         daysDragged,
  //         this.excludeDays
  //       ),
  //       minutesMoved
  //     );
  //   }

  //   return { start, end };
  // }

  // protected restoreOriginalEvents(
  //   tempEvents: CalendarEvent[],
  //   adjustedEvents: Map<CalendarEvent, CalendarEvent>,
  //   snapDraggedEvents = true
  // ) {
  //   const previousView = this.view;
  //   if (snapDraggedEvents) {
  //     this.view = this.getWeekView(tempEvents);
  //   }

  //   const adjustedEventsArray = tempEvents.filter((event) =>
  //     adjustedEvents.has(event)
  //   );
  //   this.view.hourColumns.forEach((column, columnIndex) => {
  //     previousView.hourColumns[columnIndex].hours.forEach((hour, hourIndex) => {
  //       hour.segments.forEach((segment, segmentIndex) => {
  //         column.hours[hourIndex].segments[segmentIndex].cssClass =
  //           segment.cssClass;
  //       });
  //     });

  //     adjustedEventsArray.forEach((adjustedEvent) => {
  //       const originalEvent = adjustedEvents.get(adjustedEvent);
  //       const existingColumnEvent = column.events.find(
  //         (columnEvent) =>
  //           columnEvent.event ===
  //           (snapDraggedEvents ? adjustedEvent : originalEvent)
  //       );
  //       if (existingColumnEvent) {
  //         // restore the original event so trackBy kicks in and the dom isn't changed
  //         existingColumnEvent.event = originalEvent;
  //         existingColumnEvent['tempEvent'] = adjustedEvent;
  //         if (!snapDraggedEvents) {
  //           existingColumnEvent.height = 0;
  //           existingColumnEvent.width = 0;
  //         }
  //       } else {
  //         // add a dummy event to the drop so if the event was removed from the original column the drag doesn't end early
  //         const event = {
  //           event: originalEvent,
  //           left: 0,
  //           top: 0,
  //           height: 0,
  //           width: 0,
  //           startsBeforeDay: false,
  //           endsAfterDay: false,
  //           tempEvent: adjustedEvent,
  //         };
  //         column.events.push(event);
  //       }
  //     });
  //   });
  //   adjustedEvents.clear();
  // }

  // protected getTimeEventResizedDates(
  //   calendarEvent: CalendarEvent,
  //   resizeEvent: ResizeEvent
  // ) {
  //   const newEventDates = {
  //     start: calendarEvent.start,
  //     end: getDefaultEventEnd(
  //       this.dateAdapter,
  //       calendarEvent,
  //       this.minimumEventHeight
  //     ),
  //   };
  //   const { end, ...eventWithoutEnd } = calendarEvent;
  //   const smallestResizes = {
  //     start: this.dateAdapter.addMinutes(
  //       newEventDates.end,
  //       this.minimumEventHeight * -1
  //     ),
  //     end: getDefaultEventEnd(
  //       this.dateAdapter,
  //       eventWithoutEnd,
  //       this.minimumEventHeight
  //     ),
  //   };

  //   const modifier = this.rtl ? -1 : 1;

  //   if (typeof resizeEvent.edges.left !== 'undefined') {
  //     const daysDiff =
  //       Math.round(+resizeEvent.edges.left / this.dayColumnWidth) * modifier;
  //     const newStart = addDaysWithExclusions(
  //       this.dateAdapter,
  //       newEventDates.start,
  //       daysDiff,
  //       this.excludeDays
  //     );
  //     if (newStart < smallestResizes.start) {
  //       newEventDates.start = newStart;
  //     } else {
  //       newEventDates.start = smallestResizes.start;
  //     }
  //   } else if (typeof resizeEvent.edges.right !== 'undefined') {
  //     const daysDiff =
  //       Math.round(+resizeEvent.edges.right / this.dayColumnWidth) * modifier;
  //     const newEnd = addDaysWithExclusions(
  //       this.dateAdapter,
  //       newEventDates.end,
  //       daysDiff,
  //       this.excludeDays
  //     );
  //     if (newEnd > smallestResizes.end) {
  //       newEventDates.end = newEnd;
  //     } else {
  //       newEventDates.end = smallestResizes.end;
  //     }
  //   }

  //   if (typeof resizeEvent.edges.top !== 'undefined') {
  //     const minutesMoved = getMinutesMoved(
  //       resizeEvent.edges.top as number,
  //       this.hourSegments,
  //       this.hourSegmentHeight,
  //       this.eventSnapSize,
  //       this.hourDuration
  //     );
  //     const newStart = this.dateAdapter.addMinutes(
  //       newEventDates.start,
  //       minutesMoved
  //     );
  //     if (newStart < smallestResizes.start) {
  //       newEventDates.start = newStart;
  //     } else {
  //       newEventDates.start = smallestResizes.start;
  //     }
  //   } else if (typeof resizeEvent.edges.bottom !== 'undefined') {
  //     const minutesMoved = getMinutesMoved(
  //       resizeEvent.edges.bottom as number,
  //       this.hourSegments,
  //       this.hourSegmentHeight,
  //       this.eventSnapSize,
  //       this.hourDuration
  //     );
  //     const newEnd = this.dateAdapter.addMinutes(
  //       newEventDates.end,
  //       minutesMoved
  //     );
  //     if (newEnd > smallestResizes.end) {
  //       newEventDates.end = newEnd;
  //     } else {
  //       newEventDates.end = smallestResizes.end;
  //     }
  //   }

  //   return newEventDates;
  // }

  protected resizeStarted(
    eventsContainer: HTMLElement,
    event: WeekViewTimeEvent | WeekViewAllDayEvent,
    dayWidth?: number
  ) {
    this.dayColumnWidth = this.getDayColumnWidth(eventsContainer);
    // const resizeHelper = new CalendarResizeHelper(
    //   eventsContainer,
    //   dayWidth,
    //   this.rtl
    // );
    // this.validateResize = ({ rectangle, edges }) => {
    //   const isWithinBoundary = resizeHelper.validateResize({
    //     rectangle: { ...rectangle },
    //     edges,
    //   });

    //   if (isWithinBoundary && this.validateEventTimesChanged) {
    //     let newEventDates;
    //     if (!dayWidth) {
    //       newEventDates = this.getTimeEventResizedDates(event.event, {
    //         rectangle,
    //         edges,
    //       });
    //     } else {
    //       const modifier = this.rtl ? -1 : 1;
    //       if (typeof edges.left !== 'undefined') {
    //         const diff = Math.round(+edges.left / dayWidth) * modifier;
    //         newEventDates = this.getAllDayEventResizedDates(
    //           event.event,
    //           diff,
    //           !this.rtl
    //         );
    //       } else {
    //         const diff = Math.round(+edges.right / dayWidth) * modifier;
    //         newEventDates = this.getAllDayEventResizedDates(
    //           event.event,
    //           diff,
    //           this.rtl
    //         );
    //       }
    //     }
    //     return this.validateEventTimesChanged({
    //       type: CalendarEventTimesChangedEventType.Resize,
    //       event: event.event,
    //       newStart: newEventDates.start,
    //       newEnd: newEventDates.end,
    //     });
    //   }

    //   return isWithinBoundary;
    // };
    this.cdr.markForCheck();
  }

  // protected getAllDayEventResizedDates(
  //   event: CalendarEvent,
  //   daysDiff: number,
  //   beforeStart: boolean
  // ) {
  //   let start: Date = event.start;
  //   let end: Date = event.end || event.start;
  //   if (beforeStart) {
  //     start = addDaysWithExclusions(
  //       this.dateAdapter,
  //       start,
  //       daysDiff,
  //       this.excludeDays
  //     );
  //   } else {
  //     end = addDaysWithExclusions(
  //       this.dateAdapter,
  //       end,
  //       daysDiff,
  //       this.excludeDays
  //     );
  //   }

  //   return { start, end };
  // }

  trackByWeekDayHeaderDate = (index: number, day: WeekDay) => day.date
  trackByHourSegment = (index: number, segment: WeekViewHourSegment) => segment.date
  trackByHour = (index: number, hour: WeekViewHour) => hour.segments[0].date
  trackByWeekAllDayEvent = (index: number, weekEvent: WeekViewAllDayEvent) => (weekEvent.event.id ? weekEvent.event.id : weekEvent.event)
  trackByWeekTimeEvent = (index: number, weekEvent: WeekViewTimeEvent) => (weekEvent.event.id ? weekEvent.event.id : weekEvent.event)

  trackByHourColumn = (index: number, column: WeekViewHourColumn) => column.hours[0] ? column.hours[0].segments[0].date : column
  trackById = (index: number, row: WeekViewAllDayEventRow) => row.id
}
