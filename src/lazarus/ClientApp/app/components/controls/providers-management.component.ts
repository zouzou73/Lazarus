import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';//Todo: Change back to 'ng2-bootstrap/modal' when valorsoft fixes umd module

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { AccountService } from "../../services/account.service";
import { ProviderService } from "../../services/provider.service";
import { Utilities } from "../../services/utilities";
import { Provider } from '../../models/provider.model';
import { Role } from '../../models/role.model';
import { Department } from '../../models/department.model';
import { Gender } from '../../models/enums';
import { Permission } from '../../models/permission.model';
import { ProfileEditorComponent } from "./profile-editor.component";


@Component({
    selector: 'providers-management',
    templateUrl: './providers-management.component.html',
    styleUrls: ['./providers-management.component.css']
})
export class ProvidersManagementComponent implements OnInit, AfterViewInit {
    columns: any[] = [];
    rows: Provider[] = [];
    rowsCache: Provider[] = [];
    editedProvider: Provider;
    sourceProvider: Provider;
    editingProviderName: string;
    loadingIndicator: boolean;
    gender = Gender;

    allDepartments: Department[] = [];
    allProviderRoles: Role[] = [];


    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('contentTemplate')
    contentTemplate: TemplateRef<any>;

    @ViewChild('departmentTemplate')
    departmentTemplate: TemplateRef<any>;

    @ViewChild('genderTemplate')
    genderTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('profileEditor')
    profileEditor: ProfileEditorComponent;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private accountService: AccountService, private providerService: ProviderService) {

    }


    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'serviceId', name: gT('providers.serviceId'), width: 70, cellTemplate: this.contentTemplate },
            { prop: 'friendlyName', name: gT('providers.Name'), width: 120, cellTemplate: this.contentTemplate },
            { prop: 'departmentName', name: gT('providers.Department'), width: 100, cellTemplate: this.departmentTemplate },
            { prop: 'applicationUser.email', name: gT('providers.Email'), width: 140, cellTemplate: this.contentTemplate },
            { prop: 'applicationUser.phoneNumber', width: 100, name: gT('providers.Phone'), cellTemplate: this.contentTemplate },
            { prop: 'workPhoneNumber', width: 100, name: gT('providers.WorkPhone'), cellTemplate: this.contentTemplate },
            { prop: 'gender', name: gT('providers.WorkPhone'), width: 50, cellTemplate: this.genderTemplate },
            { prop: 'city', name: gT('providers.City'), width: 80, cellTemplate: this.contentTemplate },
            { name: '', width: 60, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }





    ngAfterViewInit() {

        this.profileEditor.changesSavedCallback = () => {
            this.addNewProviderToList();
            this.editorModal.hide();
        };

        this.profileEditor.changesCancelledCallback = () => {
            this.editedProvider = null;
            this.sourceProvider = null;
            this.editorModal.hide();
        };
    }


    addNewProviderToList() {
        if (this.sourceProvider) {
            Object.assign(this.sourceProvider, this.editedProvider);
            this.editedProvider = null;
            this.sourceProvider = null;
        }
        else {
            let provider = new Provider();
            Object.assign(provider, this.editedProvider);
            this.editedProvider = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>provider).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, provider);
            this.rows.splice(0, 0, provider);
        }
    }




    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        if (this.canManageProviders)
            this.providerService.getProvidersAndDepartmentsAndRoles().subscribe(results => this.onDataLoadSuccessful(results[0], results[1], results[2]), error => this.onDataLoadFailed(error));
        else
            this.providerService.getProvidersAndDepartments().subscribe(results => this.onDataLoadSuccessful(results[0], results[1]), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(providers: Provider[], departments: Department[], roles?: Role[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        providers.forEach((provider, index, providers) => {
            (<any>provider).index = index + 1;
        });

        this.rowsCache = [...providers];
        this.rows = providers;

        this.allDepartments = departments;
        this.allProviderRoles = roles || [];
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Load Error", `Unable to retrieve providers from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
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
                    || r.departmentName && r.departmentName.toLowerCase().indexOf(value) !== -1
                    || r.serviceId && r.serviceId.toLowerCase().indexOf(value) !== -1
                    || r.workPhoneNumber && r.workPhoneNumber.toLowerCase().indexOf(value) !== -1
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
        this.editingProviderName = null;
        this.profileEditor.resetForm(true);
    }



    newProvider() {
        this.editingProviderName = null;
        this.sourceProvider = null;
        this.editedProvider = this.profileEditor.newProvider(this.allProviderRoles, this.allDepartments);
        this.editorModal.show();
    }

    editProvider(row: Provider) {
        this.editingProviderName = row.friendlyName;
        this.sourceProvider = row;
        this.editedProvider = this.profileEditor.editProvider(row, this.allProviderRoles, this.allDepartments);
        this.editorModal.show();
    }

    displayProvider(row: Provider) {
        this.editingProviderName = row.friendlyName;
        this.sourceProvider = row;
        this.editedProvider = this.profileEditor.displayProvider(row, this.allDepartments);
        this.editorModal.show();
    }


    deleteProvider(row: Provider) {
        this.alertService.showDialog('Are you sure you want to permanently delete \"' + row.friendlyName + '\"?', DialogType.confirm, () => this.deleteProviderHelper(row));
    }


    deleteProviderHelper(row: Provider) {

        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;

        this.providerService.deleteProvider(row)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Delete Error", `An error occured whilst deleting the provider.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }




    get canManageProviders() {
        return this.accountService.userHasPermission(Permission.manageProvidersPermission);
    }

}
