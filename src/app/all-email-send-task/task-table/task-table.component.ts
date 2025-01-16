import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, filter, finalize, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { UpdateSendTaskComponent } from '../../dialog/update-send-task/update-send-task.component';
import { ViewHtmlBodyComponent } from '../../dialog/viewHtmlBody/viewHtmlBody.component';
import {
  ChartData,
  EmailSendTask,
  SendInfo,
  SendTaskStatusEnum,
} from '../../models/model';
import { JobService } from '../../services/job.service';

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
  standalone: false,
})
export class TaskTableComponent implements OnInit, AfterViewInit {
  @Input() emailSendTasks: Array<EmailSendTask> = [];
  @Input() taskStatus: string = SendTaskStatusEnum.created;

  sendTaskStatusEnum = SendTaskStatusEnum;
  totalCount: SendInfo = new SendInfo();

  columnsToDisplay: Array<any> = [
    { columnDef: 'id', header: 'Id' },
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
  pageSize: number = 10;
  pageSizeOptions: Array<number> = [10, 15, 25, 50, 100];
  dataSource!: MatTableDataSource<EmailSendTask>;
  btnLocK: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //графики
  chartDataTwo = signal<ChartData>(new ChartData());
  chartDataThee = signal<ChartData>(new ChartData());
  chartDataOne = signal<ChartData>(new ChartData());

  constructor(
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private jobService: JobService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.emailSendTasks);
    this.calcData();
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Показать';
    this.paginator._intl.firstPageLabel = 'В начало';
    this.paginator._intl.lastPageLabel = 'В конец';
    this.paginator._intl.nextPageLabel = 'Далее';
    this.paginator._intl.previousPageLabel = 'Назад';
    this.dataSource.paginator = this.paginator;
  }

  ///графики и статистика
  calcData() {
    this.totalCount.maxCount = this.emailSendTasks.reduce(
      (acc, x) => acc + x.emailSendInfo.maxCount,
      0
    );
    this.totalCount.badSendCount = this.emailSendTasks.reduce(
      (acc, x) => acc + x.emailSendInfo.badSendCount,
      0
    );
    this.totalCount.successSendCount = this.emailSendTasks.reduce(
      (acc, x) => acc + x.emailSendInfo.successSendCount,
      0
    );
    if(this.taskStatus != SendTaskStatusEnum.created)
    {
      this.calculateChart();
    }
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
          this.btnLocK = true;
          return this.jobService.CreateSendJob(emailSendTask);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        }),
        finalize(() => {
          this.btnLocK = false;
        })
      )
      .subscribe((result) => {
        emailSendTask.jobId = result;
        emailSendTask.sendTaskStatus = SendTaskStatusEnum.started;
        this.emailSendTasks = this.emailSendTasks.filter(
          (x) => x.sendTaskStatus == this.taskStatus
        );
        this.dataSource = new MatTableDataSource(this.emailSendTasks);
        this.calcData();
        this.dataSource.paginator = this.paginator;
      });
  }

  reCreate(emailSendTask: EmailSendTask) {
    if (emailSendTask.sendTaskStatus === SendTaskStatusEnum.started) return;
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
          this.btnLocK = true;
          emailSendTask.startDate = new Date(Date.now());
          return this.jobService.ReCreateSendJob(emailSendTask);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        }),
        finalize(() => {
          this.btnLocK = false;
        })
      )
      .subscribe((result) => {
        emailSendTask.jobId = result;
        emailSendTask.sendTaskStatus = SendTaskStatusEnum.started;
        this.emailSendTasks = this.emailSendTasks.filter(
          (x) => x.sendTaskStatus == this.taskStatus
        );
        this.dataSource = new MatTableDataSource(this.emailSendTasks);
        this.calcData();
        this.dataSource.paginator = this.paginator;
      });
  }

  deleteTask(emailSendTask: EmailSendTask) {
    if (emailSendTask.sendTaskStatus === SendTaskStatusEnum.started) return;
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
          this.btnLocK = true;
          return this.jobService.DeleteSendJob(emailSendTask.id);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        }),
        finalize(() => {
          this.btnLocK = false;
        })
      )
      .subscribe(() => {
        emailSendTask.sendTaskStatus = SendTaskStatusEnum.deleted;
        this.emailSendTasks = this.emailSendTasks.filter(
          (x) => x.sendTaskStatus == this.taskStatus
        );
        this.dataSource = new MatTableDataSource(this.emailSendTasks);
        this.calcData();
        this.dataSource.paginator = this.paginator;
      });
  }

  abort(emailSendTask: EmailSendTask) {
    if (emailSendTask.sendTaskStatus !== SendTaskStatusEnum.started) return;
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
          this.btnLocK = true;
          return this.jobService.CancelSendJob(emailSendTask.id);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        }),
        finalize(() => {
          this.btnLocK = false;
        })
      )
      .subscribe(() => {
        emailSendTask.sendTaskStatus = SendTaskStatusEnum.cancel;
        this.emailSendTasks = this.emailSendTasks.filter(
          (x) => x.sendTaskStatus == this.taskStatus
        );
        this.dataSource = new MatTableDataSource(this.emailSendTasks);
        this.calcData();
        this.dataSource.paginator = this.paginator;
      });
  }
  
  private calculateChart()
  {
    const oneChartData = new ChartData();
    const resGroupByDate = this.groupByDate(this.emailSendTasks, (item) => item.createDate);
    oneChartData.name = 'Распределение по дате создания';
    oneChartData.data = resGroupByDate.map(x=>x.Count);
    oneChartData.labels = resGroupByDate.map(x=>x.Date);
    this.chartDataOne.set(oneChartData);

    const twoChartData = new ChartData();
    twoChartData.name = 'Статус отправки';
    twoChartData.data = [this.totalCount.maxCount-this.totalCount.badSendCount-this.totalCount.successSendCount, this.totalCount.badSendCount, this.totalCount.successSendCount];
    twoChartData.labels = ['Не отправлено','Отправлено с ошибками','Отправлено успешно'];
    this.chartDataTwo.set(twoChartData);

    const formatChartData = (data: Array<EmailSendTask>) => {
      return data.map((item) => {
        const startTime = new Date(item.startDate).getTime();
        const endTime = new Date(item.endDate).getTime();
        const duration = (endTime - startTime) < 0 ? 1000 : endTime - startTime;
        
        return {
          x: `${item.id}`,
          y: duration / 1000 / 60,
        };
      });
    }
    const chartData = formatChartData(this.emailSendTasks);

    const theeChartData = new ChartData();
    theeChartData.name = 'Продолжительность отправки (мин)';
    theeChartData.data = chartData.map(d=>d.y);
    theeChartData.labels = chartData.map(d=>d.x);
    this.chartDataThee.set(theeChartData);
  }

  private groupByDate<T>(results: T[], dateExtractor: (item: T) => Date): GroupedResult[] {
    const grouped = results.reduce((acc, curr) => {
      const dateObject = new Date(dateExtractor(curr));
      const dateKey = dateObject.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { Date: this.datePipe.transform(dateKey || new Date(Date.now()),'dd-MM-yyyy')!, Count: 0 };
      }
      acc[dateKey].Count++;
      return acc;
    }, {} as Record<string, GroupedResult>);
    return Object.values(grouped);
  }
}

interface GroupedResult {
  Date: string;
  Count: number;
}