import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Sample } from '../../models/model';
import { SendlerApiService } from '../../services/sendlerApi.service';

@Component({
  selector: 'app-create-sample',
  templateUrl: './create-sample.component.html',
  styleUrls: ['./create-sample.component.css'],
})
export class CreateSampleComponent implements OnInit {
  sample: Sample = new Sample();
  loading: boolean = false;
  loadInFile:boolean = false;
  constructor(
    public dialog: MatDialogRef<CreateSampleComponent>,
    private sendlerApiService: SendlerApiService,
    private el: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: Sample
  ) {}

  ngOnInit() {
    if (this.data) {
      this.sample = this.data as Sample;
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

    if(this.loadInFile && (!!!this.sample.htmlString || !!!this.sample.jsonString)){
      return;
    }

    this.sendlerApiService.CreateSample(this.sample).subscribe((result) => {
      if (result) {
        this.sample = result;
        this.dialog.close(this.sample);
      }
    });
  }

  onSelectedJson(event: any) {
    this.sample.jsonString = '';
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.sample.jsonString = e.target?.result as string;
      };
    }
  }

  onSelectedHtml(event: any) {
    this.sample.htmlString = '';
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.sample.htmlString = e.target?.result as string;
      };
    }
  }
}
