import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
@Component({
  selector: '[GanttChart]',
  template: `
  <div class="date">{{chartData.date|date:'mediumDate'}}</div>
  <div class="container">
    <svg [attr.viewBox]="viewBox" preserveAspectRatio="xMaxYMin meet" xmlns="http://www.w3.org/2008/svg" version="1.1">
      <!--grid Lines-->
     <line  *ngFor="let no of finalInterval; let i = index" y1="0" [attr.x2]="i*xAxisGap+startPos" [attr.x1]="i*xAxisGap+startPos" [attr.y2]="heightSpan*rectHeight" [attr.stroke]="lineColor" stroke-width="1"  />
      <!--X axis ticks-->
       <text class="tick" [attr.fill]="labelColor" *ngFor="let no of finalInterval; let i = index" [attr.x]="i*xAxisGap+startPos-5" [attr.y]="heightSpan*rectHeight+20" [attr.font-size]="fontSize">{{no}} </text>
       <!--Session labels-->
       <text *ngFor="let spec of finalTask; let i = index"  [attr.x]="spec.startPoint*xAxisGap*mFlag+startPos*mFlag" [attr.y]="i*rectHeight+mobileRect+ylabelAdjust" [attr.font-size]="fontSize" [attr.fill]="labelColor">
       {{spec.taskLabel | truncate:(spec.width*xAxisGap*span)/areaFacor*mFlag+dFlag*20}}
     <title>{{spec.taskLabel}}</title>
   </text>
    <rect  *ngFor="let spec of finalTask; let i = index" [attr.x]="spec.startPoint*xAxisGap+startPos" [attr.y]="i*rectHeight+mobileRect" [attr.fill]="rectColor" [attr.width]="spec.width*xAxisGap*span" height="30">
     <animate attributeName="width" from="0" [attr.to]="spec.width*xAxisGap*span" dur="1s" fill="freeze" />
    </rect>
    </svg>
  </div>
  `,
  styles: [`
    .container{
      width:96%;
      margin:0 auto;
      padding: 10px;
      border:1px solid black;
    }
    .date{
      font-size: 24px;
      padding:10px;
      margin-left:8px;
    }
    @media screen and (max-width: 767px) {
      .tick:nth-child(odd){
          display:none;
      }
    }
    `]
})
export class GanttChartComponent {
  defaultData: Object = {
    "date": "2017-02-09",
    "taskArray": [
      {
        "task": "Breakfast",
        "startTime": "8:30am",
        "endTime": "11:00am"
      },
    ]
  };
  @Input('chartOptions') public chartOptions: Object;
  @Input('chartData') public chartData: Object;
  lineColor:string="#808080" ;//for setting color of line
  labelColor:string="";
  rectColor: string = "#87ceeb"; //for setting color of rectangle in SVG
  mFlag: number = 0;   //Neutralizing the mobile factors in desktop
  dFlag: number = 1;   //Neutralizing the dekstop factors in mobile
  viewHeight: number;  //setting the viewBox height property according to length of taskArray
  startPos: number =200; //Start Poation of rectange and grid
  xAxisGap:number=40;//gap between grid Lines
  viewBox: string;
  rectHeight: number = 35; //gap between two rectangle
  finalTask: any[];
  finalInterval: any[];
  span: number;
  ylabelAdjust:number=15;
  heightSpan: number;
  labelHeight: number = 35;
  mobileRect: number = 0;
  fontSize: string = "16px";
  truncateLength: number = 10;
  areaFacor: number = 11;
  constructor() {
    Observable.fromEvent(window, 'resize')
      .debounceTime(100)
      .subscribe((event) => {
        this.reRender(event);
      });
  }
  /**
     * Represents a function to change viewBox propery of svg in mobile and dekstop
     */
  reRender(event) {
    var WindowWidth = event.currentTarget.innerWidth;
    if (WindowWidth < 767) {
      this.startPos = 10;
      this.rectHeight = 70;
      this.viewHeight = this.finalTask.length * this.rectHeight+20;
      this.viewBox = "0 0 600 " + this.viewHeight;
      this.labelHeight = 20;
      this.ylabelAdjust=-10;
      this.mobileRect = 30;
      this.fontSize = "20px";
      this.dFlag = 0;
      this.mFlag = 1;
      this.areaFacor = 11;
    }
    else {
      this.startPos = 200;
      this.viewHeight = this.finalTask.length * 35+20;
      this.viewBox = "0 0 800 " + this.viewHeight;
      this.labelHeight = 35;
      this.mobileRect = 0;
      this.rectHeight = 35;
      this.fontSize = "16px";
      this.dFlag = 1;
      this.mFlag = 0;
      this.areaFacor = 11;
      this.ylabelAdjust=15;
    }
    if (WindowWidth < 450) {
      this.fontSize = "28px";
      this.areaFacor = 15;
    }
  }
  ngOnInit() {
    this.makeGanttChart(this.chartData, this.chartOptions);
    var WindowWidth = window.innerWidth;
    if (WindowWidth < 767) {
      this.startPos = 10;
      this.rectHeight = 70;
      this.viewHeight = this.finalTask.length * this.rectHeight+20;
      this.viewBox = "0 0 600 " + this.viewHeight;
      this.labelHeight = 20;
      this.dFlag = 0;
      this.mFlag = 1;
      this.mobileRect = 30;
      this.fontSize = "20px";
      this.areaFacor = 11;
      this.ylabelAdjust=-10;
    }
    else {
      this.viewHeight = this.finalTask.length * 35+20;
      this.viewBox = "0 0 800 " + this.viewHeight;
    }
    if (WindowWidth < 450) {
      this.fontSize = "28px";
      this.areaFacor = 15;
    }
  }
  /**
     * Represents a function to convert 12 hour format timing to 24 hour format
     */
  convertTo24Hour(time) {
    var hours = parseInt(time.substr(0, 2));
    if (time.indexOf('am') != -1 && hours == 12) {
      time = time.replace('12', '0');
    }
    if (time.indexOf('am') != -1 && hours < 10) {
      time = time.replace(time, '0' + time);
    }
    if (time.indexOf('pm') != -1 && hours < 12) {
      time = time.replace(hours, (hours + 12));
    }
    return time.replace(/(am|pm)/, '');
  }
  findmaxTime(max, endTime) {
    var time = endTime.split(":");
    var HH = Number(time[0]);
    var MM = Number(time[1]);
    var time2 = HH + MM / 60;
    if (max < time2) {
      max = time2;
      return max;
    }
    else {
      return max;
    }
  }
  findminTime(min, endTime) {
    var time = endTime.split(":");
    var HH = Number(time[0]);
    var MM = Number(time[1]);
    var time2 = HH + MM / 60;
    if (min > time2) {
      min = time2;
      return min;
    }
    else {
      return min;
    }
  }
  findNumberOfTicks(min, max) {
    var maxInterval = Math.ceil(max - min);
    if (maxInterval < 5) {

      var ticks = {
        "noOfTicks": maxInterval * 4,
        "tickWidth": 0.25
      }
      return ticks;
    }
    else if (maxInterval >= 5 && maxInterval <= 8) {
      var ticks = {
        "noOfTicks": maxInterval * 2,
        "tickWidth": 0.5
      }
      return ticks;
    }
    else if (maxInterval > 16) {
      var ticks = {
        "noOfTicks": Math.ceil(maxInterval / 2),
        "tickWidth": 2
      }
      return ticks;
    }
    else {
      var ticks = {
        "noOfTicks": maxInterval,
        "tickWidth": 1
      }
      return ticks;
    }
  }
  makeGanttChart(ganttChartData, options) {
     if (options.rectColor !== undefined)
      this.rectColor = options.rectColor;
      if(options.lineColor!==undefined){
        this.lineColor=options.lineColor;
      }
      if(options.labelColor!==undefined){
        this.labelColor=options.labelColor;
      }
    if (ganttChartData.taskArray === undefined || ganttChartData.taskArray.length === 0)
      this.convertTimeScaleToSpace(this.defaultData);
    else
      this.convertTimeScaleToSpace(ganttChartData);

  }
  convertTimeScaleToSpace(ganttChartData) {
    var taskArray = [];
    var taskarray2 = [];
    var displayInterval = [];
    var min = 23, max = 0;
    var ticksObject: any;
    var count = 0;
    var hour;
    var minute;
    taskArray = ganttChartData.taskArray;
    for (var task of taskArray) {
      var taskObject: any = {};
      var startTime24HourFormat = this.convertTo24Hour(task.startTime);
      var endTime24HourFormat = this.convertTo24Hour(task.endTime);
      var startTime = startTime24HourFormat.split(":");
      var startPoint = Number(startTime[0]) + Number(startTime[1]) / 60;
      var endTime = endTime24HourFormat.split(":");
      var endPoint = Number(endTime[0]) + Number(endTime[1]) / 60;
      var width = endPoint - startPoint;
      taskObject = {
        "taskLabel": task.task,
        "startPoint": startPoint,
        "width": width,
      }
      taskarray2.push(taskObject);
      max = this.findmaxTime(max, endTime24HourFormat);
      min = this.findminTime(min, startTime24HourFormat);
      count++;
    }
    ticksObject = this.findNumberOfTicks(min, max);
    for (var i = 0; i < count; i++) {
      taskarray2[i].startPoint = taskarray2[i].startPoint - min;
    }
    this.finalTask = taskarray2;
    /*X Axis Interval Display */
    hour = Math.floor(min);
    minute = (min - hour) * 60;
    if (hour > 12) {
      hour = hour - 12;
    }
    if (minute === 0) {
      displayInterval.push(hour);
    }
    else {
      displayInterval.push(hour + ":" + minute);
    }

    for (var i = 0; i < Number(ticksObject.noOfTicks); i++) {
      if (Number(ticksObject.tickWidth) === 0.25) {
        this.span = 4;
        minute = minute + 15;
        if (minute === 60) {
          hour = hour + 1;
          minute = 0;
        }
      }
      else if (Number(ticksObject.tickWidth) == 0.50) {
        this.span = 2;
        minute = minute + 30;
        if (minute == 60) {
          hour = hour + 1;
          minute = 0;
        }
      }
      else if (Number(ticksObject.tickWidth) === 1) {
        this.span = 1;
        hour = hour + 1;
      }
      else if (Number(ticksObject.tickWidth) == 2) {
        this.span = 0.5;
        hour = hour + 2;
      }
      if (hour > 12) {
        hour = hour - 12;
      }
      if (minute === 0) {
        if (hour === 12) {
          displayInterval.push(hour + "P");

        } else
          displayInterval.push(hour);
      }
      else {
        if (hour === 12 && minute === 0) {
          displayInterval.push(hour + "P");

        } else
          displayInterval.push(hour + ":" + minute);
      }
    }

    this.finalInterval = displayInterval;
    this.heightSpan = this.finalTask.length;
  }

}
