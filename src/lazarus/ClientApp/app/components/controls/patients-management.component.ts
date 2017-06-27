import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';//Todo: Change back to 'ng2-bootstrap/modal' when valorsoft fixes umd module

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { AccountService } from "../../services/account.service";
import { PatientService } from "../../services/patient.service";
import { Utilities } from "../../services/utilities";
import { Patient } from '../../models/patient.model';
import { Role } from '../../models/role.model';
import { Gender, BloodGroup } from '../../models/enums';
import { Permission } from '../../models/permission.model';
import { ProfileEditorComponent } from "./profile-editor.component";


@Component({
    selector: 'patients-management',
    templateUrl: './patients-management.component.html',
    styleUrls: ['./patients-management.component.css']
})
export class PatientsManagementComponent implements OnInit, AfterViewInit {
    columns: any[] = [];
    rows: Patient[] = [];
    rowsCache: Patient[] = [];
    editedPatient: Patient;
    sourcePatient: Patient;
    editingPatientName: string;
    loadingIndicator: boolean;
    gender = Gender;
    bloodGroup = BloodGroup;

    allPatientRoles: Role[] = [];


    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('contentTemplate')
    contentTemplate: TemplateRef<any>;

    @ViewChild('bloodGroupTemplate')
    bloodGroupTemplate: TemplateRef<any>;

    @ViewChild('genderTemplate')
    genderTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('profileEditor')
    profileEditor: ProfileEditorComponent;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private accountService: AccountService, private patientService: PatientService) {

    }


    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);
        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'friendlyName', name: gT('patients.Name'), width: 120, cellTemplate: this.contentTemplate },
            { prop: 'applicationUser.email', name: gT('patients.Email'), width: 140, cellTemplate: this.contentTemplate },
            { prop: 'applicationUser.phoneNumber', width: 100, name: gT('patients.Phone'), cellTemplate: this.contentTemplate },
            { prop: 'bloodGroup', name: gT('patients.Blood'), width: 50, cellTemplate: this.bloodGroupTemplate },
            { prop: 'gender', name: gT('patients.Gender'), width: 50, cellTemplate: this.genderTemplate },
            { prop: 'age', name: gT('patients.Age'), width: 40, cellTemplate: this.contentTemplate },
            { prop: 'city', name: gT('patients.City'), width: 80, cellTemplate: this.contentTemplate },
            { name: '', width: 60, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }





    ngAfterViewInit() {

        this.profileEditor.changesSavedCallback = () => {
            this.addNewPatientToList();
            this.editorModal.hide();
        };

        this.profileEditor.changesCancelledCallback = () => {
            this.editedPatient = null;
            this.sourcePatient = null;
            this.editorModal.hide();
        };
    }


    addNewPatientToList() {
        if (this.sourcePatient) {
            Object.assign(this.sourcePatient, this.editedPatient);
            this.editedPatient = null;
            this.sourcePatient = null;
        }
        else {
            let patient = new Patient();
            Object.assign(patient, this.editedPatient);
            this.editedPatient = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>patient).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, patient);
            this.rows.splice(0, 0, patient);
        }
    }




    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        if (this.canManagePatients)
            this.patientService.getPatientsAndPatientRoles().subscribe(results => this.onDataLoadSuccessful(results[0], results[1]), error => this.onDataLoadFailed(error));
        else
            this.patientService.getPatients().subscribe(patients => this.onDataLoadSuccessful(patients), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(patients: Patient[], roles?: Role[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        patients.forEach((patient, index, patients) => {
            (<any>patient).index = index + 1;
        });

        this.rowsCache = [...patients];
        this.rows = patients;

        this.allPatientRoles = roles || [];
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Load Error", `Unable to retrieve patients from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }



    onSearchChanged(value: string) {
        if (value) {
            value = value.toLowerCase();

            let filteredRows = this.rowsCache.filter(r => {
                let isChosen = !value
                    || r.applicationUser.userName.toLowerCase().indexOf(value) !== -1
                    || r.applicationUser.fullName && r.applicationUser.fullName.toLowerCase().indexOf(value) !== -1
                    || r.applicationUser.email.toLowerCase().indexOf(value) !== -1
                    || r.applicationUser.phoneNumber && r.applicationUser.phoneNumber.toLowerCase().indexOf(value) !== -1
                    || r.applicationUser.jobTitle && r.applicationUser.jobTitle.toLowerCase().indexOf(value) !== -1

                    || r.address && r.address.toLowerCase().indexOf(value) !== -1
                    || r.city && r.city.toLowerCase().indexOf(value) !== -1
                    || r.age && r.age.toString() == value
                    || (value == 'o+' || value == 'o positive') && r.bloodGroup == BloodGroup.O_Positive
                    || (value == 'o-' || value == 'o negative') && r.bloodGroup == BloodGroup.O_Negative
                    || (value == 'a+' || value == 'a positive') && r.bloodGroup == BloodGroup.A_Positive
                    || (value == 'a-' || value == 'a negative') && r.bloodGroup == BloodGroup.A_Negative
                    || (value == 'b+' || value == 'b positive') && r.bloodGroup == BloodGroup.B_Positive
                    || (value == 'b-' || value == 'b negative') && r.bloodGroup == BloodGroup.B_Negative
                    || (value == 'ab+' || value == 'ab positive') && r.bloodGroup == BloodGroup.AB_Positive
                    || (value == 'ab-' || value == 'ab negative') && r.bloodGroup == BloodGroup.AB_Negative
                    || value == 'male' && r.gender == Gender.Male
                    || value == 'female' && r.gender == Gender.Female;

                return isChosen;
            });

            this.rows = filteredRows;
        }
        else {
            this.rows = [...this.rowsCache];
        }
    }


    onEditorModalHidden() {
        this.editingPatientName = null;
        this.profileEditor.resetForm(true);
    }



    newPatient() {
        this.editingPatientName = null;
        this.sourcePatient = null;
        this.editedPatient = this.profileEditor.newPatient(this.allPatientRoles);
        this.editorModal.show();
    }

    editPatient(row: Patient) {
        this.editingPatientName = row.friendlyName;
        this.sourcePatient = row;
        this.editedPatient = this.profileEditor.editPatient(row, this.allPatientRoles);
        this.editorModal.show();
    }

    displayPatient(row: Patient) {
        this.editingPatientName = row.friendlyName;
        this.sourcePatient = row;
        this.editedPatient = this.profileEditor.displayPatient(row);
        this.editorModal.show();
    }


    deletePatient(row: Patient) {
        this.alertService.showDialog('Are you sure you want to permanently delete \"' + row.friendlyName + '\"?', DialogType.confirm, () => this.deletePatientHelper(row));
    }


    deletePatientHelper(row: Patient) {

        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;

        this.patientService.deletePatient(row)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Delete Error", `An error occured whilst deleting the patient.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }




    get canManagePatients() {
        return this.accountService.userHasPermission(Permission.managePatientsPermission);
    }

}
