import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-viewHtmlBody',
    templateUrl: './viewHtmlBody.component.html',
    styleUrls: ['./viewHtmlBody.component.css'],
    standalone: false
})
export class ViewHtmlBodyComponent implements OnInit, OnDestroy {
  constructor(
    private sanitizer: DomSanitizer,
    public dialog: MatDialogRef<ViewHtmlBodyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ViewInputData
  ) {}
  iframeSrc: SafeResourceUrl | undefined;

  ngOnInit() {
    const blob = new Blob([this.data?.htmlString ?? ''], {
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
class ViewInputData {
  name: string | undefined;
  htmlString: string | undefined;
}