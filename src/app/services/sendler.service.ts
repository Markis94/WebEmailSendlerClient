import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, debounceTime, of, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { EmailSendTask, Part, SearchEmailReport, SendInfo, TestSend } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class SendlerService {
  constructor(private http: HttpClient) {}

  CreateSendTask(emailSendTask: EmailSendTask): Observable<number> {
    return this.http
      .post<number>(
        `${environment.baseUrl}api/createEmailDataSend`,
        emailSendTask
      )
      .pipe(debounceTime(200), shareReplay(1));
  }

  UpdateSendTask(emailSendTask: EmailSendTask): Observable<EmailSendTask> {
    return this.http
      .put<EmailSendTask>(
        `${environment.baseUrl}api/updateEmailDataSend`,
        emailSendTask
      )
      .pipe(debounceTime(200), shareReplay(1));
  }

  GetSendTasks(): Observable<Array<EmailSendTask>> {
    return this.http
      .get<Array<EmailSendTask>>(`${environment.baseUrl}api/sendTasks`)
      .pipe(
        debounceTime(200),
        shareReplay(1),
        catchError(() => of(new Array<EmailSendTask>()))
      );
  }

  GetSendTaskById(emailSendTaskId: number): Observable<EmailSendTask> {
    return this.http
      .get<EmailSendTask>(
        `${environment.baseUrl}api/sendTaskById?sendTaskId=${emailSendTaskId}`
      )
      .pipe(debounceTime(200), shareReplay(1));
  }

  GetSendTaskInfo(emailSendTaskId: number): Observable<SendInfo> {
    return this.http
      .get<SendInfo>(
        `${environment.baseUrl}api/sendTaskInfo?sendTaskId=${emailSendTaskId}`
      )
      .pipe(debounceTime(200), shareReplay(1));
  }

  GetEmailResultPath(
    inputValue: string,
    sendTaskId: number,
    pageIndex: number,
    pageSize: number,
    active: string,
    direction: string
  ) {
    let params = new HttpParams()
      .set('sendTaskId', sendTaskId.toString())
      .set('pageNumber', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('sortField', active.toString())
      .set('orderBy', direction.toString());
      
    if (inputValue) {
      params = params.set('inputValue', inputValue);
    }

    return this.http
    .get<Part>(`${environment.baseUrl}api/sendResultPath`, {
      params: params,
    })
    .pipe(debounceTime(200), shareReplay(1));
  }

  SearchResultByEmail(
    email: string
  ): Observable<Array<SearchEmailReport>> {
    if (!email) return of(new Array<SearchEmailReport>());
    return this.http
      .get<Array<SearchEmailReport>>(
        `${environment.baseUrl}api/searchResultByEmail?email=${email}`
      )
      .pipe(
        debounceTime(200),
        shareReplay(1),
        catchError(() => of(new Array<SearchEmailReport>()))
      );
  }

  GetEmailResultCsV(sendTaskId: number) {
    window?.open(`${environment.baseUrl}api/sendResultFile?sendTaskId=${sendTaskId}`, "_self")?.focus();
  }

  saveFile(blob: Blob | MediaSource, filename: string) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  }
  
  GetSendTaskByStatus(
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
        `${environment.baseUrl}api/sendTaskByStatus`,
        { params: params }
      )
      .pipe(
        debounceTime(200),
        shareReplay(1),
        catchError(() => of(new Array<EmailSendTask>()))
      );
  }

  SendTestMessage(testSend: TestSend): Observable<TestSend> {
    return this.http
      .post<any>(`${environment.baseUrl}api/sendTestMessage`, testSend)
      .pipe(debounceTime(200), shareReplay(1));
  }
}
