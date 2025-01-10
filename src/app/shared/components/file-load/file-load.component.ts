import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../dialog/confirm-dialog/confirm-dialog.component";
import { InformComponent } from "../../../dialog/inform/inform.component";
import { UploadFile } from "../../../models/model";

@Component({
    selector: "file-load",
    templateUrl: "./file-load.component.html",
    styleUrls: ["./file-load.component.css"],
    standalone: false
})
export class FileLoadComponent implements OnInit, OnDestroy {
  //список разрешённых файлов////
  fileTypes = [
    "pdf",
    "jpeg",
    "pjpeg",
    "gif",
    "webp",
    "png",
    "vnd.ms-excel",
    "vnd.openxmlformats-officedocument.wordprocessingml.document",
    "vnd.oasis.opendocument.text",
    "vnd.ms-excel.sheet.macroEnabled.12",
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "zip",
    "plain",
    "msword",
    "7zip",
    "tar",
    "rar",
    "gzip",
  ];

  @Input() maxFileSize: number = 50000; ///~1000кб -1мб
  @Input() label: string = "";
  @Output() responseFileList = new EventEmitter<UploadFile[] | null>();

  id = "file-" + Math.random();
  tempFileArray: UploadFile[] = [];
  sizeAllFiles: number = 0;
  percent = 0;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.clear();
  }
  /*-------------------------------- */
  createBase64Model(event: any) {
    let file = event.target.files[0];
    let tmpFileModel = new UploadFile();
    if (!this.checkFileSize(event)) {
      this.dialog.open(InformComponent, {
        data: {
          contentHeader: `Внимание!`,
          title: `${file.name} - не загружен. Общий объем файлов превышает допустимый!`,
        },
        height: "initial",
        width: "80vmin",
      });
      return;
    }
    if (this.checkFileType(event)) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let dataFile = reader?.result?.toString()??"";
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
        height: "initial",
        width: "80vmin",
      });
      return;
    }
  }

  /*------------Проверка ----------------- */
  checkFileType(event: any) {
    let tmpFile = event.target.files[0];
    let check = this.fileTypes.indexOf(tmpFile.type.split("/")[1]);
    if (check !== -1) {
      return true;
    } else {
      return false;
    }
  }
  //проверят файл на допустимый размер
  checkFileSize(event: any) {
    let tmpFile = event.target.files[0];
    let fileSize = tmpFile.size / 1000;
    let nextSizeFile = this.sizeAllFiles + fileSize;
    if (nextSizeFile <= this.maxFileSize) {
      return true;
    } else {
      return false;
    }
  }

  /*------Вызов окна выбора документа-------*/
  selectFiles() {
    const file_input = document.getElementById("uploader");
    file_input?.click();
  }

  /*------Удаление документа-------*/
  onDeleteDocument(fileName: string, event:any) {
    event.preventDefault();
    event.stopPropagation();
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          label: "Подтверждение",
          message: `Удалить документ?`,
        },
      })
      .afterClosed()
      .subscribe((result: Boolean) => {
        if (result) {
          this.tempFileArray = this.tempFileArray.filter(
            (m) => m.name !== fileName
          );
          this.sizeAllFiles = 0;
          this.tempFileArray.forEach((x) => {
            this.sizeAllFiles += x?.size??0;
          });
          this.percent = 100 / (this.maxFileSize / this.sizeAllFiles);
          this.responseFileList.emit(this.tempFileArray);
        } else {
          return;
        }
      });
  }

  clear() {
    try {
      this.tempFileArray.length = 0;
      this.percent = 0;
      this.sizeAllFiles = 0;
      this.responseFileList.emit(this.tempFileArray);
    } catch (ex) {}
  }

  ///конвертим всё что сунули в base64
  onAddDocument(event:any) {
    event.preventDefault();
    event.stopPropagation();
    let fileEvent =
      event.dataTransfer != null || event.dataTransfer != undefined
        ? event.dataTransfer.files
        : event.target.files;
    for (let i = 0; i < fileEvent.length; i++) {
      let file: File = fileEvent[i];
      let check = this.fileTypes.indexOf(file.type.split("/")[1]);
      if (this.sizeAllFiles + file.size / 1000 > this.maxFileSize) {
        this.dialog.open(InformComponent, {
          data: {
            contentHeader: `Внимание!`,
            title: `${file.name} - не загружен. Общий объем файлов превышает допустимый!`,
          },
          height: "initial",
          width: "80vmin",
        });
        return;
      }
      if (check !== -1) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          let dataFile = reader?.result?.toString();
          let tmpFileModel = new UploadFile();
          tmpFileModel.name = file.name;
          tmpFileModel.type = file.type;
          tmpFileModel.data = dataFile?.split(",")[1]??'';
          tmpFileModel.size = file.size / 1000;
          let checkCopy = this.tempFileArray
            .map((x) => x.name)
            .indexOf(tmpFileModel.name);
          if (checkCopy == -1) {
            if (this.sizeAllFiles + file.size / 1000 > this.maxFileSize) {
              return;
            }
            this.tempFileArray.push(tmpFileModel);
            let fileSize = 0;
            for (const iterator of this.tempFileArray.map((x) => x.size)) {
              fileSize += iterator??0;
            }
            this.sizeAllFiles = fileSize;
            this.percent = 100 / (this.maxFileSize / this.sizeAllFiles);
            this.responseFileList.emit(this.tempFileArray);
          }
        };
      } else {
        this.dialog.open(InformComponent, {
          data: {
            contentHeader: `Внимание!`,
            title: `${file.name} - не загружен. Недопустимый формат файла!`,
          },
          height: "initial",
          width: "80vmin",
        });
      }
    }
    event.target.value = "";
  }
  /*-------Эвенты на перетаскивание------*/
  onDrop(event:any) {
    event.preventDefault();
    event.stopPropagation();
    this.onAddDocument(event);
  }
  onDragOver(event:any) {
    event.preventDefault();
    event.stopPropagation();
  }
  onDragLeave(event:any) {
    event.preventDefault();
    event.stopPropagation();
  }
  /*----------------*/
}
