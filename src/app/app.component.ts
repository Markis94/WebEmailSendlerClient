import { MediaMatcher } from '@angular/cdk/layout';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
  protected readonly isMobile = signal(true);
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  
  constructor(
    private signalRService: AppSignalrService,
    private dialog: MatDialog
  ) {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () =>
      this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit() {
    this.signalRService.startConnection();
  }

  openConfig() {
    this.dialog
      .open(ConfigurationDialogComponent)
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {});
  }
}
