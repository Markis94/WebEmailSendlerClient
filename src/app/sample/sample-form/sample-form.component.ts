import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateSampleComponent } from '../../dialog/create-sample/create-sample.component';
import { Sample } from '../../models/model';
import { SampleService } from '../../services/sample.service';

@Component({
  selector: 'app-sample-form',
  templateUrl: './sample-form.component.html',
  styleUrls: ['./sample-form.component.css'],
  standalone: false,
})
export class SampleFormComponent implements OnInit {
  @Input() sample: Sample = new Sample();
  @Input() dialog!: MatDialogRef<CreateSampleComponent>;
  @Input() file: boolean = false;
  loading: boolean = false;
  loadInFile: boolean = false;
  constructor(private sampleService: SampleService, private el: ElementRef) {}

  ngOnInit() {}
  
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

    if (
      this.loadInFile &&
      (!!!this.sample.htmlString || !!!this.sample.jsonString)
    ) {
      return;
    }

    this.sampleService.CreateSample(this.sample).subscribe((result) => {
      if (result) {
        this.sample = result;
        if (this.dialog) {
          this.dialog.close(this.sample);
        }
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
