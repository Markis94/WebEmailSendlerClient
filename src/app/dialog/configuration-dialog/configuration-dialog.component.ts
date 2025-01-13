import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-configuration-dialog',
  templateUrl: './configuration-dialog.component.html',
  styleUrls: ['./configuration-dialog.component.css'],
  standalone: false,
})
export class ConfigurationDialogComponent implements OnInit {
  constructor(public dialog: MatDialogRef<ConfigurationDialogComponent>) {}

  ngOnInit() {}
}
