import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Sample } from '../../models/model';

@Component({
    selector: 'app-create-sample',
    templateUrl: './create-sample.component.html',
    styleUrls: ['./create-sample.component.css'],
    standalone: false
})
export class CreateSampleComponent implements OnInit {
  sample: Sample = new Sample();
  file: boolean = false;
  constructor(
    public dialog: MatDialogRef<CreateSampleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data) {
      this.sample = this.data.sample as Sample;
      this.file = this.data.file as boolean;
    }
  }
}
