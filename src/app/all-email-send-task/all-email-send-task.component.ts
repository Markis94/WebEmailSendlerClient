import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { catchError, filter, first, Observable, of, switchMap, tap } from 'rxjs';
import { EmailSendTask } from '../models/model';
import { SendlerApiService } from '../services/sendlerApi.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-email-send-task',
  templateUrl: './all-email-send-task.component.html',
  styleUrls: ['./all-email-send-task.component.css'],
})
export class AllEmailSendTaskComponent implements OnInit {
  emailSendTask$?: Observable<Array<EmailSendTask>>;
  constructor(private sendlerApiService: SendlerApiService,
    private activateRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }
  isLoading = false;
  
  ngOnInit() {
    this.activateRoute.params.pipe(
      switchMap((params) => {
        this.isLoading = true;
        this.cdr.markForCheck();
        return this.sendlerApiService.GetEmailSendTaskByStatus(
          params["type"]
        ).pipe(first());
      })
    ).subscribe({
      next: (tasks) => {
        this.emailSendTask$ = of(tasks); // Устанавливаем данные
        this.isLoading = false; // Останавливаем загрузку
        this.cdr.markForCheck(); // Уведомляем Angular
      },
      error: () => {
        this.isLoading = false; // Даже в случае ошибки
        this.cdr.markForCheck();
      },
    });
  }
}
