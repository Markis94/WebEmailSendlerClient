import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, Observable, of, tap } from 'rxjs';
import {
  EmailSendTask,
  SendInfo,
  SendTaskStatusEnum,
} from '../../models/model';
import { AppSignalrService } from '../../services/app-signalr.service';
import { SendlerService } from '../../services/sendler.service';

@Component({
    selector: 'app-task-item',
    templateUrl: './task-item.component.html',
    styleUrls: ['./task-item.component.css'],
    standalone: false
})
export class TaskItemComponent implements OnInit {
  @Input() emailSendTask!: EmailSendTask;
  emailInfo$!: Observable<SendInfo>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private sendlerApiService: SendlerService,
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
      this.sendlerApiService.GetSendTaskInfo(this.emailSendTask.id),
      this.signalRService.changeEmailSendInfo(this.emailSendTask.id)
    ).pipe(
      tap((result) => {
        console.log(result);
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }
}
