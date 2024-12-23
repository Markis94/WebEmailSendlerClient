import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, input, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EmailSendTask } from '../../models/model';

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
})
export class TaskTableComponent implements OnInit, AfterViewInit {

  emailSendTask = input<Array<EmailSendTask>>([]);
  taskStatus:string = 'created'

  columnsToDisplay: Array<any> = [
    { columnDef: "name", header: "Название"},
    { columnDef: "subject", header: "Тема письма"},
    { columnDef: "createDate", header: "Дата создания", mask: "date"},
    { columnDef: "startDate", header: "Начало рассылки", mask: "dateTime"},
    { columnDef: "endDate", header: "Конец рассылки", mask: "dateTime"},
    { columnDef: "sendTaskStatus", header: "Статус"},
  ];

  columnsToDisplayWithExpand = [...this.columnsToDisplay.map(x => x.columnDef), 'info', 'expand'];
  expandedElement: any;

  length: number = 100;
  pageSize: number = 10;
  pageSizeOptions: Array<number> = [10, 15, 25, 50, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource!: MatTableDataSource<EmailSendTask>;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.emailSendTask());
  }

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource(this.emailSendTask());
    this.paginator._intl.itemsPerPageLabel = "Показать";
    this.paginator._intl.firstPageLabel = "В начало";
    this.paginator._intl.lastPageLabel = "В конец";
    this.paginator._intl.nextPageLabel = "Далее";
    this.paginator._intl.previousPageLabel = "Назад";
    this.dataSource.paginator = this.paginator;
  }
}


@Pipe({ name: "filterOnStatus" })
export class FilterOnStatus implements PipeTransform {
  transform(taskStatus: string, emailSendTask: Array<EmailSendTask> ) {
    return new MatTableDataSource(emailSendTask.filter(x=>x.sendTaskStatus == taskStatus));
  }
}
