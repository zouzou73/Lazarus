import { NgModule, ErrorHandler } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastyModule } from 'ng2-toasty';
import { ModalModule } from 'ng2-bootstrap/modal';
import { TooltipModule } from "ng2-bootstrap/tooltip";
import { PopoverModule } from "ng2-bootstrap/popover";
import { BsDropdownModule } from 'ng2-bootstrap/dropdown';
import { CarouselModule } from 'ng2-bootstrap/carousel';
import { TimepickerModule } from 'ng2-bootstrap/timepicker';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from './app-error.handler';
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { AlertService } from './services/alert.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { EndpointFactory } from './services/endpoint-factory.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';
import { AppointmentService } from './services/appointment.service';
import { AppointmentEndpoint } from './services/appointment-endpoint.service';
import { ConsultationService } from './services/consultation.service';
import { ConsultationEndpoint } from './services/consultation-endpoint.service';
import { ProviderService } from './services/provider.service';
import { ProviderEndpoint } from './services/provider-endpoint.service';
import { PatientService } from './services/patient.service';
import { PatientEndpoint } from './services/patient-endpoint.service';
import { DepartmentService } from './services/department.service';
import { DepartmentEndpoint } from './services/department-endpoint.service';

import { EqualValidator } from './directives/equal-validator.directive';
import { LastElementDirective } from './directives/last-element.directive';
import { AutofocusDirective } from './directives/autofocus.directive';
import { BootstrapTabDirective } from './directives/bootstrap-tab.directive';
import { BootstrapToggleDirective } from './directives/bootstrap-toggle.directive';
import { BootstrapSelectDirective } from './directives/bootstrap-select.directive';
import { BootstrapDatepickerDirective } from './directives/bootstrap-datepicker.directive';
import { FullCalendarDirective } from './directives/fullcalendar.directive';
import { GroupByPipe } from './pipes/group-by.pipe';

import { AppComponent } from "./components/app.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { AppointmentsComponent } from "./components/appointments/appointments.component";
import { ConsultationsComponent } from "./components/consultations/consultations.component";
import { ProvidersComponent } from "./components/providers/providers.component";
import { PatientsComponent } from "./components/patients/patients.component";
import { HistoryComponent } from "./components/history/history.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { AboutComponent } from "./components/about/about.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";

import { BannerDemoComponent } from "./components/controls/banner-demo.component";
import { TodoDemoComponent } from "./components/controls/todo-demo.component";
import { StatisticsDemoComponent } from "./components/controls/statistics-demo.component";
import { NotificationsViewerComponent } from "./components/controls/notifications-viewer.component";
import { SearchBoxComponent } from "./components/controls/search-box.component";
import { UserInfoComponent } from "./components/controls/user-info.component";
import { UserPreferencesComponent } from "./components/controls/user-preferences.component";
import { UsersManagementComponent } from "./components/controls/users-management.component";
import { DepartmentEditorComponent } from "./components/controls/department-editor.component";
import { DepartmentsManagementComponent } from "./components/controls/departments-management.component";
import { RolesManagementComponent } from "./components/controls/roles-management.component";
import { RoleEditorComponent } from "./components/controls/role-editor.component";
import { AppointmentsManagementComponent } from "./components/controls/appointments-management.component";
import { AppointmentEditorComponent } from "./components/controls/appointment-editor.component";
import { AvailabilityManagementComponent } from "./components/controls/availability-management.component";
import { AvailabilityEditorComponent } from "./components/controls/availability-editor.component";
import { ConsultationsManagementComponent } from "./components/controls/consultations-management.component";
import { ConsultationEditorComponent } from "./components/controls/consultation-editor.component";
import { PatientEditorComponent } from "./components/controls/patient-editor.component";
import { ProviderEditorComponent } from "./components/controls/provider-editor.component";
import { ProfileEditorComponent } from "./components/controls/profile-editor.component";
import { PatientsManagementComponent } from "./components/controls/patients-management.component";
import { ProvidersManagementComponent } from "./components/controls/providers-management.component";
import { PatientHistoryManagementComponent } from "./components/controls/patient-history-management.component";
import { PatientHistoryEditorComponent } from "./components/controls/patient-history-editor.component";




@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        FormsModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLanguageLoader
            }
        }),
        NgxDatatableModule,
        ToastyModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        CarouselModule.forRoot(),
        TimepickerModule.forRoot(),
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        ChartsModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        AppointmentsComponent,
        ConsultationsComponent,
        PatientsComponent,
        ProvidersComponent,
        HistoryComponent,
        SettingsComponent,
        UsersManagementComponent, UserInfoComponent, UserPreferencesComponent,
        DepartmentsManagementComponent, DepartmentEditorComponent,
        RolesManagementComponent, RoleEditorComponent,
        AboutComponent,
        NotFoundComponent,
        NotificationsViewerComponent,
        SearchBoxComponent,
        AppointmentsManagementComponent, AppointmentEditorComponent,
        AvailabilityManagementComponent, AvailabilityEditorComponent,
        ConsultationsManagementComponent, ConsultationEditorComponent,
        PatientEditorComponent,
        ProviderEditorComponent,
        ProfileEditorComponent,
        ProvidersManagementComponent,
        PatientsManagementComponent,
        PatientHistoryManagementComponent,
        PatientHistoryEditorComponent,
        StatisticsDemoComponent, TodoDemoComponent, BannerDemoComponent,
        EqualValidator,
        LastElementDirective,
        AutofocusDirective,
        BootstrapTabDirective,
        BootstrapToggleDirective,
        BootstrapSelectDirective,
        BootstrapDatepickerDirective,
        FullCalendarDirective,
        GroupByPipe
    ],
    providers: [
        { provide: ErrorHandler, useClass: AppErrorHandler },
        AlertService,
        ConfigurationService,
        AppTitleService,
        AppTranslationService,
        NotificationService,
        NotificationEndpoint,
        AccountService,
        AccountEndpoint,
        AppointmentService,
        AppointmentEndpoint,
        ConsultationService,
        ConsultationEndpoint,
        PatientService,
        PatientEndpoint,
        ProviderService,
        ProviderEndpoint,
        DepartmentService,
        DepartmentEndpoint,
        LocalStoreManager,
        EndpointFactory
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
