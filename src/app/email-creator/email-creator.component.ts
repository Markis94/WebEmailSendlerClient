import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EmailEditorComponent } from 'angular-email-editor';
import { catchError, filter, of, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { CreateSampleComponent } from '../dialog/create-sample/create-sample.component';
import { Sample } from '../models/model';
import { SendlerApiService } from '../services/sendlerApi.service';

@Component({
  selector: 'app-email-creator',
  templateUrl: './email-creator.component.html',
  styleUrls: ['./email-creator.component.css'],
})
export class EmailCreatorComponent implements OnInit {
  @ViewChild(EmailEditorComponent)
  private emailEditor!: EmailEditorComponent;
  designJson: any = '';
  sample: Sample = new Sample();

  constructor(
    private dialog: MatDialog,
    private sendlerApiService: SendlerApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap((result) => {
          if (!!result['sampleId']) {
            return this.sendlerApiService.GetSampleById(
              result['sampleId'] ?? ''
            );
          } else {
            return of(new Sample());
          }
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            throw new Error(err?.error?.error);
          }
          throw new Error('Ошибка при авторизации');
        })
      )
      .subscribe((result: Sample) => {
        if (result) {
          this.sample = result;
        }
        this.loadDesign(result.sampleJson ?? '');
      });
  }
  // called when the editor is created
  editorLoaded(event: any) {}
  // called when the editor has finished loading
  editorReady(event: any) {}

  exportHtml() {
    this.emailEditor.editor.exportHtml((data: any) =>
      console.log('exportHtml', data)
    );
  }

  saveDesign() {
    this.emailEditor.editor.saveDesign((data: string) => {   
      this.sample.sampleJson = JSON.stringify(data);   
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            label: 'Сохранить шаблон',
            message: `Вы хотите сохранить изменения в шаблоне: ${
              this.sample.name ?? ''
            }?`,
          },
        })
        .afterClosed()
        .pipe(
          filter((result) => result),
          tap(() => {
            if (this.sample?.id != 0) {
              this.updateDesign(this.sample);
            } else {
              this.sample = this.createDesign(this.sample.sampleJson);
            }
          }),
          catchError((error) => {
            if (error instanceof HttpErrorResponse) {
              throw new Error(error?.error?.error ?? 'Произошла ужасная ошибка');
            }
            throw new Error('Произошла ужасная ошибка');
          })
        )
        .subscribe(() => {});
    });
    // this.emailEditor.editor.saveDesign((data: any) => {
    //   this.saveJsonToFile(data, 'sample.json');
    // });
  }

  private updateDesign(sample: Sample) {
    this.sendlerApiService.UpdateSample(sample).subscribe(() => {});
  }
  private createDesign(sampleJson:string) {
    let sample = new Sample();
    this.dialog
    .open(CreateSampleComponent, {
      data: sampleJson,
    })
    .afterClosed()
    .subscribe((result) => {
      if (result) {
        sample = result;
      }
    });
    return sample;
  }

  loadDesign(designJson: string) {
    if (designJson) {
      const jsonObject = JSON.parse(designJson);
      this.emailEditor?.editor?.loadDesign(jsonObject);
    } else {
      this.emailEditor?.editor?.loadDesign({
        counters: {},
        body: {
          rows: [],
          values: {},
          id: undefined,
          headers: [],
          footers: [],
        },
        schemaVersion: 4,
      });
    }
  }

  onSelected(event: any) {
    this.designJson = null;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.designJson = e.target?.result as string;
      };
    }
  }

  saveToFile() {
    this.emailEditor.editor.exportHtml((data: any) => {
      let fileName = `рассылка_html_${new Date(Date.now()).getDate()}.html`;
      let htmlContent = data?.html;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      // Удаляем ссылку после завершения операции
      document.body.removeChild(link);
      // Освобождаем память от URL-объекта
      window.URL.revokeObjectURL(url);
    });
  }

  saveJsonToFile(jsonData: any, fileName: string): void {
    // Преобразуем данные в строку JSON
    const jsonString = JSON.stringify(jsonData, null, 2);
    // Создаем Blob (объект) с содержимым JSON
    const blob = new Blob([jsonString], { type: 'application/json' });
    // Создаем ссылку (элемент <a>), которая будет использоваться для загрузки файла
    const link = document.createElement('a');
    // Создаем URL для Blob
    const url = URL.createObjectURL(blob);
    // Устанавливаем атрибуты для элемента <a>
    link.href = url;
    link.download = fileName;
    // Программно кликаем по ссылке, чтобы инициировать скачивание файла
    document.body.appendChild(link);
    link.click();
    // Удаляем ссылку после завершения операции
    document.body.removeChild(link);
    // Освобождаем память от URL-объекта
    URL.revokeObjectURL(url);
  }
}
