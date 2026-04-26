import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { App } from './app';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([{ path: '', component: App }]),
  ]
};

export const browserConfig: ApplicationConfig = {
  providers: [
    ...appConfig.providers,
    provideBrowserGlobalErrorListeners(),
  ]
};
