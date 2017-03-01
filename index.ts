import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GanttChartComponent} from './src/gantt-chart.component';
import {TruncatePipe} from './src/truncate.pipe';

export * from './src/gantt-chart.component';
export * from './src/truncate.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GanttChartComponent,
    TruncatePipe
  ],
  exports: [
    GanttChartComponent,
    TruncatePipe
  ]
})
export class GanttChart {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GanttChart,
    };
  }
}
