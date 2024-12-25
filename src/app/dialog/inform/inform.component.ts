import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-inform-success',
  templateUrl: './inform.component.html',
  styleUrls: ['./inform.component.css'],
})
export class InformComponent implements OnInit {
  inputData: InputData = new InputData();
  constructor(@Inject(MAT_DIALOG_DATA) public data: InputData) {}

  ngOnInit() {
    this.inputData.contentHeader = this.data?.contentHeader ?? '';
    this.inputData.title = this.data?.title ?? '';
    this.inputData.subTitle = this.data?.subTitle ?? '';
  }
}

class InputData {
  contentHeader: string = '';
  title: string = '';
  subTitle: string = '';
}
