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
  constructor(
    public dialog: MatDialogRef<CreateSampleComponent>,
    private sendlerApiService: SendlerApiService,
    private el: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit() {
    if (this.data) {
      this.sample.sampleJson = this.data as string;
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

    this.sendlerApiService.CreateSample(this.sample).subscribe((result) => {
      if (result) {
        this.sample = result;
        this.dialog.close(this.sample);
      }
    });
  }

  onSelected(event: any) {
    this.sample.sampleJson = '';
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.sample.sampleJson = e.target?.result as string;
      };
    }
  }
}
