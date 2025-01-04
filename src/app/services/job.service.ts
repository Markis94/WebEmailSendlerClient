import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, debounceTime, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { EmailSendTask } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient) {}
  
  CreateSendJob(emailSendTask: EmailSendTask): Observable<string> {
    return this.http
      .post<string>(`${environment.baseUrl}api/createSendJob`, emailSendTask)
      .pipe(debounceTime(200), shareReplay(1));
  }

  ReCreateSendJob(emailSendTask: EmailSendTask): Observable<string> {
    return this.http
      .post<string>(`${environment.baseUrl}api/reCreateSendJob`, emailSendTask)
      .pipe(debounceTime(200), shareReplay(1));
  }

  CancelSendJob(emailSendTaskId: number): Observable<string> {
    return this.http
      .post<string>(
        `${environment.baseUrl}api/cancelSendJob?emailSendTaskId=${emailSendTaskId}`,
        {}
      )
      .pipe(debounceTime(200), shareReplay(1));
  }

  DeleteSendJob(emailSendTaskId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.baseUrl}api/deleteSendJob?emailSendTaskId=${emailSendTaskId}`,
        {}
      )
      .pipe(debounceTime(200), shareReplay(1));
  }
}
