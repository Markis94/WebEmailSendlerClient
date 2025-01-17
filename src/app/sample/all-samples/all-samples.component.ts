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
import { MatTableDataSource } from '@angular/material/table';
import { catchError, filter, Observable, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { CreateEmailTaskDialogComponent } from '../../dialog/create-email-task-dialog/create-email-task-dialog.component';
import { CreateSampleComponent } from '../../dialog/create-sample/create-sample.component';
import { SendTestMessageComponent } from '../../dialog/send-test-message/send-test-message.component';
import { ViewHtmlBodyComponent } from '../../dialog/viewHtmlBody/viewHtmlBody.component';
import { Sample } from '../../models/model';
import { SampleService } from '../../services/sample.service';

@Component({
  selector: 'app-all-samples',
  templateUrl: './all-samples.component.html',
  styleUrls: ['./all-samples.component.css'],
  standalone: false,
})
export class AllSamplesComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private sampleService: SampleService
  ) {}
  samples$!: Observable<Array<Sample>>;
  pageSize: number = 15;
  length: number = 0;
  pageSizeOptions: Array<number> = [15, 25, 50, 100];
  columns: string[] = ['name', 'createDate', 'changeDate', 'action'];
  private destroyRef = inject(DestroyRef);
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'createDate', 'changeDate', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.init();
  }

  init() {
    this.samples$ = this.sampleService.GetSamples().pipe(
      tap((result) => {
        this.length = result.length;
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
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

  createEmailTask(sample: Sample) {
    this.dialog.open(CreateEmailTaskDialogComponent, {
      data: sample,
    });
  }

  viewHtml(sample: Sample) {
    this.dialog.open(ViewHtmlBodyComponent, {
      data: {
        name: sample?.name,
        htmlString: sample?.htmlString,
      },
    });
  }

  sendTestMessage(sample: Sample) {
    this.dialog.open(SendTestMessageComponent, {
      data: sample,
    });
  }

  createSampleCopy(sample: Sample) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          label: 'Создать копию',
          message: `Вы хотите создать копию шаблона:  ${sample.name}?`,
        },
      })
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          return this.sampleService.CreateCopySample(sample);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result) => {
        this.init();
      });
  }

  addSampleView() {
    this.dialog
      .open(CreateSampleComponent, {
        data: {
          sample: new Sample(),
          file: true,
        },
      })
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
          return this.sampleService.DeleteSample(sample.id);
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.init();
      });
  }
}
