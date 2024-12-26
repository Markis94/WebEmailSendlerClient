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
        this.loadDesign(result.jsonString ?? '');
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

  saveToServer() {
    this.emailEditor.editor.saveDesign((data: string) => {
      this.sample.jsonString = JSON.stringify(data);    
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
            this.emailEditor.editor.exportHtml((data: any) => {
              this.sample.htmlString = data?.html as string;
            });
            if (this.sample?.id != 0) {
              this.updateDesign(this.sample);
            } else {
              this.createDesign(this.sample);
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
  }

  private updateDesign(sample: Sample) {
    this.sendlerApiService.UpdateSample(sample).subscribe(() => {});
  }

  private createDesign(sample:Sample) {
    this.dialog
    .open(CreateSampleComponent, {
      data: sample,
    })
    .afterClosed()
    .subscribe((result) => {
      if (result) {
        this.sample = result;
      }
    });
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

  saveToJsonFile() {
    this.emailEditor.editor.saveDesign((data: any) => {
      let fileName = `рассылка_json_${new Date(Date.now()).getDate()}_${new Date(Date.now()).getMonth()}_${new Date(Date.now()).getFullYear()}.json`;
      if(this.sample?.name)
      {
        fileName = `${this.sample.name}_json.json`
      }
      this.saveJsonToFile(data, fileName);
    });
  }

  saveToHtmlFile() {
    this.emailEditor.editor.exportHtml((data: any) => {
      let fileName = `рассылка_html_${new Date(Date.now()).getDate()}_${new Date(Date.now()).getMonth()}_${new Date(Date.now()).getFullYear()}.html`;
      if(this.sample?.name)
      {
        fileName = `${this.sample.name}_html.html`
      }
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
