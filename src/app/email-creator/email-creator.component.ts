import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EmailEditorComponent } from 'angular-email-editor';
import { catchError, filter, of, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { CreateSampleComponent } from '../dialog/create-sample/create-sample.component';
import { SendTestMessageComponent } from '../dialog/send-test-message/send-test-message.component';
import { Sample } from '../models/model';
import { SampleService } from '../services/sample.service';

@Component({
  selector: 'app-email-creator',
  templateUrl: './email-creator.component.html',
  styleUrls: ['./email-creator.component.css'],
  standalone: false,
})
export class EmailCreatorComponent implements OnInit {
  @ViewChild(EmailEditorComponent)
  private emailEditor!: EmailEditorComponent;
  designJson: any = '';
  sample: Sample = new Sample();

  tools: any = {
    social: {
      properties: {
        icons: {
          value: {
            iconType: 'circle',
            icons: [
              { name: 'Telegram', url: 'https://t.me/GAZMRGNN_bot' },
              { name: 'VK', url: 'https://vk.com/gasvoprosnn' },
            ],
          },
        },
      },
    },
  };

  constructor(
    private dialog: MatDialog,
    private sampleService: SampleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap((result) => {
          if (!!result['sampleId']) {
            return this.sampleService.GetSampleById(result['sampleId'] ?? '');
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
      });
  }

  editorUndo() {
    this.emailEditor?.editor.undo();
  }

  editorRedo() {
    this.emailEditor?.editor.redo();
  }

  // called when the editor is created
  editorLoaded(event: any) {
    console.log('load', event);
  }
  // called when the editor has finished loading
  editorReady(event: any) {
    console.log('editorReady', event);
    if (this.sample?.jsonString) {
      this.loadDesign(this.sample?.jsonString ?? '');
    }
  }

  exportHtml() {
    this.emailEditor?.editor.exportHtml((data: any) =>
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
              if (this.sample?.id != 0) {
                this.updateDesign(this.sample);
              } else {
                this.createDesign(this.sample);
              }
            });
          }),
          catchError((error) => {
            if (error instanceof HttpErrorResponse) {
              throw new Error(
                error?.error?.error ?? 'Произошла ужасная ошибка'
              );
            }
            throw new Error('Произошла ужасная ошибка');
          })
        )
        .subscribe(() => {});
    });
  }

  private updateDesign(sample: Sample) {
    if (!sample?.name) {
      return;
    }
    this.sampleService.UpdateSample(sample).subscribe(() => {});
  }

  private createDesign(sample: Sample) {
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
      let fileName = `рассылка_json_${new Date(
        Date.now()
      ).getDate()}_${new Date(Date.now()).getMonth()}_${new Date(
        Date.now()
      ).getFullYear()}.json`;
      if (this.sample?.name) {
        fileName = `${this.sample.name}_json.json`;
      }
      this.saveJsonToFile(data, fileName);
    });
  }

  saveToHtmlFile() {
    this.emailEditor.editor.exportHtml((data: any) => {
      let fileName = `рассылка_html_${new Date(
        Date.now()
      ).getDate()}_${new Date(Date.now()).getMonth()}_${new Date(
        Date.now()
      ).getFullYear()}.html`;
      if (this.sample?.name) {
        fileName = `${this.sample.name}_html.html`;
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

  sendTestMessage() {
    let sample = new Sample();
    this.emailEditor.editor.exportHtml((data: any) => {
      sample.htmlString = data?.html as string;
    });
    this.dialog.open(SendTestMessageComponent, {
      data: sample,
    });
  }
}
