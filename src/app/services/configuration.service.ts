import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, debounceTime, of, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Configuration } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(private http: HttpClient) {}

  Configuration(): Observable<Configuration> {
    return this.http
      .get<Configuration>(`${environment.baseUrl}api/configuration`)
      .pipe(
        debounceTime(200),
        shareReplay(1),
        catchError(() => of(new Configuration()))
      );
  }

  UpdateConfiguration(configuration: Configuration) {
    return this.http
      .put(`${environment.baseUrl}api/updateConfiguration`, configuration)
      .pipe(debounceTime(200), shareReplay(1));
  }
}
