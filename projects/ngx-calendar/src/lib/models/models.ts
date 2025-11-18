export interface ViewPeriod {
    start: Date;
    end: Date;
    events: CalendarEvent[];
}
export interface WeekViewAllDayEvent {
    event: CalendarEvent;
    offset: number;
    span: number;
    startsBeforeWeek: boolean;
    endsAfterWeek: boolean;
}
export interface WeekViewAllDayEventRow {
    id?: string;
    row: WeekViewAllDayEvent[];
}
export interface WeekView {
    period: ViewPeriod;
    allDayEventRows: WeekViewAllDayEventRow[];
    hourColumns: WeekViewHourColumn[];
}
export interface User {
    id: number;
    name: string;
    color: EventColor;
}
export interface DayViewScheduler extends WeekView {
    users: User[];
}
export interface EventColor {
    primary: string;
    secondary: string;
    secondaryText?: string;
}
export interface EventAction {
    id?: string | number;
    label: string;
    cssClass?: string;
    a11yLabel?: string;
    onClick({ event, sourceEvent, }: {
        event: CalendarEvent;
        sourceEvent: MouseEvent | KeyboardEvent;
    }): any;
}
export interface CalendarEvent<MetaType = any> {
    id?: string | number;
    start: Date;
    end?: Date;
    title: string;
    color?: EventColor;
    actions?: EventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: MetaType;
}
export interface WeekViewTimeEvent {
    event: CalendarEvent;
    height: number;
    width: number;
    top: number;
    left: number;
    startsBeforeDay: boolean;
    endsAfterDay: boolean;
}
export interface WeekViewHourSegment {
    isStart: boolean;
    date: Date;
    displayDate: Date;
    cssClass?: string;
}
export interface WeekViewHour {
    segments: WeekViewHourSegment[];
}
export interface WeekViewHourColumn {
    date: Date;
    hours: WeekViewHour[];
    events: WeekViewTimeEvent[];
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
interface Time {
    hour: number;
    minute: number;
}
export interface GetWeekViewArgs {
    events?: CalendarEvent[];
    viewDate: Date;
    weekStartsOn: number;
    excluded?: number[];
    precision?: 'minutes' | 'days';
    absolutePositionedEvents?: boolean;
    hourSegments?: number;
    hourDuration?: number;
    dayStart: Time;
    dayEnd: Time;
    weekendDays?: number[];
    segmentHeight: number;
    viewStart?: Date;
    viewEnd?: Date;
    minimumEventHeight?: number;
}
export interface GetWeekViewArgsWithUsers extends GetWeekViewArgs {
    users: User[];
}

export interface WeekViewAllDayEventResize {
    originalOffset: number;
    originalSpan: number;
    edge: string;
}

export declare class Positioning {
    private getAllStyles;
    private getStyle;
    private isStaticPositioned;
    private offsetParent;
    position(element: HTMLElement, round?: boolean): ClientRect;
    offset(element: HTMLElement, round?: boolean): ClientRect;
    positionElements(hostElement: HTMLElement, targetElement: HTMLElement, placement: string, appendToBody?: boolean): boolean;
}
export declare type Placement = 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
export declare type PlacementArray = Placement | Array<Placement> | string;

export enum CalendarEventTimesChangedEventType {
    Drag = 'drag',
    Drop = 'drop',
    Resize = 'resize',
}

/**
 * The output `$event` type when an event is resized or dragged and dropped.
 */
export interface CalendarEventTimesChangedEvent<MetaType = any> {
    type: CalendarEventTimesChangedEventType;
    event: CalendarEvent<MetaType>;
    newStart: Date;
    newEnd?: Date;
    allDay?: boolean;
}