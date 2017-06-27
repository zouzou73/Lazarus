import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { AppointmentsComponent } from "./components/appointments/appointments.component";
import { ConsultationsComponent } from "./components/consultations/consultations.component";
import { PatientsComponent } from "./components/patients/patients.component";
import { ProvidersComponent } from "./components/providers/providers.component";
import { HistoryComponent } from "./components/history/history.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { AboutComponent } from "./components/about/about.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';



//{ path: '', component: HomeComponent, canActivate: [AuthGuard] },



@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: "", component: HomeComponent, canActivate: [AuthGuard], data: { title: "Home" } },
            { path: "login", component: LoginComponent, data: { title: "Login" } },
            { path: "appointments", component: AppointmentsComponent, canActivate: [AuthGuard], data: { title: "Appointments" } },
            { path: "consultations", component: ConsultationsComponent, canActivate: [AuthGuard], data: { title: "Consultations" } },
            { path: "patients", component: PatientsComponent, canActivate: [AuthGuard], data: { title: "Patients" } },
            { path: "providers", component: ProvidersComponent, canActivate: [AuthGuard], data: { title: "Providers" } },
            { path: "history", component: HistoryComponent, canActivate: [AuthGuard], data: { title: "History" } },
            { path: "settings", component: SettingsComponent, canActivate: [AuthGuard], data: { title: "Settings" } },
            { path: "about", component: AboutComponent, data: { title: "About Us" } },
            { path: "home", redirectTo: "/", pathMatch: "full" },
            { path: "**", component: NotFoundComponent, data: { title: "Page Not Found" } },
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthService, AuthGuard
    ]
})
export class AppRoutingModule { }