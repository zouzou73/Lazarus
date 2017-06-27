import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';//Todo: Change back to 'ng2-bootstrap/modal' when valorsoft fixes umd module
import { Options, Header } from "fullcalendar";

import { AuthService } from '../../services/auth.service';
import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { AppointmentService } from '../../services/appointment.service';
import { AccountService } from "../../services/account.service";
import { PatientService } from '../../services/patient.service';
import { Permission } from '../../models/permission.model';
import { Appointment, AppointmentStatus } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { SchedulerEvent } from '../../models/scheduler-event.model';
import { FullCalendarDirective } from "../../directives/fullcalendar.directive";
import { AppointmentEditorComponent, AppointmentEditorState } from "./appointment-editor.component";



@Component({
    selector: 'appointments-management',
    templateUrl: './appointments-management.component.html',
    styleUrls: ['./appointments-management.component.css']
})
export class AppointmentsManagementComponent implements OnInit {

    columns: any[] = [];
    rows: Appointment[] = [];
    rowsCache: Appointment[] = [];
    events: SchedulerEvent[] = [];
    editedAppointment: Appointment;
    sourceAppointment: Appointment;
    patient: Patient;
    patientProfileLoadFailed: boolean;

    loadingIndicator: boolean;
    _miniView: boolean = false;
    appointmentStatus = AppointmentStatus;
    calendarOptions: Options | Object;



    @Input()
    calendarView = true;

    @Input()
    heightOffset = 240;

    @Input()
    itemsPerPage: number;


    @Input()
    set miniView(value: boolean) {

        if (value) {
            this.calendarView = false;
        }

        this._miniView = value;
    }

    get miniView() {
        return this._miniView;
    }


    @Input()
    verticalScrollbar = false;


    @ViewChild('scheduler')
    scheduler: FullCalendarDirective;

    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('contentTemplate')
    contentTemplate: TemplateRef<any>;

    @ViewChild('dateTemplate')
    dateTemplate: TemplateRef<any>;

    @ViewChild('appointmentStatusTemplate')
    appointmentStatusTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('appointmentEditor')
    appointmentEditor: AppointmentEditorComponent;


    constructor(private alertService: AlertService, private translationService: AppTranslationService, private authService: AuthService, private accountService: AccountService,
        private appointmentService: AppointmentService, private patientService: PatientService) {

    }


    ngOnInit() {

        this.calendarOptions = {
            height: () => window.innerHeight - this.heightOffset,
            fixedWeekCount: false,
            editable: false,
            eventLimit: true, // allow "more" link when too many events
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listDay'
            },
            dayClick: (date, jsEvent, view) => this.schedulerDayClicked(date, jsEvent, view),
            eventClick: (event, jsEvent, view) => this.schedulerEventClicked(event, jsEvent, view),
            events: this.events
        };

        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "index", name: '#', width: 50, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'narration', name: gT('appointement.Appointment'), cellTemplate: this.contentTemplate, width: 200 },
            { prop: 'symptoms', name: gT('appointement.Symptoms'), cellTemplate: this.contentTemplate, width: 300 },
            { prop: 'startDate', name: gT('appointement.Start'), cellTemplate: this.dateTemplate, width: 95 },
            { prop: 'endDate', name: gT('appointement.End'), cellTemplate: this.dateTemplate, width: 95 },
            { prop: 'contact', name:  gT('appointement.Contact'), cellTemplate: this.contentTemplate, width: 90 },
            { prop: 'status', name: gT('appointement.Status'), cellTemplate: this.appointmentStatusTemplate, width: 50 }
        ];

        if (!this.miniView)
            this.columns.push({ name: '', width: 100, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });

        this.loadData();
    }


    ngAfterViewInit() {

        if (!this.miniView) {
            this.appointmentEditor.changesSavedCallback = () => {
                this.onEditCompleted();
            };

            this.appointmentEditor.changesCancelledCallback = () => {
                this.onEditCancelled();
            };
        }
    }


    onEditCompleted() {
        this.addNewAppointmentToList();
        this.editorModal.hide();
    }


    onEditCancelled() {
        this.editedAppointment = null;
        this.sourceAppointment = null;
        this.editorModal.hide();
    }


    refreshSchedulerEvents() {

        this.events.length = 0;

        for (var i = 0; i < this.rows.length; i++) {
            this.events.push(SchedulerEvent.Create(this.rows[i]));
        }

        if (this.scheduler) {
            this.scheduler.removeEvents();
            this.scheduler.renderEvents(this.events, true);
        }
    }


    addNewAppointmentToList() {
        if (this.sourceAppointment) {
            Object.assign(this.sourceAppointment, this.editedAppointment);
            this.editedAppointment = null;
            this.sourceAppointment = null;
        }
        else {
            let appointment = new Appointment();
            Object.assign(appointment, this.editedAppointment);
            this.editedAppointment = null;

            let maxIndex = 0;
            for (let a of this.rowsCache) {
                if ((<any>a).index > maxIndex)
                    maxIndex = (<any>a).index;
            }

            (<any>appointment).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, appointment);
            this.rows.splice(0, 0, appointment);
        }

        this.refreshSchedulerEvents();
    }


    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.appointmentService.getAllCurrentUserAppointments()
            .subscribe(appointments => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                appointments.forEach((appointment, index, appointments) => {
                    (<any>appointment).index = index + 1;
                });


                this.rowsCache = [...appointments];
                this.rows = appointments;
                this.refreshSchedulerEvents();
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Load Error", `Unable to retrieve appointments from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });


        if (!this.canCreateAppointmentsForOthers) {
            this.patientService.getPatient()
                .subscribe(patient => {
                    this.patientProfileLoadFailed = false;
                    this.patient = patient;
                },
                error => {
                    this.patientProfileLoadFailed = true;

                    if (Utilities.checkNotFound(error)) {
                        this.alertService.showMessage("Patient records not found", "No patient records was found for the current logged in user", MessageSeverity.warn);
                    }
                    else {
                        this.alertService.showMessage("Load Error", "An error occured whilst retrieving the profile information for the current patient", MessageSeverity.warn);
                    }
                });
        }
    }



    onSearchChanged(value: string) {
        if (value) {
            value = value.toLowerCase();
            let currentDate = new Date();

            let filteredRows = this.rowsCache.filter(r => {
                let isChosen = !value
                    || r.symptoms.toLowerCase().indexOf(value) !== -1
                    || r.preferredDate && Utilities.printDate(r.preferredDate).toLowerCase().indexOf(value) !== -1
                    || r.startDate && Utilities.printDate(r.startDate).toLowerCase().indexOf(value) !== -1
                    || r.endDate && Utilities.printDate(r.endDate).toLowerCase().indexOf(value) !== -1
                    || r.status && AppointmentStatus[r.status].toString().toLowerCase().indexOf(value) !== -1
                    || r.patientName && r.patientName.toString().toLowerCase().indexOf(value) !== -1
                    || r.preferredProviderName && r.preferredProviderName.toString().toLowerCase().indexOf(value) !== -1
                    || r.providerName && r.providerName.toLowerCase().indexOf(value) !== -1
                    || (value == 'active' || value == 'up coming' || value == 'upcoming') && r.isActive
                    || (value == 'not active' || value == 'inactive') && !r.isActive
                    || value == 'expired' && r.startDate < currentDate
                    || value == 'critical' && r.isCritical
                    || value == 'not critical' && !r.isCritical;

                return isChosen;
            });

            this.rows = filteredRows;
        }
        else {
            this.rows = [...this.rowsCache];
        }

        this.refreshSchedulerEvents();
    }

    getPrintedDate(value: Date) {
        if (value)
            return Utilities.printTimeOnly(value) + " on " + Utilities.printDateOnly(value);
    }


    onEditorModalHidden() {

        if (this.editedAppointment) {
            if (this.appointmentEditor.isServerCommitted)
                this.onEditCompleted();
            else
                this.onEditCancelled();
        }


        this.editedAppointment = null;
        this.sourceAppointment = null;

        this.appointmentEditor.resetForm(true);
    }


    schedulerDayClicked(date: Date, jsEvent, view) {
        let appointmentDate = new Date(date.toString());
        let currentDate = new Date();

        appointmentDate.setHours(currentDate.getHours(), currentDate.getMinutes() + 1);

        if (appointmentDate.valueOf() < currentDate.valueOf())
            return;

        this.newAppointment(appointmentDate);
    }

    schedulerEventClicked(event, jsEvent, view) {
        this.editAppointment(event.appointment);
    }


    newAppointment(date?: Date) {

        if (!this.testIsPatientProfileReady())
            return;

        this.sourceAppointment = null;
        this.editedAppointment = this.appointmentEditor.newAppointment(this.patient, date);
        this.editorModal.show();
    }


    editAppointment(appointment: Appointment) {
        if (!appointment.isActive)
            return;

        this.sourceAppointment = appointment;
        this.editedAppointment = this.appointmentEditor.editAppointment(appointment);
        this.editorModal.show();
    }


    testIsPatientProfileReady() {

        if (this.patientProfileLoadFailed) {
            this.alertService.showMessage("Patient Profile not loaded", 'Reload the page and try again', MessageSeverity.info);
            this.alertService.showDialog("The profile information of the current patient was not loaded successfully. Do you want to reload the page and try again?",
                DialogType.confirm, () => window.location.reload(true));

            return false;
        }

        if (!this.canCreateAppointmentsForOthers && !this.patient) {
            this.alertService.showMessage("Please try again later", "Patient Profile is still loading...", MessageSeverity.info);

            return false;
        }

        return true;
    }


    cancelAppointment(appointment: Appointment) {
        if (!appointment.isActive)
            return;

        this.alertService.showDialog('Are you sure you want to cancel the \"' + appointment.narration + '\" ?', DialogType.confirm, () => this.cancelAppointmentHelper(appointment));
    }


    cancelAppointmentHelper(appointment: Appointment) {

        this.alertService.startLoadingMessage("Cancelling...");
        this.loadingIndicator = true;

        appointment.status = AppointmentStatus.Cancelled;

        this.appointmentService.updateAppointment(appointment)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showMessage("Appointment Cancelled", 'The \"' + appointment.narration + '\" was cancelled successfully', MessageSeverity.success);
                this.refreshSchedulerEvents();
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Delete Error", `An error occured whilst cancelling the appointment.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }





    deleteAppointment(appointment: Appointment) {
        this.alertService.showDialog('Are you sure you want to delete the \"' + appointment.narration + '\" ?', DialogType.confirm, () => this.deleteAppointmentHelper(appointment));
    }


    deleteAppointmentHelper(appointment: Appointment) {

        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;

        this.appointmentService.deleteAppointment(appointment)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter(item => item !== appointment);
                this.rows = this.rows.filter(item => item !== appointment);
                this.refreshSchedulerEvents();
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Delete Error", `An error occured whilst deleting the appointment.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }



    get canCreateAppointmentsForOthers() {
        return this.accountService.userHasPermission(Permission.manageAppointmentsPermission) || this.accountService.userHasPermission(Permission.acceptAppointmentsPermission);
    }
}
