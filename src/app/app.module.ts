import { CommonModule, DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { EmailEditorModule } from 'angular-email-editor';
import { AllEmailSendTaskComponent } from './all-email-send-task/all-email-send-task.component';
import { ChartBoardComponent } from './all-email-send-task/chart-board/chart-board.component';
import { TaskItemComponent } from './all-email-send-task/task-item/task-item.component';
import { TaskTableComponent } from './all-email-send-task/task-table/task-table.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { ChartsComponent } from './charts/charts.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { CreateEmailTaskComponent } from './create-email-task/create-email-task.component';
import { EmailTaskFormComponent } from './create-email-task/email-task-form/email-task-form.component';
import { CustomErrorHandler } from './custom-error-handler';
import { ConfigurationDialogComponent } from './dialog/configuration-dialog/configuration-dialog.component';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import { CreateEmailTaskDialogComponent } from './dialog/create-email-task-dialog/create-email-task-dialog.component';
import { CreateSampleComponent } from './dialog/create-sample/create-sample.component';
import { InformComponent } from './dialog/inform/inform.component';
import { SendTestMessageComponent } from './dialog/send-test-message/send-test-message.component';
import { UpdateSendTaskComponent } from './dialog/update-send-task/update-send-task.component';
import { ViewChartComponent } from './dialog/view-chart/view-chart.component';
import { ViewHtmlBodyComponent } from './dialog/viewHtmlBody/viewHtmlBody.component';
import { EmailCreatorComponent } from './email-creator/email-creator.component';
import { HomeComponent } from './home/home.component';
import { AllSamplesComponent } from './sample/all-samples/all-samples.component';
import { SampleFormComponent } from './sample/sample-form/sample-form.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { MaterialModule } from './shared/material';
import { SharedModule } from './shared/shared.module';
import { ViewSendResultComponent } from './view-send-result/view-send-result.component';
import { SearchByEmailComponent } from './searchByEmail/searchByEmail.component';

@NgModule({
  declarations: [							
    AppComponent,
    EmailCreatorComponent,
    ConfirmDialogComponent,
    InformComponent,
    CreateEmailTaskComponent,
    EmailTaskFormComponent,
    HomeComponent,
    AllEmailSendTaskComponent,
    TaskItemComponent,
    TaskTableComponent,
    ViewSendResultComponent,
    ViewHtmlBodyComponent, 
    CreateSampleComponent,
    AllSamplesComponent,
    SampleFormComponent,
    SendTestMessageComponent,
    UpdateSendTaskComponent,
    ConfigurationComponent,
    ConfigurationDialogComponent,
    CreateEmailTaskDialogComponent,
    ChartsComponent,
    ChartBoardComponent,
    ViewChartComponent,
    LoadingComponent,
      SearchByEmailComponent
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    BrowserModule,
    EmailEditorModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    SharedModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
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
