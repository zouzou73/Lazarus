import { Component, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AppointmentService } from "../../services/appointment.service";
import { AccountService } from "../../services/account.service";
import { ProviderService } from "../../services/provider.service";
import { Utilities } from "../../services/utilities";
import { Appointment, AppointmentStatus } from '../../models/appointment.model';
import { Provider } from '../../models/provider.model';
import { Patient } from '../../models/patient.model';
import { Permission } from '../../models/permission.model';


@Component({
    selector: 'appointment-editor',
    templateUrl: './appointment-editor.component.html',
    styleUrls: ['./appointment-editor.component.css']
})
export class AppointmentEditorComponent {

    private isNewAppointment = false;
    private isSaving: boolean;
    private isCommitted: boolean;
    private showValidationErrors: boolean = true;
    private formResetToggle = true;
    private preferredDateOnly: Date;
    private preferredTimeOnly: Date;
    private appointmentEdit = new Appointment();
    private providers: Provider[] = [];
    private patients: Patient[] = [];
    private appointmentEditorState = AppointmentEditorState;
    private editorState = AppointmentEditorState.None;

    private datepickerOptions = {
        startDate: new Date(),
        autoclose: true,
        todayBtn: 'linked',
        todayHighlight: true,
        assumeNearbyYear: true,
        format: 'DD, d MM yyyy'
    }

    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;


    public get isServerCommitted() {
        return this.isCommitted;
    }



    @ViewChild('f')
    private form;

    //ViewChilds Required because ngIf hides template variables from global scope
    @ViewChild('patient')
    private patient;


    constructor(private alertService: AlertService, private accountService: AccountService, private appointmentService: AppointmentService, private providerService: ProviderService) {

    }

    ngOnInit() {

        if (this.canCreateAppointmentsForOthers) {
            if (!this.providers.length || !this.patients.length) {
                this.loadAvailablePatientsAndProviders();
            }

        } else if (!this.providers.length) {
            this.loadAvailableProviders();
        }
    }


    private loadAvailableProviders() {
        this.alertService.startLoadingMessage();

        this.providerService.getProviders().subscribe(
            providers => {
                this.alertService.stopLoadingMessage();
                this.providers = providers;
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.alertService.showStickyMessage("Load Error", `Unable to retrieve available providers from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`, MessageSeverity.error, error);
            });
    }


    private loadAvailablePatientsAndProviders() {
        this.alertService.startLoadingMessage();

        this.appointmentService.getPatientsAndProviders().subscribe(
            patientsAndProviders => {
                this.alertService.stopLoadingMessage();
                this.patients = patientsAndProviders[0];
                this.providers = patientsAndProviders[1];
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.alertService.showStickyMessage("Load Error", `Unable to retrieve available patients and providers from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`, MessageSeverity.error, error);
            });
    }



    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }


    private save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Booking appointment...");

        let preferredDate = new Date(this.preferredDateOnly);
        preferredDate.setHours(this.preferredTimeOnly.getHours(), this.preferredTimeOnly.getMinutes());
        this.appointmentEdit.preferredDate = preferredDate;

        let preferredProvider = this.providers.find(p => p.id == this.appointmentEdit.preferredProviderId);
        this.appointmentEdit.preferredProviderName = preferredProvider ? preferredProvider.friendlyName : void 0;

        if (this.isNewAppointment) {
            this.appointmentService.newAppointment(this.appointmentEdit).subscribe(appointment => this.saveSuccessHelper(appointment), error => this.saveFailedHelper(error));
        }
        else {
            this.appointmentService.updateAppointment(this.appointmentEdit).subscribe(response => this.saveSuccessHelper(response), error => this.saveFailedHelper(error));
        }
    }




    private saveSuccessHelper(appointment?: Appointment) {
        if (appointment) {
            let patientNameBackup = this.appointmentEdit.patientName;
            let providerNameBackup = this.appointmentEdit.preferredProviderName || this.appointmentEdit.providerName;

            Object.assign(this.appointmentEdit, Appointment.Create(appointment));

            if (!this.appointmentEdit.patientName)
                this.appointmentEdit.patientName = patientNameBackup

            if (!this.appointmentEdit.providerName)
                this.appointmentEdit.providerName = providerNameBackup;
        }

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;


        switch (this.appointmentEdit.status) {

            case AppointmentStatus.Confirmed:
                this.isCommitted = true;
                this.editorState = AppointmentEditorState.Confirmed;

                if (this.isNewAppointment)
                    this.alertService.showMessage("Success", `${this.appointmentEdit.narration} was created successfully`, MessageSeverity.success);
                else
                    this.alertService.showMessage("Success", `Changes to ${this.appointmentEdit.narration} was saved successfully`, MessageSeverity.success);

                break;
            case AppointmentStatus.Confirm:
                this.isCommitted = true;
                this.editorState = AppointmentEditorState.Confirm;

                this.alertService.showMessage("Confirm changes", `Confirm changes to the ${this.appointmentEdit.narration}`, MessageSeverity.info);

                break;
            case AppointmentStatus.Rejected:
                this.editorState = AppointmentEditorState.rejected;

                this.alertService.showMessage("Rejected", `${this.appointmentEdit.narration} was rejected`, MessageSeverity.error);

                break;
            default:
                throw new Error("Unknown appointment status: " + AppointmentEditorState[this.appointmentEdit.status]);
        }
    }



    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }



    cancelAppointment() {
        if (!this.appointmentEdit.isActive)
            return;

        this.alertService.showDialog('Are you sure you want to cancel the \"' + this.appointmentEdit.narration + '\" ?', DialogType.confirm, () => this.cancelAppointmentHelper());
    }


    cancelAppointmentHelper() {

        this.alertService.startLoadingMessage("Cancelling...");

        let backupOfStatus = this.appointmentEdit.status;
        this.appointmentEdit.status = AppointmentStatus.Cancelled;

        this.appointmentService.updateAppointment(this.appointmentEdit)
            .subscribe(results => {
                this.editorState = AppointmentEditorState.Cancelled;

                this.alertService.stopLoadingMessage();
                this.alertService.showMessage("Appointment Cancelled", 'The \"' + this.appointmentEdit.narration + '\" has been cancelled', MessageSeverity.warn);
            },
            error => {
                this.appointmentEdit.status = backupOfStatus;

                this.alertService.stopLoadingMessage();
                this.alertService.showStickyMessage("Delete Error", `An error occured whilst cancelling the appointment.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }



    private cancel() {
        this.appointmentEdit = new Appointment();

        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage("Cancelled", "Operation cancelled by user", MessageSeverity.default);
        this.alertService.resetStickyMessage();

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }


    private close() {
        this.appointmentEdit = new Appointment();

        this.showValidationErrors = false;
        this.resetForm();

        if (this.changesSavedCallback)
            this.changesSavedCallback();
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



    newAppointment(patient: Patient, date?: Date) {
        this.editorState = AppointmentEditorState.Editor;
        this.isCommitted = false;
        this.isNewAppointment = true;
        this.showValidationErrors = true;

        this.appointmentEdit = new Appointment();

        if (patient) {
            this.appointmentEdit.patientId = patient.id;
            this.appointmentEdit.patientName = patient.friendlyName;
        }

        let preferredDate = date || new Date();
        let nextNearest30Minutes = Math.round((preferredDate.getMinutes() + 30) / 5) * 5;
        preferredDate = new Date(preferredDate.setMinutes(nextNearest30Minutes));

        this.preferredDateOnly = preferredDate;
        this.preferredTimeOnly = new Date(preferredDate.valueOf());


        return this.appointmentEdit;
    }

    editAppointment(appointment: Appointment) {
        this.editorState = AppointmentEditorState.Editor;
        this.isCommitted = false;
        this.isNewAppointment = false;
        this.showValidationErrors = true;

        this.appointmentEdit = new Appointment();
        Object.assign(this.appointmentEdit, appointment);

        if (appointment.startDate) {
            this.preferredDateOnly = new Date(appointment.startDate.valueOf());
            this.preferredTimeOnly = new Date(appointment.startDate.valueOf());
        }
        else {
            this.preferredDateOnly = new Date(appointment.preferredDate.valueOf());
            this.preferredTimeOnly = new Date(appointment.preferredDate.valueOf());
        }

        return this.appointmentEdit;
    }



    get canCreateAppointmentsForOthers() {
        return this.accountService.userHasPermission(Permission.manageAppointmentsPermission) || this.accountService.userHasPermission(Permission.acceptAppointmentsPermission);
    }

}



export enum AppointmentEditorState {
    None,
    Editor,
    rejected,
    Cancelled,
    Confirm,
    Confirmed,
}
