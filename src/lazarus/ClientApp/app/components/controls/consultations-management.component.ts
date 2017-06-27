import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';//Todo: Change back to 'ng2-bootstrap/modal' when valorsoft fixes umd module

import { AuthService } from '../../services/auth.service';
import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { Utilities } from "../../services/utilities";
import { ConsultationService } from "../../services/consultation.service";
import { AccountService } from "../../services/account.service";
import { Consultation } from '../../models/consultation.model';
import { Provider } from '../../models/provider.model';
import { Permission } from '../../models/permission.model';
import { ConsultationEditorComponent } from "./consultation-editor.component";



@Component({
    selector: 'consultations-management',
    templateUrl: './consultations-management.component.html',
    styleUrls: ['./consultations-management.component.css']
})
export class ConsultationsManagementComponent implements OnInit {

    columns: any[] = [];
    rows: Consultation[] = [];
    rowsCache: Consultation[] = [];
    currentProvider: Provider;
    editedConsultation: Consultation;
    sourceConsultation: Consultation;
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

    @ViewChild('consultationEditor')
    consultationEditor: ConsultationEditorComponent;


    constructor(private alertService: AlertService, private accountService: AccountService, private consultationService: ConsultationService) {

    }


    ngOnInit() {
        this.columns = [
            { prop: "index", name: '#', width: 50, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'patientName', name: 'Patient', cellTemplate: this.contentTemplate, width: 100 },
            { prop: 'symptoms', name: 'Symptoms', cellTemplate: this.contentTemplate, width: 200 },
            { prop: 'prognosis', name: 'Prognosis', cellTemplate: this.contentTemplate, width: 200 },
            { prop: 'prescriptions', name: 'Prescriptions', cellTemplate: this.contentTemplate, width: 100 },
            { prop: 'date', name: 'Date', cellTemplate: this.dateTemplate, width: 95 },
            { name: '', width: 70, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }


    ngAfterViewInit() {

        this.consultationEditor.changesSavedCallback = () => {
            this.addNewConsultationToList();
            this.editorModal.hide();
        };

        this.consultationEditor.changesCancelledCallback = () => {
            this.editedConsultation = null;
            this.sourceConsultation = null;
            this.editorModal.hide();
        };
    }




    addNewConsultationToList() {
        if (this.sourceConsultation) {
            Object.assign(this.sourceConsultation, this.editedConsultation);
            this.editedConsultation = null;
            this.sourceConsultation = null;
        }
        else {
            let consultation = new Consultation();
            Object.assign(consultation, this.editedConsultation);
            this.editedConsultation = null;

            let maxIndex = 0;
            for (let a of this.rowsCache) {
                if ((<any>a).index > maxIndex)
                    maxIndex = (<any>a).index;
            }

            (<any>consultation).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, consultation);
            this.rows.splice(0, 0, consultation);
        }

    }


    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.consultationService.getProviderAndConsultations()
            .subscribe(providerAndConsultations => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                providerAndConsultations[1].forEach((consultation, index, consultations) => {
                    (<any>consultation).index = index + 1;
                });


                this.currentProvider = providerAndConsultations[0];
                this.rowsCache = [...providerAndConsultations[1]];
                this.rows = providerAndConsultations[1];

            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Load Error", `Unable to retrieve consultations from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
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
        this.editedConsultation = null;
        this.sourceConsultation = null;

        this.consultationEditor.resetForm(true);
    }


    newConsultation() {
        this.sourceConsultation = null;
        this.editedConsultation = this.consultationEditor.newConsultation(this.currentProvider);
        this.editorModal.show();
    }


    editConsultation(consultation: Consultation) {
        this.sourceConsultation = consultation;
        this.editedConsultation = this.consultationEditor.editConsultation(consultation);
        this.editorModal.show();
    }


    viewConsultation(consultation: Consultation) {
        this.consultationEditor.viewConsultation(consultation);
        this.editorModal.show();
    }


    deleteConsultation(consultation: Consultation) {
        this.alertService.showDialog('Are you sure you want to delete the \"' + consultation.narration + '\" ?', DialogType.confirm, () => this.deleteConsultationHelper(consultation));
    }



    deleteConsultationHelper(consultation: Consultation) {

        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;

        this.consultationService.deleteConsultation(consultation)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter(item => item !== consultation);
                this.rows = this.rows.filter(item => item !== consultation);

            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Delete Error", `An error occured whilst deleting the consultation.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }



    get canCreateConsultations() {
        return this.accountService.userHasPermission(Permission.acceptAppointmentsPermission);
    }

}
