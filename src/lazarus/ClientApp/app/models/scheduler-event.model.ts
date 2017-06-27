import { Appointment, AppointmentStatus, AppointmentRole } from "../models/appointment.model";


export class SchedulerEvent {
    constructor(title?: string, start?: Date | string, end?: Date | string, id?: number) {
        this.title = title;
        this.start = start;
        this.end = end;
        this.id = id;
    }

    public static Create(appointment: Appointment) {
        let e = new SchedulerEvent();

        e.title = appointment.contact;

        if (appointment.startDate) {
            e.start = this.getFriendlyTimeString(appointment.startDate);
            e.end = this.getFriendlyTimeString(appointment.endDate);
        }
        else {
            e.start = e.end = this.getFriendlyTimeString(appointment.preferredDate);
        }

        e.appointment = appointment;

        if (appointment.isActive) {
            if (appointment.status == AppointmentStatus.Confirmed) {
                e.color = "Green";
            } else {
                e.color = "YellowGreen";
                e.textColor = "Gray";
            }
        }
        else if (appointment.status == AppointmentStatus.Cancelled) {
            e.color = "Silver";
        }


        if (appointment.role == AppointmentRole.Consultant)
            e.borderColor = "Yellow";
        else if (appointment.role == AppointmentRole.None)
            e.borderColor = "Aqua";

        return e;
    }

    private static getFriendlyTimeString(date: Date) {
        if (date)
            return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    }



    public id: number;
    public title: string;
    public start: Date | string;
    public end: Date | string;
    public color: string;
    public backgroundColor: string;
    public borderColor: string;
    public textColor: string;
    public appointment: Appointment;
}


