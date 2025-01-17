import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


export function getBaseUrl() {
  let url = document.getElementsByTagName("base")[0].href;
  return url;
}

if (environment.production) {
  environment.baseUrl = getBaseUrl();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));