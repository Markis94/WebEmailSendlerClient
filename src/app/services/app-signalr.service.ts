import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as signalR from '@microsoft/signalr';
import { debounceTime, filter, map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { EmailSendInfo, EmailSendTask } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class AppSignalrService {
  private hubConnection!: signalR.HubConnection;
  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.baseUrl}hub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();
  }
  
  changeEmailSendInfo(emailSendTaskId: number, destroyRef: any): Observable<EmailSendInfo> {
    return new Observable<any>((observer) => {
      this.hubConnection.on('ChangeEmailSendInfo', (emailSendTaskId: number, emailSendInfo: EmailSendInfo) => {
        observer.next({ emailSendTaskId, emailSendInfo }); // Упаковываем аргументы в объект
      });
    })
    .pipe(
      debounceTime(200),
      filter((result) => result.emailSendTaskId === emailSendTaskId),
      map((result) => result.emailSendInfo),
      shareReplay(1),
      takeUntilDestroyed(destroyRef)
    );
  }

  changeEmailSendStatus(destroyRef: any): Observable<EmailSendTask> {
    return new Observable<EmailSendTask>((observer) => {
      this.hubConnection.on('ChangeEmailSendStatus', (emailSendTask: EmailSendTask) => {
        observer.next(emailSendTask); // Упаковываем аргументы в объект
      });
    })
    .pipe(
      debounceTime(200),
      shareReplay(1),
      takeUntilDestroyed(destroyRef)
    );
  }


  startConnection = () => {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  disconnect = () => {
    this.hubConnection.onclose(() => {
      console.log("Connection disconnected");
    });
  };
}
