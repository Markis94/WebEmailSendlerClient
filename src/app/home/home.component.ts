import { AfterViewInit, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfigurationDialogComponent } from '../dialog/configuration-dialog/configuration-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit, AfterViewInit{
  private destroyRef = inject(DestroyRef);
  constructor(private dialog: MatDialog, private router: Router) {}
  loading:boolean = true;
  
  ngOnInit() {}
  
  ngAfterViewInit() {
    setTimeout(()=>{
      this.loading = false;
    }, 3000)
  }

  openConfig() {
    this.dialog
      .open(ConfigurationDialogComponent)
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {});
  }
  createEmailTask() {
    this.router.navigate(["/create-task"]);
  }
  createSample() {
    this.router.navigate(["/create-email"]);
  }
}
