import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { ConsultationEndpoint } from './consultation-endpoint.service';
import { AppointmentService } from './appointment.service';
import { ProviderService } from './provider.service';
import { PatientService } from './patient.service';
import { Consultation } from '../models/consultation.model';



@Injectable()
export class ConsultationService {

    constructor(private consultationEndpoint: ConsultationEndpoint, private appointmentService: AppointmentService,
        private providerService: ProviderService, private patientService: PatientService, private authService: AuthService) {

    }


    getConsultation(consultationId: number) {

        return this.consultationEndpoint.getConsultationEndpoint(consultationId)
            .map((response: Response) => Consultation.Create(response.json()));
    }

    getAppointmentConsultations(appointmentId: number) {

        return this.consultationEndpoint.getConsultationsForAppointmentEndpoint(appointmentId)
            .map((response: Response) => this.getConsultationsFromResponse(response));
    }

    getProviderConsultations(providerOrUserId?: number | string, page?: number, pageSize?: number) {

        if (typeof providerOrUserId === 'number') {
            return this.consultationEndpoint.getProviderConsultationsEndpoint(<number>providerOrUserId, page, pageSize)
                .map((response: Response) => this.getConsultationsFromResponse(response));
        }
        else {
            return this.consultationEndpoint.getProviderConsultationsByUserIdEndpoint(<string>providerOrUserId, page, pageSize)
                .map((response: Response) => this.getConsultationsFromResponse(response));
        }
    }

    getPatientConsultations(patientOrUserId?: number | string, page?: number, pageSize?: number) {

        if (typeof patientOrUserId === 'number') {
            return this.consultationEndpoint.getPatientConsultationsEndpoint(<number>patientOrUserId, page, pageSize)
                .map((response: Response) => this.getConsultationsFromResponse(response));
        }
        else {
            return this.consultationEndpoint.getPatientConsultationsByUserIdEndpoint(<string>patientOrUserId, page, pageSize)
                .map((response: Response) => this.getConsultationsFromResponse(response));
        }
    }

    getConsultations(page?: number, pageSize?: number) {

        return this.consultationEndpoint.getConsultationsEndpoint(page, pageSize)
            .map((response: Response) => this.getConsultationsFromResponse(response));
    }

    getProviderAndConsultations(providerOrUserId?: number | string, page?: number, pageSize?: number) {

        return Observable.forkJoin(
            this.providerService.getProvider(providerOrUserId),
            this.getProviderConsultations(providerOrUserId, page, pageSize));
    }

    getTodaysAppointmentsProvidersAndPatients(userId?: string, page?: number, pageSize?: number) {

        return Observable.forkJoin(
            this.appointmentService.getUserTodaysAppointments(userId),
            this.providerService.getProviders(page, pageSize),
            this.patientService.getPatients(page, pageSize));
    }


    newConsultation(consultation: Consultation) {
        return this.consultationEndpoint.getNewConsultationEndpoint(consultation)
            .map((response: Response) => <Consultation>response.json());
    }

    updateConsultation(consultation: Consultation) {
        return this.consultationEndpoint.getUpdateConsultationEndpoint(consultation, consultation.id);
    }



    deleteConsultation(consultationId: number | Consultation): Observable<Consultation> {

        if (typeof consultationId === 'number' || consultationId instanceof Number) { //Todo: Test me if its check is valid
            return this.consultationEndpoint.getDeleteConsultationEndpoint(<number>consultationId)
                .map((response: Response) => <Consultation>response.json());
        }
        else {
            return this.deleteConsultation(consultationId.id);
        }
    }



    private getConsultationsFromResponse(response: Response) {
        let result = response.json()
        let appointments: Consultation[] = [];

        for (let i in result) {
            appointments[i] = Consultation.Create(result[i]);
        }

        return appointments;
    }


    get currentUser() {
        return this.authService.currentUser;
    }
}