import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, Observable, of, tap } from 'rxjs';
import {
  EmailSendInfo,
  EmailSendTask,
  SendTaskStatusEnum,
} from '../../models/model';
import { AppSignalrService } from '../../services/app-signalr.service';
import { SendlerApiService } from '../../services/sendlerApi.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
})
export class TaskItemComponent implements OnInit {
  @Input() emailSendTask!: EmailSendTask;
  emailInfo$!: Observable<EmailSendInfo>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private sendlerApiService: SendlerApiService,
    private signalRService: AppSignalrService
  ) {}

  ngOnInit() {
    if (this.emailSendTask.sendTaskStatus !== SendTaskStatusEnum.started) {
      this.emailInfo$ = of(this.emailSendTask.emailSendInfo);
    } else {
      this.loadInfo();
    }
  }

  loadInfo() {
    this.emailInfo$ = merge(
      this.sendlerApiService.GetEmailSendTaskInfo(this.emailSendTask.id),
      this.signalRService.changeEmailSendInfo(this.emailSendTask.id)
    ).pipe(
      tap((result) => {
        console.log(result);
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }
}
