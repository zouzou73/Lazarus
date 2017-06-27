import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class PatientEndpoint extends EndpointFactory {

    private readonly _patientsUrl: string = "/api/patients";
    private readonly _currentPatientUrl: string = "/api/patients/me";
    private readonly _patientRolesUrl: string = "/api/patients/roles";

    get patientsUrl() { return this.configurations.baseUrl + this._patientsUrl; }
    get currentPatientUrl() { return this.configurations.baseUrl + this._currentPatientUrl; }
    get patientRolesUrl() { return this.configurations.baseUrl + this._patientRolesUrl; }



    constructor(http: Http, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }



    getPatientEndpoint(patientOrUserId?: number | string): Observable<Response> {
        let endpointUrl = patientOrUserId ? `${this.patientsUrl}/${patientOrUserId}` : this.currentPatientUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getPatientEndpoint(patientOrUserId));
            });
    }



    getPatientsEndpoint(page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = page && pageSize ? `${this.patientsUrl}/${page}/${pageSize}` : this.patientsUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getPatientsEndpoint(page, pageSize));
            });
    }




    getNewPatientEndpoint(patientObject: any): Observable<Response> {

        return this.http.post(this.patientsUrl, JSON.stringify(patientObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNewPatientEndpoint(patientObject));
            });
    }


    getUpdatePatientEndpoint(patientObject: any, patientId: number): Observable<Response> {
        let endpointUrl = `${this.patientsUrl}/${patientId}`;

        return this.http.put(endpointUrl, JSON.stringify(patientObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpdatePatientEndpoint(patientObject, patientId));
            });
    }



    getDeletePatientEndpoint(patientId: number): Observable<Response> {
        let endpointUrl = `${this.patientsUrl}/${patientId}`;

        return this.http.delete(endpointUrl, this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getDeletePatientEndpoint(patientId));
            });
    }





    getPatientRolesEndpoint(page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = page && pageSize ? `${this.patientRolesUrl}/${page}/${pageSize}` : this.patientRolesUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getPatientRolesEndpoint(page, pageSize));
            });
    }

}