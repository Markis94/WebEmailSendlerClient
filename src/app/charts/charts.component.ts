import { AfterViewInit, Component, DestroyRef, inject, input, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import Chart, { ChartType } from 'chart.js/auto';
import { ChartData } from '../models/model';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
  standalone: false,
})
export class ChartsComponent implements OnInit, AfterViewInit {
  @Input() chartType: ChartType = 'bar';
  chartData = input<ChartData>();
  chartData$ = toObservable(this.chartData);
  width = input<number>(300);
  height = input<number>(300);
  chart!: Chart;

  id = 'chart-' + Math.random();
  private destroyRef = inject(DestroyRef);
  
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const ctx = document.getElementById(this.id) as HTMLCanvasElement;
    if (
      this.chartData() &&
      this.chartData()?.data &&
      this.chartData()?.labels &&
      this.chartData()!.data?.length > 0 &&
      ctx
    ) {
      this.chart = new Chart(ctx, {
        type: this.chartType,
        data: {
          labels: this.chartData()?.labels,
          datasets: [
            {
              label: this.chartData()?.name ?? '',
              data: this.chartData()!.data ?? '',
              borderWidth: 1,
              hoverOffset: 3
            },
          ],
        },
        options: {
          responsive:true,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            colors: {
              forceOverride: true
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  return `${context.label}: ${value}`;
                }
              }
            }
          }
        },
      });
    }
    this.chartData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: ChartData | undefined) => {
        if (res && this.chart) {
          const scaledData = res.data.map(value => value < 5 ? 5 : value);
          this.chart.data.datasets[0].data = res.data;
          this.chart.data.datasets[0].label = res.name ?? '';
          this.chart.data.labels = res.labels;
          this.chart.update('active');
        }
      });
  }
}
