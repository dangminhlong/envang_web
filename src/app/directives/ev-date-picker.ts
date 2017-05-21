import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ev-date-picker',
    template: `
<md-input-container>
  <input mdInput [mdDatepicker]="myDatepicker" [(ngModel)]="date">
  <button mdSuffix [mdDatepickerToggle]="myDatepicker"></button>
</md-input-container>
<md-datepicker #myDatepicker (selectedChanged)="chooseDate($event)"></md-datepicker>
    `
})

export class EvDatePickerComponent implements OnInit {
    @Input("date") date:Date;
    @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();
    constructor() { }

    ngOnInit() { }

    chooseDate(event){
        this.dateChange.emit(event);
    }
    
}