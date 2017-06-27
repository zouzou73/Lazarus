import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class ConsultationEndpoint extends EndpointFactory {

    private readonly _consultationsUrl: string = "/api/consultations";
    private readonly _appointmentConsultationsUrl: string = "/api/consultations/appointment";
    private readonly _providerConsultationsUrl: string = "/api/consultations/provider";
    private readonly _patientConsultationsUrl: string = "/api/consultations/patient";

    get consultationsUrl() { return this.configurations.baseUrl + this._consultationsUrl; }
    get appointmentConsultationsUrl() { return this.configurations.baseUrl + this._appointmentConsultationsUrl; }
    get providerConsultationsUrl() { return this.configurations.baseUrl + this._providerConsultationsUrl; }
    get patientConsultationsUrl() { return this.configurations.baseUrl + this._patientConsultationsUrl; }



    constructor(http: Http, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }



    getConsultationEndpoint(consultationId: number): Observable<Response> {
        let endpointUrl = `${this.consultationsUrl}/${consultationId}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getConsultationEndpoint(consultationId));
            });
    }


    getConsultationsForAppointmentEndpoint(appointmentId: number): Observable<Response> {
        let endpointUrl = `${this.appointmentConsultationsUrl}/${appointmentId}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getConsultationsForAppointmentEndpoint(appointmentId));
            });
    }


    getProviderConsultationsEndpoint(providerId?: number, page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = this.providerConsultationsUrl;

        if (providerId)
            endpointUrl = `${endpointUrl}/${providerId}`;

        if (page && pageSize)
            endpointUrl = `${endpointUrl}/${page}/${pageSize}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getProviderConsultationsEndpoint(providerId, page, pageSize));
            });
    }

    getProviderConsultationsByUserIdEndpoint(userId?: string, page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = this.providerConsultationsUrl;

        if (userId)
            endpointUrl = `${endpointUrl}/${userId}`;

        if (page && pageSize)
            endpointUrl = `${endpointUrl}/${page}/${pageSize}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getProviderConsultationsByUserIdEndpoint(userId, page, pageSize));
            });
    }


    getPatientConsultationsEndpoint(patientId?: number, page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = this.patientConsultationsUrl;

        if (patientId)
            endpointUrl = `${endpointUrl}/${patientId}`;

        if (page && pageSize)
            endpointUrl = `${endpointUrl}/${page}/${pageSize}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getPatientConsultationsEndpoint(patientId, page, pageSize));
            });
    }


    getPatientConsultationsByUserIdEndpoint(userId?: string, page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = this.patientConsultationsUrl;

        if (userId)
            endpointUrl = `${endpointUrl}/${userId}`;

        if (page && pageSize)
            endpointUrl = `${endpointUrl}/${page}/${pageSize}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getPatientConsultationsByUserIdEndpoint(userId, page, pageSize));
            });
    }


    getConsultationsEndpoint(page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = page && pageSize ? `${this.consultationsUrl}/${page}/${pageSize}` : this.consultationsUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getConsultationsEndpoint(page, pageSize));
            });
    }



    getNewConsultationEndpoint(consultationObject: any): Observable<Response> {

        return this.http.post(this.consultationsUrl, JSON.stringify(consultationObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNewConsultationEndpoint(consultationObject));
            });
    }


    getUpdateConsultationEndpoint(consultationObject: any, consultationId: number): Observable<Response> {
        let endpointUrl = `${this.consultationsUrl}/${consultationId}`;

        return this.http.put(endpointUrl, JSON.stringify(consultationObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpdateConsultationEndpoint(consultationObject, consultationId));
            });
    }



    getDeleteConsultationEndpoint(consultationId: number): Observable<Response> {
        let endpointUrl = `${this.consultationsUrl}/${consultationId}`;

        return this.http.delete(endpointUrl, this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getDeleteConsultationEndpoint(consultationId));
            });
    }

}