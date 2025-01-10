import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatTooltipModule } from "@angular/material/tooltip";
const modules = [
  ScrollingModule,
  MatPaginator,
  MatButtonModule,
  MatDividerModule,
  MatDialogModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSort,
  MatInputModule,
  MatTimepickerModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatTableModule,
  MatSelectModule,
  MatSortModule,
  MatTabsModule,
  MatCheckboxModule,
  MatTooltipModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
