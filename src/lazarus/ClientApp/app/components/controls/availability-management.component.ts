import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';//Todo: Change back to 'ng2-bootstrap/modal' when valorsoft fixes umd module

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { ProviderService } from "../../services/provider.service";
import { AccountService } from "../../services/account.service";
import { Permission } from '../../models/permission.model';
import { Utilities } from "../../services/utilities";
import { Availability } from '../../models/availability.model';
import { Provider } from '../../models/provider.model';
import { AvailabilityEditorComponent } from "./availability-editor.component";


@Component({
    selector: 'availability-management',
    templateUrl: './availability-management.component.html',
    styleUrls: ['./availability-management.component.css']
})
export class AvailabilityManagementComponent implements OnInit, AfterViewInit {
    columns: any[] = [];
    rows: Availability[] = [];
    rowsCache: Availability[] = [];
    currentProvider: Provider;
    editedAvailability: Availability | Availability[];
    sourceAvailability: Availability;
    isBulkDelete: boolean;
    loadingIndicator: boolean;


    @Input()
    isGeneralEditor = false;


    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('dateTemplate')
    dateTemplate: TemplateRef<any>;

    @ViewChild('durationTemplate')
    durationTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('availabilityEditor')
    availabilityEditor: AvailabilityEditorComponent;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private accountService: AccountService, private providerService: ProviderService) {
    }


    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 50, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'startDate', name: gT('availability.Start'), width: 200, cellTemplate: this.dateTemplate },
            { prop: 'endDate', name: gT('availability.End'), width: 200, cellTemplate: this.dateTemplate },
            { prop: 'duration', name: gT('availability.Duration'), width: 100, cellTemplate: this.durationTemplate },
            { prop: 'isBooked', name: gT('availability.Booked'), width: 70, resizeable: false, canAutoResize: false, },
            { prop: 'isReserved', name: gT('availability.Reserved'), width: 70, resizeable: false, canAutoResize: false, }
        ];

        if (this.isGeneralEditor)
            this.columns.splice(1, 0, { prop: 'providerName', name: 'Provider', width: 250 }, );

        if (this.canEditAvailability)
            this.columns.push({ name: '', width: 90, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });


        this.loadData();
    }




    ngAfterViewInit() {

        this.availabilityEditor.changesSavedCallback = () => {
            this.addNewAvailabilityToList();
            this.editorModal.hide();
        };

        this.availabilityEditor.changesCancelledCallback = () => {
            this.isBulkDelete = false;
            this.editedAvailability = null;
            this.sourceAvailability = null;
            this.editorModal.hide();
        };
    }


    addNewAvailabilityToList() {
        if (this.isBulkDelete) {
            this.isBulkDelete = false;
            return;
        }


        if (this.sourceAvailability) {
            Object.assign(this.sourceAvailability, this.editedAvailability);
            this.editedAvailability = null;
            this.sourceAvailability = null;
        }
        else {

            let availabilities = (<Availability[]>this.editedAvailability).reverse();
            this.editedAvailability = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            for (let a of availabilities) {
                let availability = new Availability();
                Object.assign(availability, a);

                (<any>availability).index = ++maxIndex;

                this.rowsCache.splice(0, 0, availability);
                this.rows.splice(0, 0, availability);
            }
        }
    }



    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.providerService.getCurrentProviderAndAvailability()
            .subscribe(providerAndAvailability => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                let currentProvider = providerAndAvailability[0];
                let availabilities = providerAndAvailability[1];

                availabilities.forEach((availability, index, availabilities) => {
                    (<any>availability).index = index + 1;
                });


                this.currentProvider = currentProvider;
                this.rowsCache = [...availabilities];
                this.rows = availabilities;
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Load Error", `Unable to retrieve availability from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }


    onSearchChanged(value: string) {
        if (value) {
            value = value.toLowerCase();

            let filteredRows = this.rowsCache.filter(r => {
                let isChosen = !value
                    || r.startDate && Utilities.printDate(r.startDate).toLowerCase().indexOf(value) !== -1
                    || r.endDate && Utilities.printDate(r.endDate).toLowerCase().indexOf(value) !== -1
                    || r.providerName && r.providerName.toLowerCase().indexOf(value) !== -1
                    || value == "reserved" && r.isReserved
                    || value == "not reserved" && !r.isReserved
                    || value == 'booked' && r.isBooked
                    || value == 'not booked' && !r.isBooked;

                return isChosen;
            });

            this.rows = filteredRows;
        }
        else {
            this.rows = [...this.rowsCache];
        }
    }


    getPrintedDate(value: Date) {
        return Utilities.printDate(value);
    }


    getPrintedDuration(value: Availability) {
        return Utilities.printDuration(value.startDate, value.endDate);
    }


    onEditorModalHidden() {
        this.availabilityEditor.resetForm(true);
    }


    bulkDelete() {
        this.isBulkDelete = true;
        this.sourceAvailability = null;
        this.availabilityEditor.bulkDelete(this.currentProvider);
        this.editorModal.show();
    }


    newAvailability() {
        this.isBulkDelete = false;
        this.sourceAvailability = null;
        this.editedAvailability = this.availabilityEditor.newAvailability(this.currentProvider);
        this.editorModal.show();
    }


    editAvailability(availability: Availability) {
        this.isBulkDelete = false;
        this.sourceAvailability = availability;
        this.editedAvailability = this.availabilityEditor.editAvailability(availability);
        this.editorModal.show();
    }


    toggleReservation(row: Availability) {
        let operation = row.isReserved ? "Unreserving" : "Reserving";
        this.alertService.startLoadingMessage(operation + " time slot");
        this.loadingIndicator = true;

        this.providerService.toggleAvailabilityIsReserved(row)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                row.isReserved = !row.isReserved;
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Delete Error", `An error occured whilst ${operation} the time slot.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }




    deleteAvailability(row: Availability) {
        if (row.isBooked)
            this.alertService.showMessage("Timeslot taken", "This timeslot has an appointment associated and cannot be deleted", MessageSeverity.info);
        else
            this.alertService.showDialog('Are you sure you want to delete the \"' + row.narration + '\"?', DialogType.confirm, () => this.deleteAvailabilityHelper(row));
    }


    deleteAvailabilityHelper(row: Availability) {

        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;

        this.providerService.deleteAvailability(row)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Delete Error", `An error occured whilst deleting the available time.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }


    get canEditAvailability() {
        return this.accountService.userHasPermission(Permission.manageAppointmentsPermission) || this.accountService.userHasPermission(Permission.acceptAppointmentsPermission);
    }

}
