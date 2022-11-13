declare var require: any;
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import * as Highcharts from 'highcharts/highstock';
import HIndicatorsAll from "highcharts/indicators/indicators-all";
import HAccessability from "highcharts/modules/accessibility";
import HDragPanes from "highcharts/modules/drag-panes";
import HBrandDark from "highcharts/themes/brand-dark"
import HAnnotationsAdvanced from "highcharts/modules/annotations-advanced";
import HPriceIndicator from "highcharts/modules/price-indicator";
import HStockTools from "highcharts/modules/stock-tools";
import { CoinMarketChartResponse } from "src/app/models/coin-gecko";
import { ChartService } from "../chart.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

HIndicatorsAll(Highcharts);
HDragPanes(Highcharts);
HAnnotationsAdvanced(Highcharts);
HPriceIndicator(Highcharts);
HStockTools(Highcharts);
HBrandDark(Highcharts);
HAccessability(Highcharts);

@Component({
  selector: 'app-coin-chart',
  templateUrl: './coin-chart.component.html',
  styles: [`#container {
    max-height: 900px;
    height: 75vh;
}
`]
})
export class CoinChartComponent implements OnInit, OnDestroy, OnChanges {
  /** price | marketcap | volume | ohlc */
  @Input('chartDataType') chartDataType: string;
  @Output() loading: EventEmitter<boolean> = new EventEmitter();
  // @Input('sourceChangedEmitter') sourceChanged: Observable<any>;

  chartOptions: any;
  prices: Array<Array<number>>;
  market_caps: Array<Array<number>>;
  total_volumes: Array<Array<number>>;

  upColor = '#ec0000';
  upBorderColor = '#8A0000';
  downColor = '#00da3c';
  downBorderColor = '#008F28';

  Highcharts: typeof Highcharts = Highcharts;
  ohlc = [];
  volume = [];
  destroySubject$ = new Subject();

  constructor(
    public chartService: ChartService
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.reload();
  }
  
  ngOnDestroy(): void {
    this.chartService.masterData.next({} as CoinMarketChartResponse);
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }

  setChartData(responseData: CoinMarketChartResponse) {
    this.prices = responseData.prices;
    this.total_volumes = responseData.total_volumes;
    this.market_caps = responseData.market_caps;
  }


  ngOnInit() {
    this.reload();
  }

  reload() {
    this.loading.emit(true);
    this.chartService.masterData.pipe(
      takeUntil(this.destroySubject$)
    ).subscribe(
      (responseData) => {
        this.setChartData(responseData);
        if (this.chartDataType === 'ohlc') {
          this.chartOptions = this.getOHLCChartOptions();
        } else { // Default to Price/Volume
          this.chartOptions = this.getPriceAndVolumeChartOptions();
        }
      }, () => {
        this.loading.emit(false);
      }, () => {
        this.loading.emit(false);
      }
    );
  }


  getPriceAndVolumeChartOptions() {
    return {
      title: {
        text: this.chartService.coinName
      },
      yAxis: [{
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Price'
        },
        height: '80%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '80%',
        height: '20%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },
      responsive: {
      },
      series: [{
        type: 'line',
        name: '$USD',
        data: this.prices
      },
      {
        type: "column",
        name: 'Total',
        data: this.total_volumes,
        yAxis: 1
      }],
      rangeSelector: {
        selected: '1m',
      },
    };
  }

  getOHLCChartOptions() {
    return {
      yAxis: [
        {
          labels: {
            align: "left"
          },
          height: "80%",
          resize: {
            enabled: true
          }
        },
        {
          labels: {
            align: "left"
          },
          top: "80%",
          height: "20%",
          offset: 0
        }
      ],
      tooltip: {
        shape: "square",
        headerShape: "callout",
        borderWidth: 0,
        shadow: false,
        positioner: function (width, height, point) {
          let chart = this.chart;
          let position;
          //console.log("chart:",chart);
          if (point.isHeader) {
            position = {
              x: Math.max(
                // Left side limit
                chart.plotLeft,
                Math.min(
                  point.plotX + chart.plotLeft - width / 2,
                  // Right side limit
                  chart.chartWidth - width - chart.marginRight
                )
              ),
              y: point.plotY
            };
          } else {
            position = {
              x: point.series.chart.plotLeft,
              y: point.series.yAxis.top - chart.plotTop
            };
          }

          return position;
        }
      },
      series: [
        {
          type: "ohlc",
          id: this.chartService.coinId + '-ohlc',
          name: this.chartService.coinId + " Price",
          data: this.ohlc
        },
        {
          type: "column",
          id: this.chartService.coinId + "-volume",
          name: this.chartService.coinId + " Volume",
          data: this.volume,
          yAxis: 1
        }
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 800
            },
            chartOptions: {
              rangeSelector: {
                inputEnabled: false
              }
            }
          }
        ]
      }
    }
  }


}