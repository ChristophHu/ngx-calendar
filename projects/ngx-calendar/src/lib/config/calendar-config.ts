import { Injectable, Provider } from "@angular/core"

export interface LibToConfigureConfiguration {
    dayEndHour?: number
    dayEndMinute?: number
    daysInWeek?: number
    dayStartHour?: number
    dayStartMinute?: number
    excludeDays?: number[]
    hourDuration?: number
    hourSegments?: number
    hourSegmentHeight?: number
    minimumEventHeight?: number
    precision?: 'days' | 'minutes'
    weekStartsOn?: number
    weekendDays?: number[]
}

@Injectable({ 
    providedIn: 'root' 
})
export abstract class LibConfigurationProvider {
    abstract get config(): LibToConfigureConfiguration
}

@Injectable({ 
    providedIn: 'root' 
})
export class DefaultLibConfiguration extends LibConfigurationProvider {
    get config(): LibToConfigureConfiguration {
        return { 
            dayEndHour: 23, 
            dayEndMinute: 59, 
            daysInWeek: 0, 
            dayStartHour: 0, 
            dayStartMinute: 0, 
            excludeDays: [], 
            hourDuration: 1, 
            hourSegments: 2, 
            hourSegmentHeight: 30, 
            minimumEventHeight: 30, 
            precision: 'days', 
            weekStartsOn: 1,
            weekendDays: [0, 6]
        }
    }
}

export class LibConfiguration {
    config?: Provider
}