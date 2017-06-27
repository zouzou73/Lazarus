import { Component } from '@angular/core';

import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { Consultation } from '../../models/consultation.model';
import { Appointment } from '../../models/appointment.model';


@Component({
    selector: 'patient-history-editor',
    templateUrl: './patient-history-editor.component.html',
    styleUrls: ['./patient-history-editor.component.css']
})
export class PatientHistoryEditorComponent {

    private formResetToggle = true;
    private currentAppointment = new Appointment();
    private currentProviderName: string;
    public viewerClosedCallback: () => void;


    constructor(private alertService: AlertService) {

    }


    private close() {
        this.currentAppointment = new Appointment();
        this.currentProviderName = null;

        this.resetForm();

        if (this.viewerClosedCallback)
            this.viewerClosedCallback();
    }


    resetForm() {
        this.formResetToggle = false;

        setTimeout(() => {
            this.formResetToggle = true;
        });
    }


    viewConsultation(consultation: Consultation) {
        this.currentProviderName = consultation.providerName;

        this.currentAppointment.startDate = consultation.appointmentDate;
        this.currentAppointment.providerName = consultation.providerName;
        this.currentAppointment.patientName = consultation.patientName;
        this.currentAppointment.symptoms = consultation.symptoms;
        (<any>this.currentAppointment).prognosis = consultation.prognosis;
        (<any>this.currentAppointment).prescriptions = consultation.prescriptions;
        (<any>this.currentAppointment).comments = consultation.comments;
    }
}



