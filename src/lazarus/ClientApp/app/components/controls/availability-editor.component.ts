import { Component, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AccountService } from "../../services/account.service";
import { ProviderService } from "../../services/provider.service";
import { Utilities } from "../../services/utilities";
import { Availability, AvailabilityGenerator } from '../../models/availability.model';
import { TimeSpan } from '../../models/time-span.model';
import { Provider } from '../../models/provider.model';
import { Permission } from '../../models/permission.model';


@Component({
    selector: 'availability-editor',
    templateUrl: './availability-editor.component.html',
    styleUrls: ['./availability-editor.component.css']
})
export class AvailabilityEditorComponent {

    private isNewAvailability: boolean;
    private isBulkDelete: boolean;
    private isSaving: boolean;
    private showValidationErrors: boolean = true;
    private formResetToggle = true;
    private startDateOnly: Date;
    private startTimeOnly: Date;
    private endDateOnly: Date;
    private endTimeOnly: Date;
    private interval: Date;
    private generator = new AvailabilityGenerator();
    private availabilityEdit: Availability = new Availability();
    private availabilityNew: Availability[] = [];
    private providers: Provider[] = [];

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





    @ViewChild('f')
    private form;

    //ViewChilds Required because ngIf hides template variables from global scope
    @ViewChild('provider')
    private provider;

    @ViewChild('startDate')
    private startDate;


    constructor(private alertService: AlertService, private accountService: AccountService, private providerService: ProviderService) {

    }

    ngOnInit() {

        if (this.canCreateAvailabilityForOthers) {
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
                this.alertService.showStickyMessage("Load Error", `Unable to retrieve provider list from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`, MessageSeverity.error, error);
            });
    }



    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }


    private save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage(this.isBulkDelete ? "Deleting availability..." : "Generating availability...");

        let startDate = new Date(this.startDateOnly);
        startDate.setHours(this.startTimeOnly.getHours(), this.startTimeOnly.getMinutes());

        let endDate = new Date(this.endDateOnly);
        endDate.setHours(this.endTimeOnly.getHours(), this.endTimeOnly.getMinutes());


        if (this.isBulkDelete) {

            this.generator.startDate = startDate;
            this.generator.endDate = endDate;

            //Todo: Implement bulk delete
            setTimeout(() => this.saveSuccessHelper(), 1000);
        }
        else if (this.isNewAvailability) {

            //Todo: Do breaks here

            this.generator.startDate = startDate;
            this.generator.endDate = endDate;
            this.generator.interval = new TimeSpan(this.interval.getHours(), this.interval.getMinutes()).toString();

            this.providerService.newAvailability(this.generator).subscribe(availability => this.saveSuccessHelper(availability), error => this.saveFailedHelper(error));
        }
        else {

            this.availabilityEdit.startDate = startDate;
            this.availabilityEdit.endDate = endDate;
            this.availabilityEdit.providerId = this.generator.providerId;
            this.availabilityEdit.providerName = this.generator.providerName;

            this.providerService.updateAvailability(this.availabilityEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }




    private saveSuccessHelper(availability?: Availability[]) {
        if (availability) {
            for (let i in availability) {
                this.availabilityNew[i] = Availability.create(availability[i]);
            }
        }

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        //Todo: Handle bulkDelete here: deleteCount:number, errorsOcuured: boolean

        if (this.isBulkDelete)
            this.alertService.showStickyMessage("Todo: Bulk Delete", "This feature is not available", MessageSeverity.warn);
        else if (this.isNewAvailability)
            this.alertService.showMessage("Success", `${this.generator.narration} was generated successfully`, MessageSeverity.success);
        else
            this.alertService.showMessage("Success", `Changes to ${this.availabilityEdit.narration} was saved successfully`, MessageSeverity.success);

        this.isBulkDelete = false;
        this.generator = new AvailabilityGenerator();
        this.availabilityNew = [];
        this.availabilityEdit = new Availability();

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
        this.generator = new AvailabilityGenerator();
        this.availabilityNew = [];
        this.availabilityEdit = new Availability();

        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage("Cancelled", "Operation cancelled by user", MessageSeverity.default);
        this.alertService.resetStickyMessage();

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
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



    newAvailability(provider?: Provider) {
        this.isBulkDelete = false;
        this.isNewAvailability = true;
        this.showValidationErrors = true;

        this.generator = new AvailabilityGenerator();
        this.availabilityNew = [];

        if (provider) {
            this.generator.providerId = provider.id;
            this.generator.providerName = provider.friendlyName;
        }

        let startDate = new Date();
        let nextNearest5Minutes = Math.ceil(startDate.getMinutes() / 5) * 5;
        startDate = new Date(startDate.setMinutes(nextNearest5Minutes));

        this.startDateOnly = startDate;
        this.startTimeOnly = new Date(startDate.valueOf());

        let endDate = new Date();
        endDate.setHours(23, 59, 59);

        this.endDateOnly = endDate;
        this.endTimeOnly = new Date(endDate.valueOf());
        this.interval = new Date(0, 0, 0, 0, 30);


        return this.availabilityNew;
    }

    editAvailability(availability: Availability) {
        this.isBulkDelete = false;
        this.isNewAvailability = false;
        this.showValidationErrors = true;

        this.generator = new AvailabilityGenerator();
        this.availabilityEdit = new Availability();
        Object.assign(this.availabilityEdit, availability);

        this.generator.providerId = availability.providerId;
        this.generator.providerName = availability.providerName;

        this.startDateOnly = new Date(availability.startDate.valueOf());
        this.startTimeOnly = new Date(availability.startDate.valueOf());

        this.endDateOnly = new Date(availability.endDate.valueOf());
        this.endTimeOnly = new Date(availability.endDate.valueOf());


        return this.availabilityEdit;
    }


    bulkDelete(provider?: Provider) {

        this.isBulkDelete = true;
        this.isNewAvailability = false;
        this.showValidationErrors = true;

        this.generator = new AvailabilityGenerator();

        if (provider) {
            this.generator.providerId = provider.id;
            this.generator.providerName = provider.friendlyName;
        }

        let startDate = new Date();
        let nextNearest5Minutes = Math.ceil(startDate.getMinutes() / 5) * 5;
        startDate = new Date(startDate.setMinutes(nextNearest5Minutes));

        this.startDateOnly = startDate;
        this.startTimeOnly = new Date(startDate.valueOf());

        let endDate = new Date();
        endDate.setHours(23, 59, 59);

        this.endDateOnly = endDate;
        this.endTimeOnly = new Date(endDate.valueOf());
        this.interval = new Date(0, 0, 0, 0, 30);
    }



    get canCreateAvailabilityForOthers() {
        return this.accountService.userHasPermission(Permission.manageProvidersPermission);
    }


}