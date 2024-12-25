import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, filter, Observable, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { CreateSampleComponent } from '../../dialog/create-sample/create-sample.component';
import { ViewHtmlBodyComponent } from '../../dialog/viewHtmlBody/viewHtmlBody.component';
import { Sample } from '../../models/model';
import { SendlerApiService } from '../../services/sendlerApi.service';

@Component({
  selector: 'app-all-samples',
  templateUrl: './all-samples.component.html',
  styleUrls: ['./all-samples.component.css'],
})
export class AllSamplesComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private sendlerApiService: SendlerApiService
  ) {}
  samples$!: Observable<Array<Sample>>;
  pageSize: number = 10;
  pageSizeOptions: Array<number> = [10, 20, 50, 100];
  columns: Array<any> = ['name', 'createDate', 'changeDate', 'action'];
  private destroyRef = inject(DestroyRef);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.init();
  }

  init() {
    this.samples$ = this.sendlerApiService.GetSample().pipe(
      tap(() => {
        if (this.paginator) {
          this.paginator._intl.itemsPerPageLabel = 'Показать';
          this.paginator._intl.firstPageLabel = 'В начало';
          this.paginator._intl.lastPageLabel = 'В конец';
          this.paginator._intl.nextPageLabel = 'Далее';
          this.paginator._intl.previousPageLabel = 'Назад';
        }
      })
    );
  }

  viewHtml(sample: Sample) {
    this.dialog.open(ViewHtmlBodyComponent, {
      data: {
        name: sample?.name,
        htmlString: sample?.htmlString,
      },
    });
  }

  addSampleView() {
    this.dialog
      .open(CreateSampleComponent)
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.init();
      });
  }

  deleteSample(sample: Sample) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          label: 'Удалить шаблон',
          message: `Вы хотите удалить шаблон:  ${sample.name}?`,
        },
      })
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          return this.sendlerApiService.DeleteSample(sample.id);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        })
      )
      .subscribe(() => {
        this.init();
      });
  }
}
