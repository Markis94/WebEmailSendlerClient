import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.css"],
})
export class ConfirmDialogComponent implements OnInit {
  label: string = "";
  message: string = "";
  constructor(
    public dialog: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.label = this.data?.label;
    this.message = this.data?.message;
  }

  reject(): void {
    this.dialog.close(false);
  }
  confirm(): void {
    this.dialog.close(true);
  }
}
