import { Utilities } from "../services/utilities";

export class TimeSpan {
    constructor(hours?: number, minutes?: number, seconds?: number) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }


    public static parse(timeSpan: string) {
        let hr_MinSec = Utilities.splitInTwo(timeSpan, ":");
        let minSec = Utilities.splitInTwo(hr_MinSec.secondPart, ":");

        return new TimeSpan(+hr_MinSec.firstPart, +minSec.firstPart, +minSec.secondPart);
    }


    public hours: number;
    public minutes: number;
    public seconds: number;

    private getStringRep(value: number) {
        if (!value)
            return "00";

        if (value.toString().length == 1)
            return "0" + value.toString();
        else
            return value.toString();
    }


    toString() {
        return `${this.getStringRep(this.hours)}:${this.getStringRep(this.minutes)}:${this.getStringRep(this.seconds)}`;
    }
}




export class TimeSlot {
    public constructor(start?: Date, duration?: TimeSpan) {
        this.start = start;
        this.duration = duration;
    }


    public static create(data: any) {
        let ts = new TimeSlot();

        if (data.start)
            ts.start = Utilities.parseDate(data.start);

        if (data.duration)
            ts.duration = TimeSpan.parse(data.duration);

        return ts
    }



    public start: Date;
    public duration: TimeSpan;
}