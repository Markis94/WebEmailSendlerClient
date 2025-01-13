import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationDialogComponent } from './dialog/configuration-dialog/configuration-dialog.component';
import { AppSignalrService } from './services/app-signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'WebEmailSendlerClient';
  private destroyRef = inject(DestroyRef);
  
  constructor(private signalRService: AppSignalrService, private dialog: MatDialog) {}
  ngOnInit() {
    this.signalRService.startConnection();
  }
  
  openConfig() {
    this.dialog
      .open(ConfigurationDialogComponent)
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        
      });
  }
}
