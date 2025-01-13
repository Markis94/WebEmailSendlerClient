import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { ConfigurationDialogComponent } from '../dialog/configuration-dialog/configuration-dialog.component';
import { Configuration } from '../models/model';
import { ConfigurationService } from '../services/configuration.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
  standalone: false,
})
export class ConfigurationComponent implements OnInit {
  @Input() dialog!: MatDialogRef<ConfigurationDialogComponent>;
  loading: boolean = false;
  error: string = '';
  configuration: Configuration = new Configuration();
  private destroyRef = inject(DestroyRef);

  constructor(
    private configurationService: ConfigurationService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.configurationService
      .Configuration()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.configuration = data;
      });
  }

  submit(form: NgForm) {
    this.error = '';

    for (let i in form.controls) {
      form.controls[i].markAsTouched();
      if (form.controls[i].invalid) {
        let invalidControl = this.el.nativeElement.querySelector(
          '[name="' + i + '"]'
        );
        if (!!invalidControl) invalidControl.focus();
        break;
      }
    }
    if (form.invalid) {
      return;
    }

    if (
      this.configuration.threadCount < 1 ||
      this.configuration.threadCount > 999
    ) {
      this.error = 'Количество потоков должно быть в интервале 1 - 999';
      return;
    }

    if (this.configuration.emailPackSize < 1) {
      this.error = 'Размер пачки для отправки должен быть больше 0';
      return;
    }

    if (this.configuration.threadSleep < 0) {
      this.error = 'Количество потоков для отправки должно быть больше 0';
      return;
    }

    this.loading = true;
    this.configurationService
      .UpdateConfiguration(this.configuration)
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            this.error = error?.error?.error ?? 'Произошла ужасная ошибка';
            return of();
          }
          throw new Error('Произошла ужасная ошибка');
        })
      )
      .subscribe(() => {
        this.loading = false;
        if (this.dialog) {
          this.dialog.close();
        }
      });
  }
}
