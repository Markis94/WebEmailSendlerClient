import {
  Component,
  input,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewChartComponent } from '../../dialog/view-chart/view-chart.component';
import { ChartData } from '../../models/model';

@Component({
  selector: 'app-chart-board',
  templateUrl: './chart-board.component.html',
  styleUrls: ['./chart-board.component.css'],
  standalone: false,
})
export class ChartBoardComponent implements OnInit {
  chartDataOne = input<ChartData | null>(null);
  chartDataTwo = input<ChartData | null>(null);
  chartDataThee = input<ChartData | null>(null);
  
  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit() {
  }

  view(chartType: string, chartData: ChartData) {
    this.dialog.open(ViewChartComponent, {
      width: '800px',
      data: {
        chartData: chartData,
        chartType: chartType,
      },
    });
  }
}
