import { Component, OnInit } from '@angular/core';
import { AppSignalrService } from './services/app-signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'WebEmailSendlerClient';

  constructor(private signalRService: AppSignalrService) {}
  ngOnInit() {
    this.signalRService.startConnection();
  }
}
