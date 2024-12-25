import { CommonModule, DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { EmailEditorModule } from 'angular-email-editor';
import { AllEmailSendTaskComponent } from './all-email-send-task/all-email-send-task.component';
import { TaskItemComponent } from './all-email-send-task/task-item/task-item.component';
import { TaskTableComponent } from './all-email-send-task/task-table/task-table.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { CreateEmailTaskComponent } from './create-email-task/create-email-task.component';
import { CustomErrorHandler } from './custom-error-handler';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import { CreateSampleComponent } from './dialog/create-sample/create-sample.component';
import { InformComponent } from './dialog/inform/inform.component';
import { ViewHtmlBodyComponent } from './dialog/viewHtmlBody/viewHtmlBody.component';
import { EmailCreatorComponent } from './email-creator/email-creator.component';
import { HomeComponent } from './home/home.component';
import { AllSamplesComponent } from './sample/all-samples/all-samples.component';
import { SharedModule } from './shared/shared.module';
import { ViewSendResultComponent } from './view-send-result/view-send-result.component';
@NgModule({
  declarations: [			
    AppComponent,
    EmailCreatorComponent,
    ConfirmDialogComponent,
    InformComponent,
    CreateEmailTaskComponent,
    HomeComponent,
    AllEmailSendTaskComponent,
    TaskItemComponent,
    TaskTableComponent,
    ViewSendResultComponent,
    ViewHtmlBodyComponent, 
    CreateSampleComponent,
    AllSamplesComponent
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    BrowserModule,
    EmailEditorModule,
    MatButtonModule,
    MatDialogModule,
    AppRoutingModule,
    MatPaginator,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSort,
    MatCheckboxModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatTabsModule,
    SharedModule,
  ],
  providers: [
    provideAnimationsAsync(),
    DatePipe,
    provideHttpClient(),
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
