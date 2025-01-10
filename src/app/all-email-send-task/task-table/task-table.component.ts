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
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, filter, finalize, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { UpdateSendTaskComponent } from '../../dialog/update-send-task/update-send-task.component';
import { ViewHtmlBodyComponent } from '../../dialog/viewHtmlBody/viewHtmlBody.component';
import { EmailSendTask, SendInfo, SendTaskStatusEnum } from '../../models/model';
import { JobService } from '../../services/job.service';

@Component({
    selector: 'app-task-table',
    templateUrl: './task-table.component.html',
    styleUrls: ['./task-table.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class TaskTableComponent implements OnInit, AfterViewInit {
  @Input() emailSendTask: Array<EmailSendTask> = [];
  @Input() taskStatus: string = SendTaskStatusEnum.created;

  totalCount:SendInfo = new SendInfo();

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

  pageSize: number = 15;
  pageSizeOptions: Array<number> = [15, 25, 50, 100];
  dataSource!: MatTableDataSource<EmailSendTask>;
  btnLocK:boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private jobService: JobService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.emailSendTask);
    this.calcTotal();
  }

  ngAfterViewInit() {
      this.paginator._intl.itemsPerPageLabel = 'Показать';
      this.paginator._intl.firstPageLabel = 'В начало';
      this.paginator._intl.lastPageLabel = 'В конец';
      this.paginator._intl.nextPageLabel = 'Далее';
      this.paginator._intl.previousPageLabel = 'Назад';
      this.dataSource.paginator = this.paginator;
  }

  calcTotal()
  {
    this.totalCount.maxCount = this.emailSendTask.reduce((acc, x) => acc + x.emailSendInfo.maxCount, 0);
    this.totalCount.badSendCount = this.emailSendTask.reduce((acc, x) => acc + x.emailSendInfo.badSendCount, 0);
    this.totalCount.successSendCount = this.emailSendTask.reduce((acc, x) => acc + x.emailSendInfo.successSendCount, 0);
  }

  view(emailSendTask: EmailSendTask) {
    this.dialog.open(ViewHtmlBodyComponent, {
      data: {
        name: emailSendTask?.name,
        htmlString: emailSendTask?.htmlMessage,
      },
    });
  }

  update(emailSendTask: EmailSendTask) {
    this.dialog.open(UpdateSendTaskComponent, {
      data: emailSendTask,
    });
  }

  start(emailSendTask: EmailSendTask) {
    if (emailSendTask.sendTaskStatus !== SendTaskStatusEnum.created) return;
    this.btnLocK = true;
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
          return this.jobService.CreateSendJob(emailSendTask);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        }),
        finalize(()=>{ this.btnLocK = false;})
      )
      .subscribe((result) => {
        emailSendTask.jobId = result;
        emailSendTask.sendTaskStatus = SendTaskStatusEnum.started;
        this.emailSendTask = this.emailSendTask.filter(
          (x) => x.sendTaskStatus == this.taskStatus
        );
        this.dataSource = new MatTableDataSource(this.emailSendTask);
        this.calcTotal();
        this.dataSource.paginator = this.paginator;
      });
  }

  reCreate(emailSendTask: EmailSendTask) {
    if (emailSendTask.sendTaskStatus === SendTaskStatusEnum.started) return;
    this.btnLocK = true;
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
          emailSendTask.startDate = new Date(Date.now());
          return this.jobService.ReCreateSendJob(emailSendTask);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        }),
        finalize(()=>{ this.btnLocK = false;})
      )
      .subscribe((result) => {
        emailSendTask.jobId = result;
        emailSendTask.sendTaskStatus = SendTaskStatusEnum.started;
        this.emailSendTask = this.emailSendTask.filter(
          (x) => x.sendTaskStatus == this.taskStatus
        );
        this.dataSource = new MatTableDataSource(this.emailSendTask);
        this.calcTotal();
        this.dataSource.paginator = this.paginator;
      });
  }

  deleteTask(emailSendTask: EmailSendTask) {
    if (emailSendTask.sendTaskStatus === SendTaskStatusEnum.started) return;
    this.btnLocK = true;
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
          return this.jobService.DeleteSendJob(emailSendTask.id);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        }),
        finalize(()=>{ this.btnLocK = false;})
      )
      .subscribe(() => {
        emailSendTask.sendTaskStatus = SendTaskStatusEnum.deleted;
        this.emailSendTask = this.emailSendTask.filter(
          (x) => x.sendTaskStatus == this.taskStatus
        );
        this.dataSource = new MatTableDataSource(this.emailSendTask);
        this.calcTotal();
        this.dataSource.paginator = this.paginator;
      });
  }

  abort(emailSendTask: EmailSendTask) {
    if (emailSendTask.sendTaskStatus !== SendTaskStatusEnum.started) return;
    this.btnLocK = true;
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
        switchMap(() => {
          return this.jobService.CancelSendJob(emailSendTask.id);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        }),
        finalize(()=>{ this.btnLocK = false;})
      )
      .subscribe(() => {
        emailSendTask.sendTaskStatus = SendTaskStatusEnum.cancel;
        this.emailSendTask = this.emailSendTask.filter(
          (x) => x.sendTaskStatus == this.taskStatus
        );
        this.dataSource = new MatTableDataSource(this.emailSendTask);
        this.calcTotal();
        this.dataSource.paginator = this.paginator;
      });
  }
}
