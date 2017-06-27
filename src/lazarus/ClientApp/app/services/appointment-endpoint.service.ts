import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class AppointmentEndpoint extends EndpointFactory {

    private readonly _appointmentsUrl: string = "/api/appointments";
    private readonly _todaysAppointmentsUrl: string = "/api/appointments/today";
    private readonly _allAppointmentsUrl: string = "/api/appointments/all";

    get appointmentsUrl() { return this.configurations.baseUrl + this._appointmentsUrl; }
    get todaysAppointmentsUrl() { return this.configurations.baseUrl + this._todaysAppointmentsUrl; }
    get allAppointmentsUrl() { return this.configurations.baseUrl + this._allAppointmentsUrl; }




    constructor(http: Http, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }



    getAppointmentEndpoint(appointmentId: number): Observable<Response> {
        let endpointUrl = `${this.appointmentsUrl}/${appointmentId}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getAppointmentEndpoint(appointmentId));
            });
    }



    getUpcomingAppointmentsEndpoint(page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = page && pageSize ? `${this.appointmentsUrl}/${page}/${pageSize}` : this.appointmentsUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpcomingAppointmentsEndpoint(page, pageSize));
            });
    }



    getUserUpcomingAppointmentsEndpoint(userId: string, page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = page && pageSize ? `${this.appointmentsUrl}/${userId}/${page}/${pageSize}` : `${this.appointmentsUrl}/${userId}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUserUpcomingAppointmentsEndpoint(userId, page, pageSize));
            });
    }



    getUserTodaysAppointmentsEndpoint(userId?: string): Observable<Response> {
        let endpointUrl = userId ? `${this.todaysAppointmentsUrl}/${userId}` : this.todaysAppointmentsUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUserTodaysAppointmentsEndpoint(userId));
            });
    }





    getAllAppointmentsEndpoint(page: number, pageSize: number): Observable<Response> {
        let endpointUrl = `${this.allAppointmentsUrl}/${page}/${pageSize}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpcomingAppointmentsEndpoint(page, pageSize));
            });
    }



    getAllUserAppointmentsEndpoint(userId: string, page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = page && pageSize ? `${this.allAppointmentsUrl}/${userId}/${page}/${pageSize}` : `${this.allAppointmentsUrl}/${userId}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUserUpcomingAppointmentsEndpoint(userId, page, pageSize));
            });
    }


    getNewAppointmentEndpoint(appointmentObject: any): Observable<Response> {

        return this.http.post(this.appointmentsUrl, JSON.stringify(appointmentObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNewAppointmentEndpoint(appointmentObject));
            });
    }


    getUpdateAppointmentEndpoint(appointmentObject: any, appointmentId: number): Observable<Response> {
        let endpointUrl = `${this.appointmentsUrl}/${appointmentId}`;

        return this.http.put(endpointUrl, JSON.stringify(appointmentObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpdateAppointmentEndpoint(appointmentObject, appointmentId));
            });
    }



    getDeleteAppointmentEndpoint(appointmentId: number): Observable<Response> {
        let endpointUrl = `${this.appointmentsUrl}/${appointmentId}`;

        return this.http.delete(endpointUrl, this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getDeleteAppointmentEndpoint(appointmentId));
            });
    }

}