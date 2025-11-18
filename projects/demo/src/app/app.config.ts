import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { CalendarModule, LibConfigurationProvider, LibToConfigureConfiguration } from '../../../ngx-calendar/src/public-api'
import { provideHttpClient } from '@angular/common/http';


export class ConfigFromApp implements LibConfigurationProvider {
  get config(): LibToConfigureConfiguration {
    return {
      weekStartsOn: 1,
    } 
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(CalendarModule.forRoot({
      config: {
        provide: LibConfigurationProvider,
        useClass: ConfigFromApp
      }
    }))
  ]
};
