import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, inject, Input, OnInit, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, filter, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { CreateEmailTaskDialogComponent } from '../../dialog/create-email-task-dialog/create-email-task-dialog.component';
import { EmailSendTask, Sample } from '../../models/model';
import { SendlerService } from '../../services/sendler.service';

@Component({
  selector: 'app-email-task-form',
  templateUrl: './email-task-form.component.html',
  styleUrls: ['./email-task-form.component.css'],
  standalone: false,
})
export class EmailTaskFormComponent implements OnInit {
  emailTask: EmailSendTask = new EmailSendTask();
  loading: boolean = false;
  @Input() createDialog: MatDialogRef<CreateEmailTaskDialogComponent> | null = null;
  @Input() addHtml: boolean = true;
  @Input() sample: Sample | null = null;
  @Input() navigate: boolean = true;
  readonly panelOpenState = signal(false);
  
  private readonly _adapter =
    inject<DateAdapter<unknown, unknown>>(DateAdapter);

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private sendlerService: SendlerService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this._adapter.setLocale('ru-RU');
  }

  submit(form: NgForm) {
    for (let i in form.controls) {
      form.controls[i].markAsTouched();
      if (form.controls[i].invalid) {
        let invalidControl: any = '';
        invalidControl = this.el.nativeElement.querySelector(
          '[name="' + i + '"]'
        );
        if (!!invalidControl) invalidControl.focus();
        break;
      }
    }

    if (form.invalid) {
      return;
    }

    if (!this.emailTask.csvData) {
      throw new Error('CSV файл для отправки не загружен');
    }

    if (this.sample) {
      this.emailTask.htmlMessage = this.sample.htmlString;
    }

    if (!this.emailTask.htmlMessage) {
      throw new Error('Html файл для отправки не загружен');
    }

    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          label: 'Создать рассылку',
          message: `Вы хотите создать рассылку email:  ${this.emailTask.name}?`,
        },
      })
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => {
          this.loading = true;
          return this.sendlerService.CreateSendTask(this.emailTask);
        }),
        catchError((error) => {
          this.loading = false;
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        })
      )
      .subscribe((result) => {
        this.loading = false;
        if (this.createDialog) {
          this.createDialog.close(this.sample);
        }
        if (this.navigate) {
          this.router.navigate(['/all-email-task/created']);
        }
      });
  }
}
