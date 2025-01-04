import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, debounceTime, of, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sample } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class SampleService {
  constructor(private http: HttpClient) {}

  GetSamples(): Observable<Array<Sample>> {
    return this.http
      .get<Array<Sample>>(`${environment.baseUrl}api/samples`)
      .pipe(
        debounceTime(200),
        shareReplay(1),
        catchError(() => of(new Array<Sample>()))
      );
  }

  GetSampleById(sampleId: number): Observable<Sample> {
    return this.http
      .get<Sample>(
        `${environment.baseUrl}api/sampleById?sampleId=${sampleId}`
      )
      .pipe(
        debounceTime(200),
        shareReplay(1),
        catchError(() => of(new Sample()))
      );
  }

  CreateSample(sample: Sample): Observable<Sample> {
    return this.http
      .post<Sample>(`${environment.baseUrl}api/createSample`, sample)
      .pipe(debounceTime(200), shareReplay(1));
  }

  UpdateSample(sample: Sample) {
    return this.http
      .put(`${environment.baseUrl}api/updateSample`, sample)
      .pipe(debounceTime(200), shareReplay(1));
  }

  DeleteSample(sampleId: number) {
    return this.http
      .delete(`${environment.baseUrl}api/deleteSample?sampleId=${sampleId}`)
      .pipe(debounceTime(200), shareReplay(1));
  }
}
