import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';//Todo: Change back to 'ng2-bootstrap/modal' when valorsoft fixes umd module

import { AuthService } from '../../services/auth.service';
import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { Utilities } from "../../services/utilities";
import { ConsultationService } from "../../services/consultation.service";
import { AccountService } from "../../services/account.service";
import { Consultation } from '../../models/consultation.model';
import { PatientHistoryEditorComponent } from "./patient-history-editor.component";



@Component({
    selector: 'patient-history-management',
    templateUrl: './patient-history-management.component.html',
    styleUrls: ['./patient-history-management.component.css']
})
export class PatientHistoryManagementComponent implements OnInit {

    columns: any[] = [];
    rows: Consultation[] = [];
    rowsCache: Consultation[] = [];
    consultation: Consultation;
    loadingIndicator: boolean;


    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('contentTemplate')
    contentTemplate: TemplateRef<any>;

    @ViewChild('dateTemplate')
    dateTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('patientHistoryEditor')
    patientHistoryEditor: PatientHistoryEditorComponent;


    constructor(private alertService: AlertService, private accountService: AccountService, private consultationService: ConsultationService) {

    }


    ngOnInit() {
        this.columns = [
            { prop: "index", name: '#', width: 50, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'providerName', name: 'Provider', cellTemplate: this.contentTemplate, width: 100 },
            { prop: 'symptoms', name: 'Symptoms', cellTemplate: this.contentTemplate, width: 200 },
            { prop: 'prognosis', name: 'Prognosis', cellTemplate: this.contentTemplate, width: 200 },
            { prop: 'prescriptions', name: 'Prescriptions', cellTemplate: this.contentTemplate, width: 100 },
            { prop: 'date', name: 'Date', cellTemplate: this.dateTemplate, width: 95 },
            { name: '', width: 70, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }


    ngAfterViewInit() {
        this.patientHistoryEditor.viewerClosedCallback = () => {
            this.editorModal.hide();
        };
    }


    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.consultationService.getPatientConsultations()
            .subscribe(history => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                history.forEach((consultation, index, consultations) => {
                    (<any>consultation).index = index + 1;
                });

                this.rowsCache = [...history];
                this.rows = history;

            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Load Error", `Unable to retrieve patient history from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }



    onSearchChanged(value: string) {
        if (value) {
            value = value.toLowerCase();

            let filteredRows = this.rowsCache.filter(r => {
                let isChosen = !value
                    || r.symptoms.toLowerCase().indexOf(value) !== -1
                    || r.prognosis && r.prognosis.toLowerCase().indexOf(value) !== -1
                    || r.prescriptions && r.prescriptions.toLowerCase().indexOf(value) !== -1
                    || r.date && Utilities.printDate(r.date).toLowerCase().indexOf(value) !== -1
                    || r.patientName && r.patientName.toLowerCase().indexOf(value) !== -1
                    || r.providerName && r.providerName.toLowerCase().indexOf(value) !== -1

                return isChosen;
            });

            this.rows = filteredRows;
        }
        else {
            this.rows = [...this.rowsCache];
        }


    }


    getPrintedDate(value: Date) {
        if (value)
            return Utilities.printTimeOnly(value) + " on " + Utilities.printDateOnly(value);
    }


    onEditorModalHidden() {
        this.patientHistoryEditor.resetForm();
    }

    viewHistory(history: Consultation) {
        this.patientHistoryEditor.viewConsultation(history);
        this.editorModal.show();
    }


    deleteHistory(history: Consultation) {
        this.alertService.showDialog('Are you sure you want to delete the your consultation with \"' + history.providerName + '\" ?', DialogType.confirm, () => this.deleteHistoryHelper(history));
    }



    deleteHistoryHelper(history: Consultation) {

        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;

        this.consultationService.deleteConsultation(history)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter(item => item !== history);
                this.rows = this.rows.filter(item => item !== history);

            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Delete Error", `An error occured whilst deleting the patient history.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }
}
