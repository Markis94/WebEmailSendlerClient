import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { EmailSendInfo, EmailSendTask } from '../../models/model';
import { SendlerApiService } from '../../services/sendlerApi.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
})
export class TaskItemComponent implements OnInit {
  @Input() emailSendTask!: EmailSendTask;
  trySend: boolean = false;
  emailInfo$!: Observable<EmailSendInfo>;
  constructor(
    public dialog: MatDialog,
    private sendlerApiService: SendlerApiService
  ) {}

  ngOnInit() {
    this.emailInfo$ = this.sendlerApiService.GetEmailSendTaskInfo(
      this.emailSendTask.id
    );
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
        switchMap((result) => {
          if (result) {
            this.trySend = true;
            return this.sendlerApiService.StartEmailJob(emailSendTask.id);
          } else {
            return of();
          }
        }),
        catchError((error) => {
          this.trySend = false;
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        })
      )
      .subscribe((result) => {
        this.trySend = false;
        emailSendTask.jobId = result;
        emailSendTask.sendTaskStatus = 'started';
        console.log(result);
      });
  }


  deleteTask(emailSendTask: EmailSendTask)
  {
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
      switchMap((result) => {
        if (result) {
          this.trySend = true;
          return this.sendlerApiService.DeleteEmailTask(emailSendTask.id);
        } else {
          return of();
        }
      }),
      catchError((error) => {
        this.trySend = false;
        if (error instanceof HttpErrorResponse) {
          throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
        }
        throw new Error('Произошла ужасная ошибка');
      })
    )
    .subscribe(() => {
      emailSendTask.sendTaskStatus = 'deleted';
      this.trySend = false;
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
        switchMap((result) => {
          if (result) {
            this.trySend = true;
            return this.sendlerApiService.AbortEmailJob(emailSendTask.jobId);
          } else {
            return of();
          }
        }),
        catchError((error) => {
          this.trySend = false;
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        })
      )
      .subscribe(() => {
        emailSendTask.sendTaskStatus = 'complete';
        this.trySend = false;
      });
  }
}
