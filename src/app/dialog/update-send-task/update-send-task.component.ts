import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError } from 'rxjs';
import { EmailSendTask } from '../../models/model';
import { SendlerService } from '../../services/sendler.service';

@Component({
  selector: 'app-update-send-task',
  templateUrl: './update-send-task.component.html',
  styleUrls: ['./update-send-task.component.css'],
  standalone: false,
})
export class UpdateSendTaskComponent implements OnInit {
  loading: boolean = false;
  emailTask: EmailSendTask = new EmailSendTask();
  newEmailTask: EmailSendTask = new EmailSendTask();
  constructor(
    public dialog: MatDialogRef<UpdateSendTaskComponent>,
    private el: ElementRef,
    private sendlerService: SendlerService,
    @Inject(MAT_DIALOG_DATA) public data: EmailSendTask
  ) {}

  ngOnInit() {
    this.emailTask = this.data as EmailSendTask;
    this.newEmailTask = JSON.parse(JSON.stringify(this.emailTask));
  }

  update(form: NgForm) {
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
    this.loading = true;
    this.sendlerService
      .UpdateSendTask(this.newEmailTask)
      .pipe(
        catchError((error) => {
          this.loading = false;
          if (error instanceof HttpErrorResponse) {
            throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
          }
          throw new Error('Произошла ужасная ошибка');
        })
      )
      .subscribe((result) => {
        this.emailTask.name = result.name;
        this.emailTask.subject = result.subject;
        this.emailTask.startDate = result.startDate;
        this.loading = false;
        this.dialog.close(result);
      });
  }
}
