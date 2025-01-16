import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChartType } from 'chart.js';
import { ChartData } from '../../models/model';

@Component({
  selector: 'app-view-chart',
  templateUrl: './view-chart.component.html',
  styleUrls: ['./view-chart.component.css'],
  standalone: false,
})
export class ViewChartComponent implements OnInit {
  chartData: ChartData = new ChartData();
  chartType: ChartType = 'bar';
  constructor(
    public dialog: MatDialogRef<ViewChartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data) {
      this.chartData = this.data.chartData;
      this.chartType = this.data.chartType;
    }
  }
}
