import { Component, Input, model, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { ConfirmDialogComponent } from '../../../dialog/confirm-dialog/confirm-dialog.component';
import { InformComponent } from '../../../dialog/inform/inform.component';
import { UploadFile } from '../../../models/model';

@Component({
  selector: 'file-load',
  templateUrl: './file-load.component.html',
  styleUrls: ['./file-load.component.css'],
  standalone: false,
})
export class FileLoadComponent implements OnInit, OnDestroy {
  //список разрешённых файлов////
  fileTypes = ['csv', 'json', 'html'];

  @Input() label: string = '';
  @Input() fileType: string = 'html';

  id = 'file-' + Math.random();
  fileDataString = model<string | null>('');
  fileName: string = '';

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    this.clear();
  }
  
  /*-------------------------------- */
  createBase64Model(event: any) {
    let file = event.target.files[0];
    let tmpFileModel = new UploadFile();
    if (this.checkFileType(event)) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let dataFile = reader?.result?.toString() ?? '';
        tmpFileModel.name = file.name;
        tmpFileModel.type = file.type;
        tmpFileModel.data = dataFile;
        tmpFileModel.size = file.size / 1000;
      };
      return tmpFileModel;
    } else {
      this.dialog.open(InformComponent, {
        data: {
          contentHeader: `Внимание!`,
          title: `${file.name} - не загружен. Недопустимый формат файла!`,
        },
        height: 'initial',
        width: '80vmin',
      });
      return;
    }
  }

  /*------------Проверка ----------------- */
  checkFileType(event: any) {
    let tmpFile = event.target.files[0];
    let check = this.fileTypes.indexOf(tmpFile.type.split('/')[1]);
    if (check !== -1) {
      return true;
    } else {
      return false;
    }
  }

  /*------Вызов окна выбора документа-------*/
  selectFiles() {
    const file_input = document.getElementById(this.id);
    file_input?.click();
  }

  /*------Удаление документа-------*/
  onDeleteDocument(event: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) {
    event.preventDefault();
    event.stopPropagation();
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          label: 'Подтверждение',
          message: `Удалить документ?`,
        },
      })
      .afterClosed()
      .pipe(filter((result: boolean) => result == true))
      .subscribe(() => {
        this.clear();
      });
  }

  clear() {
    this.fileDataString.set('');
    this.fileName = '';
  }

  ///конвертим всё что сунули в base64
  onAddDocument(event: {
    preventDefault: any;
    stopPropagation: any;
    dataTransfer?: any;
    target?: any;
  }) {
    event.preventDefault();
    event.stopPropagation();
    let fileEvent =
      event.dataTransfer != null || event.dataTransfer != undefined
        ? event.dataTransfer.files
        : event.target.files;
    const file: File = fileEvent[0];
    let check = this.fileTypes.indexOf(file.type.split('/')[1]);
    if (check !== -1) {
      const reader = new FileReader();

      switch (this.fileType) {
        case 'html': {
          reader.readAsText(file);
          break;
        }
        case 'json': {
          reader.readAsText(file);
          break;
        }
        case 'csv': {
          reader.readAsDataURL(file);
          break;
        }
        default:{
          reader.readAsDataURL(file);
          break;
        }
      }
      reader.onload = () => {
        this.fileDataString.set(reader.result as string ?? '');
        this.fileName = file.name;
      };
    } else {
      this.dialog.open(InformComponent, {
        data: {
          contentHeader: `Внимание!`,
          title: `${file.name} - не загружен. Недопустимый формат файла!`,
        },
        height: 'initial',
        width: '80vmin',
      });
    }
    event.target.value = '';
  }
  /*-------Эвенты на перетаскивание------*/
  onDrop(event: { preventDefault: () => void; stopPropagation: () => void }) {
    event.preventDefault();
    event.stopPropagation();
    this.onAddDocument(event);
  }
  onDragOver(event: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) {
    event.preventDefault();
    event.stopPropagation();
  }
  onDragLeave(event: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) {
    event.preventDefault();
    event.stopPropagation();
  }
  /*----------------*/
}
