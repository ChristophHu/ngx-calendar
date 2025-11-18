// import * as shajs from 'sha.js'
// import JWT from 'expo-jwt'

import { IsActiveMatchOptions } from "@angular/router"
import { CalendarEvent } from "../models/models"

export function isMobile(): boolean {
    var ua = navigator.userAgent
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
        return true
    } else {
        return false
    }
}

export function checkStateForEmptyArrays(value: any): any[] {
    if (isArray(value)) {
        return value
    } else {
        return []
    }
}

export function dateToLocalISOString(dt: Date): string {
    dt.setHours(new Date().getHours()+1)
    return dt.toISOString().substring(0,16)
}

export function orderBy(input: any, byProperty: string, asc?: boolean ): any {
    if (input != null && input.length > 0 && Array.isArray(input)) {
      let result = [...input]
      if (asc) result.sort((a, b) => (a[byProperty] < b[byProperty] ? -1 : 1))
      if (!asc) result.sort((a, b) => (a[byProperty] > b[byProperty] ? -1 : 1))
      return result
    }
    return []
}

export function downscaleImage(dataUrl: any, newWidth: number, imageType: any, imageArguments: any) {
    "use strict"
    var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl

    // Provide default values
    imageType = imageType || "image/jpeg"
    imageArguments = imageArguments || 0.7

    // Create a temporary image so that we can compute the height of the downscaled image.
    image = new Image()
    image.src = dataUrl
    oldWidth = image.width
    oldHeight = image.height
    newHeight = Math.floor(oldHeight / oldWidth * newWidth)

    // Create a temporary canvas to draw the downscaled image on.
    canvas = document.createElement("canvas")
    canvas.width = newWidth
    canvas.height = newHeight

    // Draw the downscaled image on the canvas and return the new data URL.
    ctx = canvas.getContext("2d")
    if (ctx) ctx.drawImage(image, 0, 0, newWidth, newHeight)
    newDataUrl = canvas.toDataURL(imageType, imageArguments)
    return newDataUrl
}

export function isUndefined(value: any): value is undefined {
    return typeof value === 'undefined'
}
  
export function isNull(value: any): value is null {
    return value === null
}

export function isNumber(value: any): value is number {
    return typeof value === 'number'
}

export function isNumberFinite(value: any): value is number {
    return isNumber(value) && isFinite(value)
}

// Not strict positive
export function isPositive(value: number): boolean {
    return value >= 0
}

export function isInteger(value: number): boolean {
    // No rest, is an integer
    return value % 1 === 0
}

export function isNil(value: any): value is null | undefined {
    return value === null || typeof value === 'undefined'
}

export function isString(value: any): value is string {
    return typeof value === 'string'
}

export function isObject(value: any): boolean {
    return value !== null && typeof value === 'object'
}

export function isArray(value: any): boolean {
    return Array.isArray(value)
}

export function isFunction(value: any): boolean {
    return typeof value === 'function'
}

export function toDecimal(value: number, decimal: number): number {
    return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal)
}

export function testFunction(cb: any) {
    console.time('duration')
    for (var i = 0; i < 1000; i++) {
        // this.funcToTest()
        cb // callbackFunction
    };
    console.timeEnd('duration')
}

// time
export function diffToNow(time: number): number {
    const now: number = ~~(new Date().getTime() / 1000)
    const diff: number = time - now
    return diff
}
export function diff() {
    const n = new Date(now() - timezoneoffset())
}

export function getLocalISO(val: string = ''): string {
    let date: Date | string
    switch(val) {
    case 'lastyear':
        date = new Date(lastyear() - timezoneoffset())
        break

    case 'year':
        date = new Date(year() - timezoneoffset())
        break

    case 'lastmonth':
        date = new Date(lastmonth() - timezoneoffset())
        break

    case 'month':
        date = new Date(month() - timezoneoffset())
        break

    case 'lastweek':
        date = new Date(lastweek() - timezoneoffset())
        break

    case 'week':
        date = new Date(week() - timezoneoffset())
        break

    case 'yesterday':
        date = new Date(yesterday() - timezoneoffset())
        break

    case 'today':
        date = new Date(today() - timezoneoffset())
        break

    case 'tomorrow':
        date = new Date(tomorrow() - timezoneoffset())
        break

    case 'now':
        date = new Date(now() - timezoneoffset())
        break

    default:
        date = new Date()
    }
    const result: string = date.toISOString().slice(0, -1).replace('T', ' ')

    return result
}

export function timezoneoffset(): any {
    return new Date().getTimezoneOffset() * 60000
}
function lastyear(): any {
    return new Date(new Date().getFullYear()-1, 0, 1)
}
function year(): any {
    return new Date(new Date().getFullYear(), 0, 1)
}
function lastmonth(): any {
    return new Date(new Date().getFullYear(), new Date().getMonth()-1, 1)
}
function month(): any {
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1)
}
function lastweek(): any {
    // Sunday - Saturday : 0 - 6
    let d = new Date()
    const diff = d.getDate() - d.getDay() + (d.getDay() == 0 ? -6:1) - 7
    d.setDate(diff)
    d.setHours(0,0,0,0)
    return d
}
function week(): any {
    // Sunday - Saturday : 0 - 6
    let d = new Date()
    const diff = d.getDate() - d.getDay() + (d.getDay() == 0 ? -6:1)
    d.setDate(diff)
    d.setHours(0,0,0,0)
    return d
}
function yesterday(): number {
    return new Date().setHours(-24,0,0,0)
}
function today(): number {
    return new Date().setHours(0,0,0,0)
}
function now(): number {
    return new Date().getTime()
}
function tomorrow(): number {
    return new Date().setHours(24,0,0,0)
}
export function getStartOfDay(date: Date): Date {
    date.setHours(0,0,0,0)
    return date
}
export function getDayObject(viewDate: Date, weekStartsOn: number, excluded?: number[], weekendDays?: number[]): any {
    const date = getStartOfDay(viewDate)
    const day = date.getDay()
    const isPast = date < getStartOfDay(new Date())
    const isToday = date >= getStartOfDay(new Date()) && date < getEndOfDay(new Date())
    const isFuture = date > getEndOfDay(new Date())
    const isWeekend = weekendDays ? weekendDays.indexOf(date.getDay()) > -1 : false
    return {
        date: date.toString(), day, isPast, isToday, isFuture, isWeekend
    }
}

export function getStartOfWeek(date: Date, weekStartsOn: number = 0): Date {
    const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : weekStartsOn)
    date.setDate(diff)
    date.setHours(0,0,0,0)
    return date
}
export function getEndOfWeek(date: Date, weekStartsOn: number = 0): Date {
    const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : weekStartsOn)
    date.setDate(diff + 6)
    date.setHours(23,59,59,999)
    return date
}
export function getDayOfWeek(date: Date): number {
    return date.getDay()
}
export function addDate(date: Date, days: number): Date {
    date.setDate(date.getDate() + days)
    return date
}
export function subDays(date: Date, days: number): Date {
    date.setDate(date.getDate() - days)
    return date
}
export function getEndOfDay(date: Date): Date {
    date.setHours(23,59,59,999)
    return date
}
export function setMinutes(date: Date, minutes: number): Date {
    date.setMinutes(minutes)
    return date
}
export function setHours(date: Date, hours: number): Date {
    date.setHours(hours)
    return date
}
export function differenceInMinutes(date1: Date, date2: Date): number {
    return Math.round((date2.getTime() - date1.getTime()) / 60000)
}
export function isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString()
}
export function addDaysWithExclusions(date: Date, days: number, excluded: number[]): Date {
    date.setDate(date.getDate() + days)
    while (excluded.indexOf(date.getDay()) > -1) {
        date.setDate(date.getDate() + 1)
    }
    return date
}
export function getWeekViewPeriod(viewDate: Date, weekStartsOn: number, excluded: number[] = [], daysInWeek?: number): { viewStart: Date; viewEnd: Date } {
    const viewDay = viewDate
    const startOfDay = getStartOfDay(viewDay).toString()
    const startOfWeek = getStartOfWeek(viewDay, weekStartsOn).toString()
    const endOfWeek = getEndOfWeek(viewDay, weekStartsOn).toString()
    let viewStart = startOfWeek
    while (excluded.indexOf(viewDate.getDay()) > -1 && new Date(viewStart) < new Date(endOfWeek)) {
      viewStart = addDate(new Date(viewStart), 1).toString()
    }
    if (daysInWeek) {
      const viewEnd = getEndOfDay(addDaysWithExclusions(new Date(viewStart), daysInWeek - 1, excluded))
      return { viewStart: new Date(viewStart), viewEnd }
    } else {
      let viewEnd = new Date(endOfWeek)
      while (excluded.indexOf(viewDate.getDay()) > -1 && new Date(viewEnd) > new Date(viewStart)) {
        viewEnd = subDays(viewEnd, 1)
      }
      return { viewStart: new Date(viewStart), viewEnd }
    }
}
export function startOfHour(date: Date): Date {
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
}
export function getHours(date: Date): number {
    return date.getHours()
}
export const validateEvents = (events: CalendarEvent[]) => {
    const warn = (...args: any[]) => console.warn('angular-calendar', ...args)
    return validateEventsWithoutLog(events, warn)
}
export function validateEventsWithoutLog(events: CalendarEvent[], log: (...args: any[]) => void): boolean {
    return true
}

// hash
// npm i sha.js
// npm i --save-dev @types/sha.js
// export function sha256Hash(value: string): string {
//     return shajs('sha256').update(value).digest('hex')
// }

// token
export function getExpiration(token: string): number {
    if (!token) return 0 
    return JSON.parse(myatob(token.split('.')[1])).exp * 1000
}
export function isExpired(token: string): boolean {
    return (getExpiration(token) - new Date().getTime()) < 0
}
export function getExpirationCount(token: string): number {
    return (getExpiration(token) - new Date().getTime())
}

// alt
export function myatob(payload: string): string {
    try {
        return atob(payload);
    } catch(e) {
        return atob(base64UrlDecode(payload))
    }
}

// alt
export function base64UrlDecode(input: string): string {
    // Replace non-url compatible chars with base64 standard chars
    input = input
        .replace(/-/g, '+')
        .replace(/_/g, '/')

    // Pad out with standard base64 required padding characters
    var pad = input.length % 4
    if(pad) {
        if(pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding')
        }
        input += new Array(5-pad).join('=')
    }

    return input
}

export function encodeBase64(data: string): string {
    // return Buffer.from(data).toString('base64')
    return ''
}
export function decodeBase64(data: string): string {
    // return Buffer.from(data, 'base64').toString('ascii')
    return ''
}

// export function getToken(user: any): { access_token: string, refresh_token: string } {
//     const access_token: string = JWT.encode({
//         "sub": user.userId,
//         "email": user.email,
//         "exp": ~~(new Date().getTime() / 1000) + 3601, // 60m
//         "given_name"  : 'Vorname',
//         "family_name" : 'Name',
//         "admin"         : user.admin,
//         // "role"        : 'Administration',
//         "roles"         : user.roles,
//         "backendUrl"  : ''
//     }, 'AT_SECRET')
//     const refresh_token: string = JWT.encode({
//         "sub": user.userId,
//         "email": user.email,
//         "exp": ~~(new Date().getTime() / 1000) + 3601 // 60m
//     }, 'RT_SECRET')

//     return { access_token, refresh_token }
// }

export function getUserFromToken(token: string): string | undefined {
    let jwtarr = token.split('\.');
    let decodedPart = myatob(jwtarr[1]);
    let payload = JSON.parse(decodedPart);
  
    let val;
    let sub = payload['sub'];
    let upn = payload['upn'];
    let unique_name = payload['unique_name'];
    let persnr = payload['persnr'];
    if (persnr&&new RegExp(/[0-9]{8}.*/ig).test(persnr))
    {
      val = persnr;
    }
    else {
      
      if (!val&&sub&&new RegExp(/[0-9]{8}.*/ig).test(sub))
      {
        val = sub;
      }
        
      if (!val&&upn&&new RegExp(/[0-9]{8}.*/ig).test(upn))
      {
        if (upn.indexOf("@"))
        {
          val = upn.substring(0,upn.indexOf("@"));
        }
      }
  
         
      if (!val&&unique_name&&new RegExp(/.*(\\|\\\\\\)[0-9]{8}(-.*)?/ig).test(unique_name))
      {      
        val = unique_name.substring(unique_name.lastIndexOf("\\")+1);      
      }
    }
    
    return val;
}

export class ApiUtils {

    constructor() { }

    static guid(): string {
        let d = new Date().getTime()

        if ( typeof performance !== 'undefined' && typeof performance.now === 'function' ) {
            d += performance.now()
        }

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (d + Math.random() * 16) % 16 | 0
            d = Math.floor(d / 16)
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        })
    }
}