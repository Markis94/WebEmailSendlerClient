import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, combineLatest, filter, finalize, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { EmailSendTask, SendTaskStatusEnum } from '../models/model';
import { SendlerApiService } from '../services/sendlerApi.service';

@Component({
  selector: 'app-all-email-send-task',
  templateUrl: './all-email-send-task.component.html',
  styleUrls: ['./all-email-send-task.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AllEmailSendTaskComponent implements OnInit {
  emailSendTask$!: Observable<Array<EmailSendTask>>;
  leftDate: any;
  rightDate: any;
  selectControlLeftDate = new FormControl();
  selectControlRightDate = new FormControl();
  taskStatus:string = SendTaskStatusEnum.created;
  loading:boolean = false; // Состояние загрузки
  
  constructor(private sendlerApiService: SendlerApiService,
    private datePipe: DatePipe,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.leftDate = this.datePipe.transform(new Date(new Date(Date.now()).getTime() + 1000 * 60 * 60 * 24 * -2),
      "yyyy-MM-dd");
    this.rightDate = this.datePipe.transform(
      new Date(new Date(Date.now()).getTime() + 1000 * 60 * 60 * 24 * 2),
      "yyyy-MM-dd");
    this.selectControlLeftDate.setValue(this.leftDate);
    this.selectControlRightDate.setValue(this.rightDate);
    ///////////////  
    this.emailSendTask$ = combineLatest([
      this.selectControlLeftDate.valueChanges.pipe(startWith(this.selectControlLeftDate.value)),
      this.selectControlRightDate.valueChanges.pipe(startWith(this.selectControlRightDate.value)),
      this.activateRoute.params
    ])
      .pipe(
        map(([leftDate, rightDate, params]) => ({
          leftDate,
          rightDate,
          params
        })),
        filter((data) => !!data.leftDate && !!data.rightDate),
        tap((data) =>{ this.loading = true; this.taskStatus = data.params["type"]}),
        switchMap((data) =>
          this.sendlerApiService
            .GetEmailSendTaskByStatus(data.params["type"], data.leftDate, data.rightDate)
            .pipe(
              finalize(() => this.loading = false)
            )
        ),
        catchError((error) => {
          this.loading = false;
          return of([]);
        })
      );
  }
}