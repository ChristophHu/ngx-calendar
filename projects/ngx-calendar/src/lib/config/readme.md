# Calendar-Configuration

## Configuration
The calendar module can be configured by passing an object to the `forRoot` method. The following options are available:
```typescript
export class CalendarConfiguration {
  weekStartsOn: number;
}
```

## Import the module
In the `app.config.ts` file, import the module and add it to the providers array.
```typescript
[...]
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(CalendarModule.forRoot({ weekStartsOn: 1 }))
  ]
}
```
