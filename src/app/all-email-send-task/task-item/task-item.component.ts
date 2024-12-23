import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, filter, Observable, of, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { ViewHtmlBodyComponent } from '../../dialog/viewHtmlBody/viewHtmlBody.component';
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
  @Output() buttonClicked = new EventEmitter<string>();
  constructor(
    public dialog: MatDialog,
    private sendlerApiService: SendlerApiService
  ) {}

  ngOnInit() {
    if (this.emailSendTask.sendTaskStatus != 'started') {
      this.emailInfo$ = of(this.emailSendTask.emailSendInfo);
    }
  }

  loadInfo() {
    this.emailInfo$ = this.sendlerApiService.GetEmailSendTaskInfo(
      this.emailSendTask.id
    );
  }

  view(emailSendTask: EmailSendTask) {
    this.dialog.open(ViewHtmlBodyComponent, {
      data: emailSendTask,
    });
  }

  start(emailSendTask: EmailSendTask) {
    if (emailSendTask.sendTaskStatus !== 'created') return;
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          label: 'Запустить рассылку',
          message: `Вы хотите запустить рассылку email:  ${emailSendTask.name}?`,
        },
      })
      .afterClosed()
      .pipe(
        filter((result)=>result),
        switchMap(() => {
          return this.sendlerApiService.StartEmailJob(emailSendTask);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        })
      )
      .subscribe((result) => {
        emailSendTask.jobId = result;
        emailSendTask.sendTaskStatus = 'started';
        console.log(result);
      });
  }

  reCreate(emailSendTask: EmailSendTask) {
    if (emailSendTask.sendTaskStatus === 'started') return;
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          label: 'Перезапустить рассылку',
          message: `Вы хотите перезапустить рассылку email:  ${emailSendTask.name}?`,
        },
      })
      .afterClosed()
      .pipe(
        filter((result)=>result),
        tap(()=>{this.buttonClicked.emit('Задание на переотправку')}),
        switchMap(() => {
          return this.sendlerApiService.ReCreateEmailSendTask(emailSendTask);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        })
      )
      .subscribe((result) => {
        emailSendTask.jobId = result;
        emailSendTask.sendTaskStatus = 'started';
        console.log(result);
      });
  }

  deleteTask(emailSendTask: EmailSendTask) {
    if (emailSendTask.sendTaskStatus === 'started') return;
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          label: 'Удалить рассылку',
          message: `Вы хотите удалить рассылку email:  ${emailSendTask.name}?`,
        },
      })
      .afterClosed()
      .pipe(
        filter((result)=>result),
        switchMap(() => {
          return this.sendlerApiService.DeleteEmailTask(emailSendTask.id);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        })
      )
      .subscribe(() => {
        emailSendTask.sendTaskStatus = 'deleted';
      });
  }

  abort(emailSendTask: EmailSendTask) {
    if (emailSendTask.sendTaskStatus !== 'started') return;
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          label: 'Прервать рассылку',
          message: `Вы хотите остановить рассылку email:  ${emailSendTask.name}?`,
        },
      })
      .afterClosed()
      .pipe(
        filter((result)=>result),
        switchMap((result) => {
          return this.sendlerApiService.AbortEmailJob(emailSendTask.id);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        })
      )
      .subscribe(() => {
        emailSendTask.sendTaskStatus = 'complete';
      });
  }
}
