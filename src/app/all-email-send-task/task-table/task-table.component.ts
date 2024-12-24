import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, filter, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { ViewHtmlBodyComponent } from '../../dialog/viewHtmlBody/viewHtmlBody.component';
import { EmailSendTask } from '../../models/model';
import { SendlerApiService } from '../../services/sendlerApi.service';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TaskTableComponent implements OnInit, AfterViewInit {
  @Input() emailSendTask: Array<EmailSendTask> = [];
  @Input() taskStatus: string = 'created';

  columnsToDisplay: Array<any> = [
    { columnDef: 'name', header: 'Название' },
    { columnDef: 'subject', header: 'Тема письма' },
    { columnDef: 'createDate', header: 'Дата создания', mask: 'date' },
    { columnDef: 'startDate', header: 'Начало рассылки', mask: 'dateTime' },
    { columnDef: 'endDate', header: 'Конец рассылки', mask: 'dateTime' },
  ];

  columnsToDisplayWithExpand = [
    ...this.columnsToDisplay.map((x) => x.columnDef),
    'info',
    'actions',
    'expand',
  ];
  expandedElement: any;

  length: number = 100;
  pageSize: number = 10;
  pageSizeOptions: Array<number> = [10, 15, 25, 50, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private sendlerApiService: SendlerApiService
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Показать';
    this.paginator._intl.firstPageLabel = 'В начало';
    this.paginator._intl.lastPageLabel = 'В конец';
    this.paginator._intl.nextPageLabel = 'Далее';
    this.paginator._intl.previousPageLabel = 'Назад';
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
        filter((result) => result),
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
        this.emailSendTask = this.emailSendTask.filter(x=>x.sendTaskStatus == this.taskStatus);
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
        filter((result) => result),
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
        this.emailSendTask = this.emailSendTask.filter(x=>x.sendTaskStatus == this.taskStatus);
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
        filter((result) => result),
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
        this.emailSendTask = this.emailSendTask.filter(x=>x.sendTaskStatus == this.taskStatus);
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
        filter((result) => result),
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
        this.emailSendTask = this.emailSendTask.filter(x=>x.sendTaskStatus == this.taskStatus);
      });
  }
}
