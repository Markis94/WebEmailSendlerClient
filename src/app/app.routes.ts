import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AllEmailSendTaskComponent } from './all-email-send-task/all-email-send-task.component';
import { CreateEmailTaskComponent } from './create-email-task/create-email-task.component';
import { EmailCreatorComponent } from './email-creator/email-creator.component';
import { HomeComponent } from './home/home.component';
import { AllSamplesComponent } from './sample/all-samples/all-samples.component';
import { SearchByEmailComponent } from './searchByEmail/searchByEmail.component';
import { ViewSendResultComponent } from './view-send-result/view-send-result.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'all-email-task/:type',
    component: AllEmailSendTaskComponent,
  },
  {
    path: 'create-email',
    component: EmailCreatorComponent,
  },
  {
    path: 'create-task',
    component: CreateEmailTaskComponent,
  },
  {
    path: 'view-task-result/:id',
    component: ViewSendResultComponent,
  },
  {
    path: 'all-samples',
    component: AllSamplesComponent,
  },
  {
    path: 'searchEmail',
    component: SearchByEmailComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
