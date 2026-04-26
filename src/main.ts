import { bootstrapApplication } from '@angular/platform-browser';
import { browserConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, browserConfig)
  .then(() => document.body.classList.add('js-ready'))
  .catch((err) => console.error(err));
