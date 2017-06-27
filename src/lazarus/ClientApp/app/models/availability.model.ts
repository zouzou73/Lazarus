import { Utilities } from "../services/utilities";
import { TimeSpan, TimeSlot } from "../models/time-span.model";



export class Availability {

    public static create(data: {}) {
        let a = new Availability();
        Object.assign(a, data);

        if (a.startDate)
            a.startDate = Utilities.parseDate(a.startDate);

        if (a.endDate)
            a.endDate = Utilities.parseDate(a.endDate);

        return a;
    }


    get narration(): string {

        if (this.providerName)
            return `Working time for "${this.providerName}" from ${Utilities.printDate(this.startDate)} to  ${Utilities.printDate(this.endDate)}`;
        else
            return `Working time from ${Utilities.printDate(this.startDate)} to  ${Utilities.printDate(this.endDate)}`;
    }


    public id: number;
    public providerId: number;
    public providerName: string;
    public startDate: Date;
    public endDate: Date;
    public isBooked: boolean;
    public isReserved: boolean;
}








export class AvailabilityGenerator {

    public static create(data: any) {
        let a = new AvailabilityGenerator();

        if (data.providerId)
            a.providerId = +data.providerId;

        if (data.providerName)
            a.providerName = data.providerName;

        if (data.startDate)
            a.startDate = new Date(data.startDate);

        if (data.endDate)
            a.endDate = new Date(data.endDate);

        if (data.interval)
            a.interval = data.interval;

        a.breaks = [];

        if (data.breaks) {
            for (let i in data.breaks) {
                a.breaks[i] = TimeSlot.create(data.breaks[i]);
            }
        }

        return a
    }


    get narration(): string {
        return `Working time from ${Utilities.printDate(this.startDate)} to  ${Utilities.printDate(this.endDate)}`;
    }

    public providerId: number;
    public providerName: string;
    public startDate: Date;
    public endDate: Date;
    public interval: string;
    public breaks: TimeSlot[];
}