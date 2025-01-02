import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, filter } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { EmailSendTask } from '../models/model';
import { SendlerApiService } from '../services/sendlerApi.service';

@Component({
  selector: 'app-create-email-task',
  templateUrl: './create-email-task.component.html',
  styleUrls: ['./create-email-task.component.css'],
})
export class CreateEmailTaskComponent implements OnInit {
  emailTask: EmailSendTask = new EmailSendTask();
  loading: boolean = false;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private sendlerApiService: SendlerApiService,
    private el: ElementRef
  ) {}

  ngOnInit() {}

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
          this.emailTask.startDate = new Date(Date.now());
          return this.sendlerApiService.CreateEmailSendTask(this.emailTask);
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
        this.router.navigate(['/all-email-task/created']);
        console.log(result);
      });
  }

  onHtmlSelected(event: any) {
    this.emailTask.htmlMessage = null;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.emailTask.htmlMessage = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  }

  onCsvSelected(event: any) {
    this.emailTask.csvData = null;
    if (event.target.files && event.target.files[0]) {
      this.emailTask.csvData = null;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.emailTask.csvData = e.target.result;
      };
    }
  }
}
