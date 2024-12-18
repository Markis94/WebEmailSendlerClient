import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailSendTask } from '../models/model';
import { SendlerApiService } from '../services/sendlerApi.service';

@Component({
  selector: 'app-all-email-send-task',
  templateUrl: './all-email-send-task.component.html',
  styleUrls: ['./all-email-send-task.component.css'],
})
export class AllEmailSendTaskComponent implements OnInit {
  emailSendTask$?: Observable<Array<EmailSendTask>>;
  constructor(private sendlerApiService: SendlerApiService) {}
  selectStatus: string = 'created';
  statusArray: Array<any> = [
    {
      status: 'created',
      viewStatus: 'Новые',
    },
    {
      status: 'started',
      viewStatus: 'Запущенные',
    },
    {
      status: 'complete',
      viewStatus: 'Завершенные',
    },
    {
      status: 'cancel',
      viewStatus: 'Отмененные',
    },
  ];

  ngOnInit() {
    this.emailSendTask$ = this.sendlerApiService.GetEmailSendTaskByStatus(
      this.selectStatus
    );
  }

  changeTaskStream() {
    this.emailSendTask$ = this.sendlerApiService.GetEmailSendTaskByStatus(
      this.selectStatus
    );
  }
}
