import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertComponent } from './alert/alert.component';
import { FileLoadComponent } from './components/file-load/file-load.component';
import { CustomInputComponent } from './components/form/custom-Input/custom-Input.component';
import { CustomInputPasswordComponent } from './components/form/custom-input-password/custom-input-password.component';
import { CustomSelectComponent } from './components/form/custom-select/custom-select.component';
import { CustomTextareaComponent } from './components/form/custom-textarea/custom-textarea.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [
    CustomInputComponent,
    CustomInputPasswordComponent,
    CustomSelectComponent,
    CustomTextareaComponent,
    AlertComponent,
    FileLoadComponent,
  ],
  exports: [
    CustomInputComponent,
    CustomInputPasswordComponent,
    CustomSelectComponent,
    CustomTextareaComponent,
    FileLoadComponent,
    AlertComponent,
  ],
})
export class SharedModule {}
