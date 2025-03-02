import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http'; // اضافه کردن HttpClient

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, NgApexchartsModule]
})
export class HomePage implements OnInit { // اضافه کردن OnInit
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: ChartOptions;

  constructor(private http: HttpClient) { // تزریق HttpClient
    // مقدار اولیه برای جلوگیری از خطا قبل از لود داده‌ها
    this.chartOptions = {
      series: [{ name: 'Candlestick', data: [] }],
      chart: { type: 'candlestick', height: 350 },
      title: { text: 'نمودار شمعی نمونه', align: 'center' },
      xaxis: { type: 'datetime' }
    };
  }

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    this.http.get<any[]>('https://demo-live-data.highcharts.com/aapl-ohlc.json')
      .subscribe(data => {
        // تبدیل داده‌ها به فرمت ApexCharts
        const formattedData = data.map(item => [
          item[0], // timestamp
          [item[1], item[2], item[3], item[4]] // [open, high, low, close]
        ]);

        // آپدیت chartOptions با داده‌های جدید
        this.chartOptions = {
          ...this.chartOptions,
          series: [{
            name: 'Candlestick',
            data: formattedData
          }]
        };
      }, error => {
        console.error('خطا در لود داده‌ها:', error);
      });
  }
}