import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmailSendTask } from '../../models/model';

@Component({
  selector: 'app-viewHtmlBody',
  templateUrl: './viewHtmlBody.component.html',
  styleUrls: ['./viewHtmlBody.component.css'],
})
export class ViewHtmlBodyComponent implements OnInit, OnDestroy {
  emailSendTask!: EmailSendTask;
  constructor(
    private sanitizer: DomSanitizer,
    public dialog: MatDialogRef<ViewHtmlBodyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  iframeSrc: SafeResourceUrl | undefined;

  ngOnInit() {
    this.emailSendTask = this.data;
    const blob = new Blob([this.emailSendTask?.htmlMessage ?? ''], {
      type: 'text/html',
    });
    const url = URL.createObjectURL(blob);
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  ngOnDestroy(): void {
    if (this.iframeSrc) {
      const url = (this.iframeSrc as any).changingThisBreaksApplicationSecurity;
      URL.revokeObjectURL(url);
    }
  }
}
