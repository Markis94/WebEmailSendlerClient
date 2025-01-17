import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  standalone: false
})
export class LoadingComponent implements OnInit {

  message = input<string>('Загрузка данных ...');
  constructor() { }

  ngOnInit() {
  }

}
