import { Component, AfterViewInit, ViewChild, Input } from '@angular/core';
import { TabsetComponent, TabDirective } from 'ng2-bootstrap/tabs';
import { Provider } from '../../models/provider.model';
import { Patient } from '../../models/patient.model';
import { Department } from '../../models/department.model';
import { UserEdit } from '../../models/user-edit.model';
import { Role } from '../../models/role.model';
import { UserInfoComponent } from "./user-info.component";
import { ProviderEditorComponent } from "./provider-editor.component";
import { PatientEditorComponent } from "./patient-editor.component";


@Component({
    selector: 'profile-editor',
    templateUrl: './profile-editor.component.html',
    styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent implements AfterViewInit {

    private remainingSaves = 0;
    private provider = new Provider();
    private patient = new Patient();
    private userInfoTabIndex = 0;
    private providerEditorTabIndex = 1;
    private patientEditorTabIndex = 2;


    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;


    @Input()
    isUserInfoEnabled: boolean = true;

    @Input()
    isProviderEditorEnabled: boolean;

    @Input()
    isPatientEditorEnabled: boolean;


    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;


    @ViewChild('editorTabs')
    private editorTabs: TabsetComponent;


    @ViewChild('userInfo')
    private userInfo: UserInfoComponent;

    @ViewChild('providerEditor')
    private providerEditor: ProviderEditorComponent;

    @ViewChild('patientEditor')
    private patientEditor: PatientEditorComponent;


    constructor() {

    }


    ngAfterViewInit() {
        this.prepareTabs();
    }


    private prepareTabs(isEdit = false) {
        this.remainingSaves = 0;

        if (this.isUserInfoEnabled) {
            this.userInfoTabIndex = this.remainingSaves++;

            this.tryEnableTab(this.providerEditorTabIndex, isEdit || false);
            this.tryEnableTab(this.patientEditorTabIndex, isEdit || false);
            this.trySelectTab(this.userInfoTabIndex);

            this.userInfo.changesSavedCallback = () => {
                this.remainingSaves--;

                if (this.remainingSaves === 0 || (!this.isProviderEditorEnabled && !this.isPatientEditorEnabled)) {

                    if (this.changesSavedCallback)
                        this.changesSavedCallback();
                }
                else {
                    if (this.isProviderEditorEnabled) {
                        this.tryEnableTab(this.providerEditorTabIndex);
                        this.trySelectTab(this.providerEditorTabIndex);
                    }
                    else {
                        this.tryEnableTab(this.patientEditorTabIndex);
                        this.trySelectTab(this.patientEditorTabIndex);
                    }
                }
            };

            this.userInfo.changesCancelledCallback = this.changesCancelledCallback;
            this.userInfo.changesFailedCallback = this.changesFailedCallback;
        }


        if (this.isProviderEditorEnabled) {
            this.providerEditorTabIndex = this.remainingSaves++;

            this.tryEnableTab(this.patientEditorTabIndex, isEdit || false);
            this.trySelectTab(this.providerEditorTabIndex);

            this.providerEditor.changesSavedCallback = () => {
                this.remainingSaves--;

                if (this.remainingSaves === 0 || !this.isPatientEditorEnabled) {

                    if (this.changesSavedCallback)
                        this.changesSavedCallback();
                }
                else {
                    this.tryEnableTab(this.patientEditorTabIndex);
                    this.trySelectTab(this.patientEditorTabIndex);
                }
            };

            this.providerEditor.changesCancelledCallback = this.changesCancelledCallback;
            this.providerEditor.changesFailedCallback = this.changesFailedCallback;
        }


        if (this.isPatientEditorEnabled) {
            this.patientEditorTabIndex = this.remainingSaves++;

            this.trySelectTab(this.patientEditorTabIndex);

            this.patientEditor.changesSavedCallback = () => {
                this.remainingSaves--;

                if (this.changesSavedCallback)
                    this.changesSavedCallback();
            };

            this.patientEditor.changesCancelledCallback = this.changesCancelledCallback;
            this.patientEditor.changesFailedCallback = this.changesFailedCallback;
        }
    }



    trySelectTab(tabIndex) {
        if (tabIndex < this.editorTabs.tabs.length)
            this.editorTabs.tabs[tabIndex].active = true;
    }


    tryEnableTab(tabIndex: number, isEnabled = true) {
        if (tabIndex < this.editorTabs.tabs.length)
            this.editorTabs.tabs[tabIndex].disabled = !isEnabled;
    }


    resetForm(replace = false) {

        if (this.isUserInfoEnabled)
            this.userInfo.resetForm(replace);

        if (this.isProviderEditorEnabled)
            this.providerEditor.resetForm(replace);

        if (this.isPatientEditorEnabled)
            this.patientEditor.resetForm(replace);
    }


    newProvider(providerRoles: Role[], allDepartments: Department[]) {
        this.prepareTabs(false);

        let user = this.userInfo.newUser(providerRoles);
        return this.providerEditor.newProvider(user, allDepartments);
    }


    editProvider(provider: Provider, providerRoles: Role[], allDepartments: Department[]) {
        this.prepareTabs(true);

        let user = this.userInfo.editUser(provider.applicationUser, providerRoles);
        return this.providerEditor.editProvider(provider, allDepartments);
    }


    displayProvider(provider: Provider, allDepartments?: Department[]) {
        this.prepareTabs(true);

        let user = this.userInfo.displayUser(provider.applicationUser);
        return this.providerEditor.displayProvider(provider, allDepartments);
    }







    newPatient(patientRoles: Role[]) {
        this.prepareTabs(false);

        let user = this.userInfo.newUser(patientRoles);
        return this.patientEditor.newPatient(user);
    }


    editPatient(patient: Patient, patientRoles: Role[]) {
        this.prepareTabs(true);

        let user = this.userInfo.editUser(patient.applicationUser, patientRoles);
        return this.patientEditor.editPatient(patient);
    }


    displayPatient(patient: Patient) {
        this.prepareTabs(true);

        let user = this.userInfo.displayUser(patient.applicationUser);
        return this.patientEditor.displayPatient(patient);
    }
}
