import { Utilities } from "../services/utilities";



export class Appointment {

    public static Create(data: {}) {
        let a = new Appointment();
        Object.assign(a, data);

        if (a.preferredDate)
            a.preferredDate = Utilities.parseDate(a.preferredDate);

        if (a.startDate)
            a.startDate = Utilities.parseDate(a.startDate);

        if (a.endDate)
            a.endDate = Utilities.parseDate(a.endDate);

        return a
    }


    get narration(): string {

        let appointmentDate = this.startDate || this.preferredDate;
        let printedDate = appointmentDate ? Utilities.printDate(appointmentDate) : "unknown date";

        if (this.providerName)
            return `Appointment for "${this.patientName || "patient"}" with "${this.providerName}" on ${printedDate}`;
        else
            return `Appointment for "${this.patientName || "patient"}" on ${printedDate}`;
    }

    get contact(): string {
        if (this.role == AppointmentRole.Client)
            return this.providerName;

        if (this.role == AppointmentRole.Consultant)
            return this.patientName;

        return "none";
    }

    get isActive(): boolean {

        if (this.status == AppointmentStatus.Confirmed || this.status == AppointmentStatus.Confirm || this.status == AppointmentStatus.PendingApproval || this.status == AppointmentStatus.Rescheduled)
            return this.startDate ? this.startDate > new Date() : this.preferredDate > new Date();

        return false;
    }


    public id: number;
    public symptoms: string;
    public isCritical: boolean;
    public preferredDate: Date;
    public startDate: Date;
    public endDate: Date;
    public status: AppointmentStatus;
    public role: AppointmentRole;
    public patientId: number;
    public patientName: string;
    public preferredProviderId: number;
    public preferredProviderName: string;
    public providerId: number;
    public providerName: string;
}



export enum AppointmentStatus {
    PendingApproval,
    Rescheduled,
    Cancelled,
    Rejected,
    Confirm,
    Confirmed,
    Closed
}


export enum AppointmentRole {
    None,
    Consultant,
    Client
}