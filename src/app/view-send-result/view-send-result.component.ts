import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  map,
  merge,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { EmailSendData, EmailSendTask, SendInfo } from '../models/model';
import { SendlerService } from '../services/sendler.service';

@Component({
  selector: 'app-view-send-result',
  templateUrl: './view-send-result.component.html',
  styleUrls: ['./view-send-result.component.css'],
  standalone: false,
})
export class ViewSendResultComponent implements OnInit, AfterViewInit {
  columns: Array<any> = [
    { columnDef: 'id', header: 'ID' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'sendDate', header: 'Дата отправки' },
    { columnDef: 'isSuccess', header: 'Статус отправки' },
    { columnDef: 'errorMessage', header: 'Ошибка' },
  ];
  emailInfo$!: Observable<SendInfo>;
  pageSize: number = 10;
  pageSizeOptions: Array<number> = [10, 20, 50, 100];
  displayedColumns: string[] = [];
  data: EmailSendData[] = [];
  inputValue: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroyRef = inject(DestroyRef);

  result: string = '';

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  emailSendTask!: EmailSendTask;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sendlerApiService: SendlerService
  ) {}

  ngOnInit() {
    let route = Number(this.route.snapshot.paramMap.get('id'));
    if (!!route) {
      this.emailInfo$ = this.sendlerApiService.GetSendTaskInfo(route);
      this.sendlerApiService
        .GetSendTaskById(route)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result) => {
          this.emailSendTask = result;
          this.updateData('');
        });
    }

    this.displayedColumns = this.columns.map((x) => x.columnDef);
  }

  ngAfterViewInit() {
    this.sort?.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.paginator._intl.itemsPerPageLabel = 'Показать';
    this.paginator._intl.firstPageLabel = 'В начало';
    this.paginator._intl.lastPageLabel = 'В конец';
    this.paginator._intl.nextPageLabel = 'Далее';
    this.paginator._intl.previousPageLabel = 'Назад';
  }

  saveToCsv() {
    this.sendlerApiService.GetEmailResultCsV(this.emailSendTask.id);
  }

  Find(inputValue: string) {
    if (!inputValue) {
      return;
    }
    this.updateData(inputValue);
  }

  Reset(inputValue: string) {
    if (!inputValue) {
      this.updateData(inputValue);
    }
  }

  updateData(inputValue: string) {
    merge(this.sort?.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.pageSize = this.paginator.pageSize;
          this.isLoadingResults = true;
          return this.sendlerApiService
            .GetEmailResultPath(
              inputValue,
              this.emailSendTask?.id,
              this.paginator.pageIndex,
              this.paginator.pageSize,
              this.sort.active,
              this.sort.direction
            )
            .pipe(catchError(() => of(null)));
        }),
        map((data) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;
          if (data === null) {
            return [];
          }
          this.resultsLength = data.totalCount;
          return data.items;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => (this.data = data));
  }
}
