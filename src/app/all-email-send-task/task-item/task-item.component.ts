import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EmailSendInfo, EmailSendTask } from '../../models/model';
import { SendlerApiService } from '../../services/sendlerApi.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
})
export class TaskItemComponent implements OnInit {
  @Input() emailSendTask!: EmailSendTask;
  emailInfo$!: Observable<EmailSendInfo>;
  constructor(
    private sendlerApiService: SendlerApiService
  ) {}

  ngOnInit() {
    console.log(this.emailSendTask);
    if (this.emailSendTask.sendTaskStatus !== "started") {
      this.emailInfo$ = of(this.emailSendTask.emailSendInfo);
    }
    else
    {
      this.loadInfo();
    }
  }

  loadInfo() {
    this.emailInfo$ = this.sendlerApiService.GetEmailSendTaskInfo(
      this.emailSendTask.id
    );
  }
}
