import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService, DialogType, AlertMessage, MessageSeverity } from '../../services/alert.service';
require('chart.js');



@Component({
    selector: 'statistics-demo',
    templateUrl: './statistics-demo.component.html',
    styleUrls: ['./statistics-demo.component.css']
})
export class StatisticsDemoComponent implements OnInit, OnDestroy {

    chartData: Array<any> = [
        { data: [0, 5, 3, 1, 5, 0], label: 'Eye' },
        { data: [0, 0, 0, 8, 6, 2], label: 'Diabetes' },
        { data: [3, 4, 7, 9, 0, 2], label: 'Headache' }
    ];
    chartLabels: Array<any> = ['2012', '2013', '2014', '2015', '2016', '2017'];
    chartOptions: any = {
        responsive: true,
        title: {
            display: false,
            fontSize: 16,
            text: 'Medical History'
        }
    };
    chartColors: Array<any> = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // something else
            backgroundColor: 'rgba(128,128,128,0.2)',
            borderColor: 'rgba(128,128,128,1)',
            pointBackgroundColor: 'rgba(128,128,128,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(128,128,128,0.8)'
        }
    ];
    chartLegend: boolean = true;
    chartType: string = 'line';

    //timerReference: any;



    constructor(private alertService: AlertService) {
    }


    ngOnInit() {
        //this.timerReference = setInterval(() => this.randomize(), 5000);
    }

    ngOnDestroy() {
        //clearInterval(this.timerReference);
    }



    randomize(): void {
        let _chartData: Array<any> = new Array(this.chartData.length);
        for (let i = 0; i < this.chartData.length; i++) {
            _chartData[i] = { data: new Array(this.chartData[i].data.length), label: this.chartData[i].label };

            for (let j = 0; j < this.chartData[i].data.length; j++) {
                _chartData[i].data[j] = Math.floor((Math.random() * 10) + 2);
            }
        }

        this.chartData = _chartData;
    }


    changeChartType(type: string) {
        this.chartType = type;
    }

    showMessage(msg: string): void {
        this.alertService.showMessage("Demo", msg, MessageSeverity.info);
    }

    showDialog(msg: string): void {
        this.alertService.showDialog(msg, DialogType.prompt, (val) => this.configure(true, val), () => this.configure(false));
    }

    configure(response: boolean, value?: string) {

        if (response) {

            this.alertService.showStickyMessage("Simulating...", "", MessageSeverity.wait);

            setTimeout(() => {

                this.alertService.resetStickyMessage();
                this.alertService.showMessage("Demo", `Your settings was successfully configured to \"${value}\"`, MessageSeverity.success);
            }, 2000);
        }
        else {
            this.alertService.showMessage("Demo", "Operation cancelled by user", MessageSeverity.default);
        }
    }



    // events
    chartClicked(e: any): void {
        console.log(e);
    }

    chartHovered(e: any): void {
        console.log(e);
    }
}