import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-danger',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() errorText: string = ""
  @Input() class:string = "view-error-danger";

  constructor() { }

  ngOnInit() {
  }

}
