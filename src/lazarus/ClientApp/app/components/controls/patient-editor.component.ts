import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from "../../services/account.service";
import { PatientService } from "../../services/patient.service";
import { Utilities } from '../../services/utilities';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';
import { Gender, BloodGroup } from '../../models/enums';
import { Permission } from '../../models/permission.model';


@Component({
    selector: 'patient-editor',
    templateUrl: './patient-editor.component.html',
    styleUrls: ['./patient-editor.component.css']
})
export class PatientEditorComponent implements OnInit {

    private isEditMode = false;
    private isNewPatient = false;
    private isSaving = false;
    private showValidationErrors = false;
    private formResetToggle = true;
    private patient: Patient = new Patient();
    private patientEdit: Patient;
    private datepickerOptions;
    private genderEnum = Gender;
    private bloodGroupEnum = BloodGroup;

    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;





    @ViewChild('f')
    private form;

    //ViewChilds Required because ngIf hides template variables from global scope
    @ViewChild('dateOfBirth')
    private dateOfBirth;

    @ViewChild('gender')
    private gender;


    constructor(private alertService: AlertService, private accountService: AccountService, private patientService: PatientService) {

        let today = new Date();
        let startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 200);

        this.datepickerOptions = {
            startDate: startDate,
            endDate: today,
            autoclose: true,
            todayBtn: 'linked',
            todayHighlight: true,
            assumeNearbyYear: true,
            format: 'd MM yyyy'
        }
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadCurrentUserData();
        }
    }



    private loadCurrentUserData() {
        this.alertService.startLoadingMessage();

        this.patientService.getPatient().subscribe(patient => this.onCurrentPatientDataLoadSuccessful(patient), error => this.onCurrentPatientDataLoadFailed(error));
    }


    private onCurrentPatientDataLoadSuccessful(patient: Patient) {
        this.alertService.stopLoadingMessage();
        this.patient = patient;
    }

    private onCurrentPatientDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Load Error", `Unable to retrieve patient data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);

        this.patient = new Patient();
    }


    private getPrintedDate(date: Date) {

        if (typeof date === 'string' || date instanceof String)
            return date;

        if (date)
            return Utilities.printDateOnly(date);
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }


    private edit() {
        if (!this.isGeneralEditor) {
            this.patientEdit = new Patient();
            Object.assign(this.patientEdit, this.patient);
        }
        else {
            if (!this.patientEdit)
                this.patientEdit = new Patient();
        }

        this.isEditMode = true;
        this.showValidationErrors = true;
    }


    private save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Saving changes...");

        if (!this.patientEdit.applicationUserId && this.patientEdit.applicationUser)
            this.patientEdit.applicationUserId = this.patientEdit.applicationUser.id;

        if (this.patientEdit.dateOfBirth)
            this.patientEdit.dateOfBirth = new Date(this.patientEdit.dateOfBirth);

        if (this.isNewPatient) {
            this.patientService.newPatient(this.patientEdit).subscribe(patient => this.saveSuccessHelper(patient), error => this.saveFailedHelper(error));
        }
        else {
            this.patientService.updatePatient(this.patientEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }


    private saveSuccessHelper(patient?: Patient) {
        if (patient)
            Object.assign(this.patientEdit, patient);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        Object.assign(this.patient, this.patientEdit);
        this.patientEdit = new Patient();
        this.resetForm();


        if (this.isGeneralEditor) {
            if (this.isNewPatient)
                this.alertService.showMessage("Success", `Patient \"${this.patient.friendlyName}\" was created successfully`, MessageSeverity.success);
            else
                this.alertService.showMessage("Success", `Changes to patient \"${this.patient.friendlyName}\" was saved successfully`, MessageSeverity.success);
        }
        else {
            this.alertService.showMessage("Success", "Changes to your Patient Profile was saved successfully", MessageSeverity.success);
        }

        this.isEditMode = false;

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
        if (this.isGeneralEditor)
            this.patientEdit = this.patient = new Patient();
        else
            this.patientEdit = new Patient();

        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage("Cancelled", "Operation cancelled by patient", MessageSeverity.default);
        this.alertService.resetStickyMessage();

        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }


    private close() {
        this.patientEdit = this.patient = new Patient();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    resetForm(replace = false) {
        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }


    newPatient(userOrUserId: string | User) {
        this.isGeneralEditor = true;
        this.isNewPatient = true;

        this.patient = this.patientEdit = new Patient();

        if (typeof userOrUserId === 'string' || userOrUserId instanceof String)
            this.patient.applicationUserId = <string>userOrUserId;
        else
            this.patient.applicationUser = userOrUserId;

        this.edit();

        return this.patientEdit;
    }


    editPatient(patient: Patient) {
        this.isGeneralEditor = true;
        this.isNewPatient = false;

        this.patient = new Patient();
        this.patientEdit = new Patient();
        Object.assign(this.patient, patient);
        Object.assign(this.patientEdit, patient);

        if (patient.gender == Gender.None)
            delete this.patientEdit.gender;


        this.edit();

        return this.patientEdit;
    }


    displayPatient(patient: Patient) {
        this.isNewPatient = false;
        this.isEditMode = false;
        this.showValidationErrors = false;

        this.patient = new Patient();
        this.patientEdit = new Patient();
        Object.assign(this.patient, patient);
        Object.assign(this.patientEdit, patient);

        return this.patientEdit;
    }



    get canManagePatients() {
        return this.accountService.userHasPermission(Permission.managePatientsPermission);
    }

}
