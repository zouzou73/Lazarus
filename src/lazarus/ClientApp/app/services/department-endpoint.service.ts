import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class DepartmentEndpoint extends EndpointFactory {

    private readonly _departmentsUrl: string = "/api/departments";

    get departmentsUrl() { return this.configurations.baseUrl + this._departmentsUrl; }



    constructor(http: Http, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }



    getDepartmentEndpoint(departmentId: number): Observable<Response> {
        let endpointUrl = `${this.departmentsUrl}/${departmentId}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getDepartmentEndpoint(departmentId));
            });
    }



    getDepartmentsEndpoint(page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = page && pageSize ? `${this.departmentsUrl}/${page}/${pageSize}` : this.departmentsUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getDepartmentsEndpoint(page, pageSize));
            });
    }



    getNewDepartmentEndpoint(departmentObject: any): Observable<Response> {

        return this.http.post(this.departmentsUrl, JSON.stringify(departmentObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNewDepartmentEndpoint(departmentObject));
            });
    }


    getUpdateDepartmentEndpoint(departmentObject: any, departmentId: number): Observable<Response> {
        let endpointUrl = `${this.departmentsUrl}/${departmentId}`;

        return this.http.put(endpointUrl, JSON.stringify(departmentObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpdateDepartmentEndpoint(departmentObject, departmentId));
            });
    }



    getDeleteDepartmentEndpoint(departmentId: number): Observable<Response> {
        let endpointUrl = `${this.departmentsUrl}/${departmentId}`;

        return this.http.delete(endpointUrl, this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getDeleteDepartmentEndpoint(departmentId));
            });
    }

}