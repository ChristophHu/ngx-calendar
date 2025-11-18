import { ModuleWithProviders, NgModule } from '@angular/core'
import { DefaultLibConfiguration, LibConfiguration } from './config/calendar-config'

@NgModule({
    declarations: [],
    imports: []
})
export class CalendarModule {
  static forRoot(libConfiguration: LibConfiguration): ModuleWithProviders<CalendarModule> {
    return {
      ngModule: CalendarModule,
      providers: [
        libConfiguration.config || { provide: LibConfiguration, useClass: DefaultLibConfiguration }
      ],
    }
  }
}