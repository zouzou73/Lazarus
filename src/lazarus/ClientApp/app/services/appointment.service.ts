import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { AppointmentEndpoint } from './appointment-endpoint.service';
import { ProviderService } from './provider.service';
import { PatientService } from './patient.service';
import { AuthService } from './auth.service';
import { Appointment } from '../models/appointment.model';
import { Patient } from '../models/patient.model';
import { Provider } from '../models/provider.model';



@Injectable()
export class AppointmentService {

    constructor(private appointmentEndpoint: AppointmentEndpoint, private providerService: ProviderService, private patientservice: PatientService, private authService: AuthService) {

    }


    getAppointment(appointmentId: number) {

        return this.appointmentEndpoint.getAppointmentEndpoint(appointmentId)
            .map((response: Response) => Appointment.Create(response.json()));
    }

    getUpcomingAppointments(page?: number, pageSize?: number) {

        return this.appointmentEndpoint.getUpcomingAppointmentsEndpoint(page, pageSize)
            .map((response: Response) => this.getAppointmentsFromResponse(response));
    }

    getUserUpcomingAppointments(userId: string, page?: number, pageSize?: number) {

        return this.appointmentEndpoint.getUserUpcomingAppointmentsEndpoint(userId, page, pageSize)
            .map((response: Response) => this.getAppointmentsFromResponse(response));
    }

    getUserTodaysAppointments(userId?: string) {

        return this.appointmentEndpoint.getUserTodaysAppointmentsEndpoint(userId)
            .map((response: Response) => this.getAppointmentsFromResponse(response));
    }

    getCurrentUserUpcomingAppointments(page?: number, pageSize?: number) {

        return this.getUserUpcomingAppointments(this.currentUserId, page, pageSize);
    }

    getAllAppointments(page: number, pageSize: number) {

        return this.appointmentEndpoint.getAllAppointmentsEndpoint(page, pageSize)
            .map((response: Response) => this.getAppointmentsFromResponse(response));
    }

    getAllUserAppointments(userId: string, page?: number, pageSize?: number) {

        return this.appointmentEndpoint.getAllUserAppointmentsEndpoint(userId, page, pageSize)
            .map((response: Response) => this.getAppointmentsFromResponse(response));
    }

    getAllCurrentUserAppointments(page?: number, pageSize?: number) {

        return this.getAllUserAppointments(this.currentUserId, page, pageSize);
    }


    getPatientsAndProviders(page?: number, pageSize?: number) {

        return Observable.forkJoin(
            this.patientservice.getPatients(page, pageSize),
            this.providerService.getProviders(page, pageSize));
    }




    newAppointment(appointment: Appointment) {
        return this.appointmentEndpoint.getNewAppointmentEndpoint(appointment)
            .map((response: Response) => <Appointment>response.json());
    }

    updateAppointment(appointment: Appointment) {
        return this.appointmentEndpoint.getUpdateAppointmentEndpoint(appointment, appointment.id)
            .map((response: Response) => <Appointment>response.json());
    }



    deleteAppointment(appointmentOrAppointmentId: number | Appointment): Observable<Appointment> {

        if (typeof appointmentOrAppointmentId === 'number' || appointmentOrAppointmentId instanceof Number) { //Todo: Test me if its check is valid
            return this.appointmentEndpoint.getDeleteAppointmentEndpoint(<number>appointmentOrAppointmentId)
                .map((response: Response) => <Appointment>response.json());
        }
        else {
            return this.deleteAppointment(appointmentOrAppointmentId.id);
        }
    }


    private getAppointmentsFromResponse(response: Response) {
        let result = response.json()
        let appointments: Appointment[] = [];

        for (let i in result) {
            appointments[i] = Appointment.Create(result[i]);
        }

        return appointments;
    }



    get currentUserId() {
        if (this.authService.currentUser)
            return this.authService.currentUser.id;
        else
            return "";
    }



    get currentUser() {
        return this.authService.currentUser;
    }
}