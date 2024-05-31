import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as Chart from 'chart.js';
import html2canvas from 'html2canvas';
import { NgChartjsModule } from 'ng-chartjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent  implements OnInit {

  @Input() data: number[] = [];
  @Input() chartsLabels: Array<any> = new Array<any>();
  @Input() title: string = '';
  @Input() type: string = '';
  @Input() chartSelector: string = '';
  @Input() dateProperty: boolean = false;

  @Output() dateRangeSelected: EventEmitter<{ desde: any; hasta: any }> =
    new EventEmitter();

  @Output() userSelected: EventEmitter<string> = new EventEmitter();

  today = new Date();
  month = this.today.getMonth();
  year = this.today.getFullYear();

  form: any;

  lineChartData: Chart.ChartDataset[] = [];
  lineChartLegend = true;
  lineChartType: any = '';
  inlinePlugin: any;
  textPlugin: any;
  lineChartOptions: any = {
    responsive: false,
    maintainAspectRatio: false,
    onClick: this.handleClick.bind(this),
    layout:{
      padding: 20,
    }, 
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    // this.changeDetectorRef.detectChanges();
    this.IniciarChart();
  }

  handleClick(event: any, chartElement: any) {
    if (chartElement.length > 0) {
      const dataIndex = chartElement[0].index;
      const datasetIndex = chartElement[0].datasetIndex;
      this.userSelected.emit(this.chartsLabels[dataIndex]);      
    }
  }

  ngOnInit() {
    this.IniciarChart();
  }

  IniciarChart() {
    this.lineChartData = [
      {
        label: this.title,
        // fill: false,
        // tension: 0.1,
        // borderCapStyle: 'butt',
        // borderDash: [],
        // borderDashOffset: 0.0,
        // borderJoinStyle: 'miter',
        // pointBorderColor: 'rgba(75,192,192,1)',
        // pointBackgroundColor: '#fff',
        // pointBorderWidth: 1,
        // pointHoverRadius: 5,
        // pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        // pointHoverBorderColor: 'rgba(220,220,220,1)',
        // pointHoverBorderWidth: 2,
        // pointRadius: 1,
        // pointHitRadius: 10,
        data: this.data,
        backgroundColor: 
        [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: 
        [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
      },
    ];
    this.lineChartType = this.type;
  }
}