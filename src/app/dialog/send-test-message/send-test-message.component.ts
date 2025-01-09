import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Sample, TestSend } from '../../models/model';
import { SendlerService } from '../../services/sendler.service';

@Component({
  selector: 'app-send-test-message',
  templateUrl: './send-test-message.component.html',
  styleUrls: ['./send-test-message.component.css'],
})
export class SendTestMessageComponent implements OnInit {
  sample: Sample = new Sample();
  emailTestSend: TestSend = new TestSend();
  emailList!: Array<IEmailList>;
  maxLen: number = 10;
  viewParamsFields:boolean = false;

  l:string = "";
  s:string = "";
  t:string = "";

  constructor(
    public dialog: MatDialogRef<SendTestMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Sample,
    private sendlerApiService: SendlerService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.emailList = [{ id: 0, email: '' }];
    this.sample = this.data as Sample;
    this.emailTestSend.htmlString = this.sample.htmlString;
  }

  deleteItem(element: IEmailList)
  {
    if (this.emailList.length>1) {
      this.emailList = this.emailList.filter((x)=>x.id != element.id);
    }
  }

  addToList() {
    if (this.emailList.length < this.maxLen) {
      const maxID = Math.max(...this.emailList.map((email) => email.id));
      this.emailList.push({ id: maxID + 1, email: '' });
    }
  }

  create(form: NgForm) {
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
    this.emailTestSend.emails = this.emailList.map(x=>x.email);
    this.emailTestSend.htmlString = this.emailTestSend.htmlString.replace("{l}", this.l).replace("{s}", this.s).replace("{t}", this.t);
    this.sendlerApiService
      .SendTestMessage(this.emailTestSend)
      .subscribe({
        next: x => this.dialog.close(),
        error: err => console.error('An error occurred :', err),
        complete: () => console.log('There are no more action happen.')
      });
  }
}

interface IEmailList {
  id: number;
  email: string;
}
