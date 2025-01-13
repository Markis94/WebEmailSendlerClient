import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Sample } from '../../models/model';

@Component({
  selector: 'app-create-email-task-dialog',
  templateUrl: './create-email-task-dialog.component.html',
  styleUrls: ['./create-email-task-dialog.component.css'],
  standalone: false,
})
export class CreateEmailTaskDialogComponent implements OnInit {
  sample: Sample = new Sample();
  constructor(
    public dialog: MatDialogRef<CreateEmailTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Sample
  ) {}

  ngOnInit() {
    this.sample = this.data as Sample;
  }
}
