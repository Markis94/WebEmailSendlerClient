import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
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
  newDesignJson: any = '';
  
  constructor(private sendlerApiService: SendlerApiService) {}

  ngOnInit() {
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
  // called when the editor is created
  editorLoaded(event: any) {
    this.sendlerApiService.GetSample().subscribe((result)=>{
      this.designJson = result;
      this.emailEditor.editor?.loadDesign(this.designJson);
    });
  }
  // called when the editor has finished loading
  editorReady(event: any) {
    console.log('editorReady');
  }

  exportHtml() {
    this.emailEditor.editor.exportHtml((data: any) =>
      console.log('exportHtml', data)
    );
  }

  saveToDefault()
  {
    this.emailEditor.editor.saveDesign((data: any) => {
      this.sendlerApiService.SaveSample(data).subscribe(()=>{});
    });
  }

  saveDesign() {
    this.emailEditor.editor.saveDesign((data: any) => {
      this.saveJsonToFile(data, 'sample.json');
    });
  }

  loadDesign() {
    if(this.newDesignJson)
    {
      const jsonObject = JSON.parse(this.newDesignJson);
      this.emailEditor?.editor?.loadDesign(jsonObject);
    }
  }

  onSelected(event: any) {
    this.newDesignJson = null;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.newDesignJson = e.target?.result as string;
      };
    }
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
