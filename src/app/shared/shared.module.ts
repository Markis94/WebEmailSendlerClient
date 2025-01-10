import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { FileLoadComponent } from './components/file-load/file-load.component';
import { CustomInputComponent } from './components/form/custom-Input/custom-Input.component';
import { CustomSelectComponent } from './components/form/custom-select/custom-select.component';
import { CustomTextareaComponent } from './components/form/custom-textarea/custom-textarea.component';
import { MaterialModule } from './material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [
    CustomInputComponent,
    CustomSelectComponent,
    CustomTextareaComponent,
    AlertComponent,
    FileLoadComponent,
  ],
  exports: [
    CustomInputComponent,
    CustomSelectComponent,
    CustomTextareaComponent,
    FileLoadComponent,
    AlertComponent,
  ],
})
export class SharedModule {}
