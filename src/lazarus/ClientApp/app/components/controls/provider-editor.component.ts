import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from "../../services/account.service";
import { ProviderService } from "../../services/provider.service";
import { Utilities } from '../../services/utilities';
import { Provider } from '../../models/provider.model';
import { User } from '../../models/user.model';
import { Department } from '../../models/department.model';
import { Gender } from '../../models/enums';
import { Permission } from '../../models/permission.model';


@Component({
    selector: 'provider-editor',
    templateUrl: './provider-editor.component.html',
    styleUrls: ['./provider-editor.component.css']
})
export class ProviderEditorComponent implements OnInit {

    private isEditMode = false;
    private isNewProvider = false;
    private isSaving = false;
    private showValidationErrors = false;
    private formResetToggle = true;
    private provider: Provider = new Provider();
    private providerEdit: Provider;
    private datepickerOptions;
    private allDepartments: Department[] = [];
    private genderEnum = Gender;

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
    @ViewChild('serviceId')
    private serviceId;

    @ViewChild('department')
    private department;

    @ViewChild('gender')
    private gender;


    constructor(private alertService: AlertService, private accountService: AccountService, private providerService: ProviderService) {

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

        this.providerService.getProviderAndDepartments().subscribe(results => this.onCurrentProviderDataLoadSuccessful(results[0], results[1]), error => this.onCurrentProviderDataLoadFailed(error));
    }


    private onCurrentProviderDataLoadSuccessful(provider: Provider, departments: Department[]) {
        this.alertService.stopLoadingMessage();
        this.provider = provider;
        this.allDepartments = departments;
    }

    private onCurrentProviderDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Load Error", `Unable to retrieve provider data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);

        this.provider = new Provider();
    }


    private getPrintedDate(date: Date) {

        if (typeof date === 'string' || date instanceof String)
            return date;

        if (date)
            return Utilities.printDateOnly(date);
    }

    private getDepartmentById(id: number) {
        if (this.allDepartments)
            return this.allDepartments.find((r) => r.id == id);
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }


    private edit() {
        if (!this.isGeneralEditor) {
            this.providerEdit = new Provider();
            Object.assign(this.providerEdit, this.provider);
        }
        else {
            if (!this.providerEdit)
                this.providerEdit = new Provider();
        }

        this.isEditMode = true;
        this.showValidationErrors = true;
    }


    private save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Saving changes...");

        if (!this.providerEdit.applicationUserId && this.providerEdit.applicationUser)
            this.providerEdit.applicationUserId = this.providerEdit.applicationUser.id;

        this.providerEdit.departmentName = this.allDepartments.find(department => department.id == this.providerEdit.departmentId).name;

        if (this.providerEdit.dateOfBirth)
            this.providerEdit.dateOfBirth = new Date(this.providerEdit.dateOfBirth);

        if (this.isNewProvider) {
            this.providerService.newProvider(this.providerEdit).subscribe(provider => this.saveSuccessHelper(provider), error => this.saveFailedHelper(error));
        }
        else {
            this.providerService.updateProvider(this.providerEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }


    private saveSuccessHelper(provider?: Provider) {
        if (provider)
            Object.assign(this.providerEdit, provider);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        Object.assign(this.provider, this.providerEdit);
        this.providerEdit = new Provider();
        this.resetForm();


        if (this.isGeneralEditor) {
            if (this.isNewProvider)
                this.alertService.showMessage("Success", `Provider \"${this.provider.friendlyName}\" was created successfully`, MessageSeverity.success);
            else
                this.alertService.showMessage("Success", `Changes to provider \"${this.provider.friendlyName}\" was saved successfully`, MessageSeverity.success);
        }
        else {
            this.alertService.showMessage("Success", "Changes to your Provider Profile was saved successfully", MessageSeverity.success);
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
            this.providerEdit = this.provider = new Provider();
        else
            this.providerEdit = new Provider();

        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage("Cancelled", "Operation cancelled by provider", MessageSeverity.default);
        this.alertService.resetStickyMessage();

        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }


    private close() {
        this.providerEdit = this.provider = new Provider();
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


    newProvider(userOrUserId: string | User, allDepartments: Department[]) {
        this.isGeneralEditor = true;
        this.isNewProvider = true;

        this.allDepartments = allDepartments;
        this.provider = this.providerEdit = new Provider();

        if (typeof userOrUserId === 'string' || userOrUserId instanceof String)
            this.provider.applicationUserId = <string>userOrUserId;
        else
            this.provider.applicationUser = userOrUserId;

        this.edit();

        return this.providerEdit;
    }


    editProvider(provider: Provider, allDepartments: Department[]) {
        this.isGeneralEditor = true;
        this.isNewProvider = false;

        this.allDepartments = allDepartments;
        this.provider = new Provider();
        this.providerEdit = new Provider();
        Object.assign(this.provider, provider);
        Object.assign(this.providerEdit, provider);

        if (provider.gender == Gender.None)
            delete this.providerEdit.gender;


        this.edit();

        return this.providerEdit;
    }


    displayProvider(provider: Provider, allDepartments?: Department[]) {
        if (allDepartments)
            this.allDepartments = allDepartments;

        this.isNewProvider = false;
        this.isEditMode = false;
        this.showValidationErrors = false;

        this.provider = new Provider();
        this.providerEdit = new Provider();
        Object.assign(this.provider, provider);
        Object.assign(this.providerEdit, provider);

        return this.providerEdit;
    }



    get canManageProviders() {
        return this.accountService.userHasPermission(Permission.manageProvidersPermission);
    }

}
