import { Directive, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Options } from "fullcalendar";
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';

import * as $ from 'jquery';
import 'fullcalendar/dist/fullcalendar';



@Directive({
    selector: '[fullCalendar]',
    exportAs: 'full-calendar'
})
export class FullCalendarDirective implements OnInit, OnDestroy {

    private dayClickSubscription: Subscription;

    @Input()
    options: Options;


    constructor(private el: ElementRef) {

    }



    ngOnInit() {
        this.initialize(this.options);
    }

    ngOnDestroy() {
        this.destroy();
    }




    initialize(options?: Options) {
        (<any>$(this.el.nativeElement)).fullCalendar(options);
    }

    destroy() {
        if (this.dayClickSubscription)
            this.dayClickSubscription.unsubscribe();

        (<any>$(this.el.nativeElement)).fullCalendar('destroy');
    }


    refetchEvents() {
        (<any>$(this.el.nativeElement)).fullCalendar('refetchEvents');
    }

    refetchEventSources(sources) {
        (<any>$(this.el.nativeElement)).fullCalendar('refetchEventSources', sources);
    }

    renderEvent(event: {}, stick?: boolean) {
        (<any>$(this.el.nativeElement)).fullCalendar('renderEvent', event, stick);
    }

    renderEvents(events: {}[], stick?: boolean) {
        (<any>$(this.el.nativeElement)).fullCalendar('renderEvents', events, stick);
    }

    rerenderEvents() {
        (<any>$(this.el.nativeElement)).fullCalendar('rerenderEvents');
    }

    removeEvents(idOrFilter?) {
        (<any>$(this.el.nativeElement)).fullCalendar('removeEvents', idOrFilter);
    }

    removeEventSource(sources) {
        (<any>$(this.el.nativeElement)).fullCalendar('removeEventSource', sources);
    }

    removeEventSources(optionalSourcesArray?) {
        (<any>$(this.el.nativeElement)).fullCalendar('removeEventSources', optionalSourcesArray);
    }

    updateEvent(event) {
        return (<any>$(this.el.nativeElement)).fullCalendar('updateEvent', event);
    }


    clientEvents(idOrFilter) {
        return (<any>$(this.el.nativeElement)).fullCalendar('clientEvents', idOrFilter);
    }
}