import { Utilities } from "../services/utilities";



export class Consultation {

    public static Create(data: {}) {
        let c = new Consultation();
        Object.assign(c, data);

        if (c.appointmentDate)
            c.appointmentDate = Utilities.parseDate(c.appointmentDate);

        if (c.date)
            c.date = Utilities.parseDate(c.date);

        return c
    }


    get narration(): string {

        let message = 'Consultation';

        if (this.patientName)
            message += ` for "${this.patientName}`;

        if (this.providerName)
            message += ` with "${this.providerName}`;

        return message;
    }


    public id: number;
    public symptoms: string;
    public prognosis: string;
    public prescriptions: string;
    public comments: string;
    public patientId: number;
    public patientName: string;
    public providerId: number;
    public providerName: string;
    public appointmentId: number;
    public appointmentDate: Date;
    public nextAppointmentId: number;
    public parentId: number;
    public date: Date;
}