

import { Component, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { ConsultationService } from "../../services/consultation.service";
import { AppointmentService } from "../../services/appointment.service";
import { AccountService } from "../../services/account.service";
import { ProviderService } from "../../services/provider.service";
import { Utilities } from "../../services/utilities";
import { Consultation } from '../../models/consultation.model';
import { Appointment } from '../../models/appointment.model';
import { Provider } from '../../models/provider.model';
import { Patient } from '../../models/patient.model';
import { Permission } from '../../models/permission.model';


@Component({
    selector: 'consultation-editor',
    templateUrl: './consultation-editor.component.html',
    styleUrls: ['./consultation-editor.component.css']
})
export class ConsultationEditorComponent {

    private isNewConsultation: boolean;
    private viewOnlyMode: boolean;
    private isSaving: boolean;
    private isCommitted: boolean;
    private showValidationErrors: boolean = true;
    private formResetToggle = true;
    private consultationEdit: Consultation;
    private defaultAppointment = new Appointment();
    private currentAppointment: Appointment;
    private _currentAppointmentId: number;
    private currentProviderId: number;
    private currentProviderName: string;
    private appointments: Appointment[] = [];
    private appointmentsCache: Appointment[] = [];
    private providers: Provider[] = [];
    private patients: Patient[] = [];
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;


    public get currentAppointmentId() {
        return this._currentAppointmentId;
    }

    public set currentAppointmentId(id: number | string) {
        this.currentAppointment = this.appointments.find(x => x.id == id) || this.defaultAppointment;
        this._currentAppointmentId = <number>id;
    }





    @ViewChild('f')
    private form;

    //ViewChilds Required because ngIf hides template variables from global scope
    @ViewChild('patient')
    private patient;

    @ViewChild('symptoms')
    private symptoms;

    @ViewChild('prognosis')
    private prognosis;


    constructor(private alertService: AlertService, private accountService: AccountService, private consultationService: ConsultationService) {
        this.currentAppointment = this.defaultAppointment;
    }

    ngOnInit() {

        if (this.canCreateConsultations) {
            this.loadData();
        }
    }


    private loadData() {
        this.alertService.startLoadingMessage();

        this.consultationService.getTodaysAppointmentsProvidersAndPatients().subscribe(
            result => {
                this.alertService.stopLoadingMessage();
                this.appointmentsCache = [...result[0]];
                this.appointments = result[0];
                this.providers = result[1];
                this.patients = result[2];

                this.evaluateCurrentAppointment();
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.alertService.showStickyMessage("Load Error", `Unable to retrieve consultation data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`, MessageSeverity.error, error);
            });
    }


    private evaluateCurrentAppointment() {
        this.appointments = [];
        this.defaultAppointment = new Appointment();
        this.defaultAppointment.providerId = this.currentProviderId;

        if (this.isNewConsultation) {
            this.appointmentsCache.forEach(a => {
                this.appointments.push(Appointment.Create(a));
            })
        }

        if (this.appointments.length)
            this.currentAppointment = this.appointments[0];
        else
            this.currentAppointment = this.defaultAppointment;

        this.currentAppointmentId = this.currentAppointment.id;
    }


    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }


    private save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Saving consultation...");

        if (this.currentAppointment.id > 0)
            this.consultationEdit.appointmentId = this.currentAppointment.id;

        let providerName = this.currentProviderName;
        let patientName = this.currentAppointment.patientName;

        if (this.patients.find(x => x.id == this.currentAppointment.patientId))
            patientName = this.patients.find(x => x.id == this.currentAppointment.patientId).friendlyName;

        this.consultationEdit.providerId = this.currentAppointment.providerId;
        this.consultationEdit.providerName = providerName;
        this.consultationEdit.patientId = this.currentAppointment.patientId;
        this.consultationEdit.patientName = patientName;
        this.consultationEdit.symptoms = this.currentAppointment.symptoms;
        this.consultationEdit.prognosis = (<any>this.currentAppointment).prognosis;
        this.consultationEdit.prescriptions = (<any>this.currentAppointment).prescriptions;
        this.consultationEdit.comments = (<any>this.currentAppointment).comments;

        if (this.isNewConsultation) {
            this.consultationService.newConsultation(this.consultationEdit).subscribe(consultation => this.saveSuccessHelper(consultation), error => this.saveFailedHelper(error));
        }
        else {
            this.consultationService.updateConsultation(this.consultationEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }



    private saveSuccessHelper(consultation?: Consultation) {

        if (consultation) {
            let providerNameBackup = this.consultationEdit.providerName;
            let patientNameBackup = this.consultationEdit.patientName;

            Object.assign(this.consultationEdit, consultation);

            if (!this.consultationEdit.providerName)
                this.consultationEdit.providerName = providerNameBackup;

            if (!this.consultationEdit.patientName)
                this.consultationEdit.patientName = patientNameBackup;
        }

        this.appointmentsCache = this.appointmentsCache.filter(item => item.id !== this.consultationEdit.appointmentId);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        if (this.isNewConsultation)
            this.alertService.showMessage("Success", `${this.consultationEdit.narration} was created successfully`, MessageSeverity.success);
        else
            this.alertService.showMessage("Success", `Changes to the ${this.consultationEdit.narration} was saved successfully`, MessageSeverity.success);


        this.consultationEdit = null;
        this.resetForm();


        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }



    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }



    private cancel() {
        this.consultationEdit = null;
        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage("Cancelled", "Operation cancelled by user", MessageSeverity.default);
        this.alertService.resetStickyMessage();

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }


    private close() {
        this.consultationEdit = null;
        this.showValidationErrors = false;
        this.resetForm();

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }



    private confirm() {
        this.alertService.showMessage("Not Implemented"); //Todo: Implement me
    }


    resetForm(replace = false) {

        if (!replace) {
            if (this.form)
                this.form.reset();
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }



    newConsultation(provider: Provider) {
        this.isNewConsultation = true;
        this.viewOnlyMode = false;
        this.showValidationErrors = true;

        if (provider) {
            this.currentProviderId = provider.id;
            this.currentProviderName = provider.friendlyName;
        }

        this.evaluateCurrentAppointment()
        this.consultationEdit = new Consultation();

        return this.consultationEdit;
    }


    editConsultation(consultation: Consultation) {
        this.isNewConsultation = false;
        this.viewOnlyMode = false;
        this.showValidationErrors = true;

        this.currentProviderId = consultation.providerId;
        this.currentProviderName = consultation.providerName;

        this.evaluateCurrentAppointment()

        this.consultationEdit = new Consultation();
        Object.assign(this.consultationEdit, consultation);

        this.currentAppointment.id = this.consultationEdit.appointmentId;
        this.currentAppointment.startDate = this.consultationEdit.appointmentDate;
        this.currentAppointment.providerId = this.consultationEdit.providerId;
        this.currentAppointment.providerName = this.consultationEdit.providerName;
        this.currentAppointment.patientId = this.consultationEdit.patientId;
        this.currentAppointment.patientName = this.consultationEdit.patientName;
        this.currentAppointment.symptoms = this.consultationEdit.symptoms;
        (<any>this.currentAppointment).prognosis = this.consultationEdit.prognosis;
        (<any>this.currentAppointment).prescriptions = this.consultationEdit.prescriptions;
        (<any>this.currentAppointment).comments = this.consultationEdit.comments;

        return this.consultationEdit;
    }


    viewConsultation(consultation: Consultation) {
        this.isNewConsultation = false;
        this.viewOnlyMode = true;
        this.showValidationErrors = false;

        this.currentProviderId = consultation.providerId;
        this.currentProviderName = consultation.providerName;

        this.evaluateCurrentAppointment()

        this.consultationEdit = new Consultation();
        Object.assign(this.consultationEdit, consultation);

        this.currentAppointment.id = this.consultationEdit.appointmentId;
        this.currentAppointment.startDate = this.consultationEdit.appointmentDate;
        this.currentAppointment.providerId = this.consultationEdit.providerId;
        this.currentAppointment.providerName = this.consultationEdit.providerName;
        this.currentAppointment.patientId = this.consultationEdit.patientId;
        this.currentAppointment.patientName = this.consultationEdit.patientName;
        this.currentAppointment.symptoms = this.consultationEdit.symptoms;
        (<any>this.currentAppointment).prognosis = this.consultationEdit.prognosis;
        (<any>this.currentAppointment).prescriptions = this.consultationEdit.prescriptions;
        (<any>this.currentAppointment).comments = this.consultationEdit.comments;
    }



    get canCreateConsultations() {
        return this.accountService.userHasPermission(Permission.acceptAppointmentsPermission);
    }

}



