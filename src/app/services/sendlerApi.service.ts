import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, debounceTime, of, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { EmailSendInfo, EmailSendTask, Part, Sample, TestSend } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class SendlerApiService {
  constructor(private http: HttpClient) {}

  GetEmailSendTaskById(emailSendTaskId: number): Observable<EmailSendTask> {
    return this.http
      .get<EmailSendTask>(
        `${environment.baseUrl}api/getEmailSendTaskById?sendTaskId=${emailSendTaskId}`
      )
      .pipe(debounceTime(200), shareReplay(1));
  }

  GetEmailSendTaskInfo(emailSendTaskId: number): Observable<EmailSendInfo> {
    return this.http
      .get<EmailSendInfo>(
        `${environment.baseUrl}api/getEmailSendTaskInfo?sendTaskId=${emailSendTaskId}`
      )
      .pipe(debounceTime(200), shareReplay(1));
  }

  EmailResultPath(
    inputValue: string,
    sendTaskId: number,
    pageIndex: number,
    pageSize: number,
    active: string,
    direction: string
  ) {
    if (inputValue) {
      let params = new HttpParams()
        .set('inputValue', inputValue)
        .set('sendTaskId', sendTaskId.toString())
        .set('pageNumber', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortField', active.toString())
        .set('orderBy', direction.toString());
      return this.http
        .get<Part>(`${environment.baseUrl}api/getEmailResultPath`, {
          params: params,
        })
        .pipe(debounceTime(200), shareReplay(1));
    } else {
      let params = new HttpParams()
        .set('sendTaskId', sendTaskId.toString())
        .set('pageNumber', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortField', active.toString())
        .set('orderBy', direction.toString());
      return this.http
        .get<Part>(`${environment.baseUrl}api/getEmailResultPath`, {
          params: params,
        })
        .pipe(debounceTime(200), shareReplay(1));
    }
  }

  GetEmailSendTaskByStatus(
    sendTaskStatus: string,
    leftDate: string,
    rightDate: string
  ): Observable<Array<EmailSendTask>> {
    if (!leftDate || !rightDate) return of(new Array<EmailSendTask>());
    let params = new HttpParams()
      .set('taskStatus', sendTaskStatus)
      .set('leftDate', leftDate)
      .set('rightDate', rightDate);
    return this.http
      .get<Array<EmailSendTask>>(
        `${environment.baseUrl}api/emailSendTaskByStatus`,
        { params: params }
      )
      .pipe(
        debounceTime(200),
        shareReplay(1),
        catchError(() => of(new Array<EmailSendTask>()))
      );
  }

  GetEmailSendTask(): Observable<Array<EmailSendTask>> {
    return this.http
      .get<Array<EmailSendTask>>(`${environment.baseUrl}api/getEmailSendTask`)
      .pipe(
        debounceTime(200),
        shareReplay(1),
        catchError(() => of(new Array<EmailSendTask>()))
      );
  }

  AbortEmailJob(emailSendTaskId: number): Observable<string> {
    return this.http
      .post<string>(
        `${environment.baseUrl}api/cancelEmailJob?emailSendTaskId=${emailSendTaskId}`,
        {}
      )
      .pipe(debounceTime(200), shareReplay(1));
  }

  DeleteEmailTask(emailSendTaskId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.baseUrl}api/deleteTaskAndData?emailSendTaskId=${emailSendTaskId}`,
        {}
      )
      .pipe(debounceTime(200), shareReplay(1));
  }

  CreateEmailSendTask(emailSendTask: EmailSendTask): Observable<number> {
    return this.http
      .post<number>(
        `${environment.baseUrl}api/createEmailDataSendTask`,
        emailSendTask
      )
      .pipe(debounceTime(200), shareReplay(1));
  }

  StartEmailJob(emailSendTask: EmailSendTask): Observable<string> {
    return this.http
      .post<string>(`${environment.baseUrl}api/createEmailJob`, emailSendTask)
      .pipe(debounceTime(200), shareReplay(1));
  }

  ReCreateEmailSendTask(emailSendTask: EmailSendTask): Observable<string> {
    return this.http
      .post<string>(`${environment.baseUrl}api/reCreateEmailJob`, emailSendTask)
      .pipe(debounceTime(200), shareReplay(1));
  }


  SendTestMessage(testSend: TestSend): Observable<TestSend> {
    return this.http
      .post<any>(`${environment.baseUrl}api/sendTestMessage`, testSend)
      .pipe(debounceTime(200), shareReplay(1));
  }

  GetSample(): Observable<Array<Sample>> {
    return this.http
      .get<any>(`${environment.baseUrl}api/getSamples`)
      .pipe(debounceTime(200), shareReplay(1), 
      catchError(() => of(new Array<Sample>())));
  }

  GetSampleById(sampleId: number): Observable<Sample> {
    return this.http
      .get<any>(`${environment.baseUrl}api/getSampleById?sampleId=${sampleId}`)
      .pipe(debounceTime(200), shareReplay(1), 
      catchError(() => of(new Sample())));
  }

  SaveSample(sample: any): Observable<any> {
    return this.http
      .post<any>(`${environment.baseUrl}api/saveSample`, sample)
      .pipe(debounceTime(200), shareReplay(1));
  }

  CreateSample(sample: Sample): Observable<Sample> {
    return this.http
      .post<any>(`${environment.baseUrl}api/createSample`, sample)
      .pipe(debounceTime(200), shareReplay(1));
  }

  UpdateSample(sample: Sample) {
    return this.http
      .put<any>(`${environment.baseUrl}api/updateSample`, sample)
      .pipe(debounceTime(200), shareReplay(1));
  }

  DeleteSample(sampleId: number) {
    return this.http
      .delete<string>(
        `${environment.baseUrl}api/deleteSample?sampleId=${sampleId}`,
        {}
      )
      .pipe(debounceTime(200), shareReplay(1));
  }
}
