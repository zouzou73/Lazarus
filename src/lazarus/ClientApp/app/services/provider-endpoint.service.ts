import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class ProviderEndpoint extends EndpointFactory {

    private readonly _providersUrl: string = "/api/providers";
    private readonly _currentProviderUrl: string = "/api/providers/me";
    private readonly _providerAvailabilityUrl: string = "/api/providers/hours";
    private readonly _currentProviderAvailabilityUrl: string = "/api/providers/hours/me";
    private readonly _providerRolesUrl: string = "/api/providers/roles";

    get providersUrl() { return this.configurations.baseUrl + this._providersUrl; }
    get currentProviderUrl() { return this.configurations.baseUrl + this._currentProviderUrl; }
    get providerAvailabilityUrl() { return this.configurations.baseUrl + this._providerAvailabilityUrl; }
    get currentProviderAvailabilityUrl() { return this.configurations.baseUrl + this._currentProviderAvailabilityUrl; }
    get providerRolesUrl() { return this.configurations.baseUrl + this._providerRolesUrl; }



    constructor(http: Http, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }



    getProviderEndpoint(providerOrUserId?: number | string): Observable<Response> {
        let endpointUrl = providerOrUserId ? `${this.providersUrl}/${providerOrUserId}` : this.currentProviderUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getProviderEndpoint(providerOrUserId));
            });
    }



    getProvidersEndpoint(page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = page && pageSize ? `${this.providersUrl}/${page}/${pageSize}` : this.providersUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getProvidersEndpoint(page, pageSize));
            });
    }



    getProvidersOnDutyEndpoint(start: Date, end?: Date, page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = `${this.providersUrl}/${start}`;

        if (end)
            endpointUrl += "/" + end;

        if (page && pageSize)
            endpointUrl += "/" + page + "/" + pageSize;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getProvidersOnDutyEndpoint(start, end, page, pageSize));
            });
    }




    getNewProviderEndpoint(providerObject: any): Observable<Response> {

        return this.http.post(this.providersUrl, JSON.stringify(providerObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNewProviderEndpoint(providerObject));
            });
    }


    getUpdateProviderEndpoint(providerObject: any, providerId: number): Observable<Response> {
        let endpointUrl = `${this.providersUrl}/${providerId}`;

        return this.http.put(endpointUrl, JSON.stringify(providerObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpdateProviderEndpoint(providerObject, providerId));
            });
    }



    getDeleteProviderEndpoint(providerId: number): Observable<Response> {
        let endpointUrl = `${this.providersUrl}/${providerId}`;

        return this.http.delete(endpointUrl, this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getDeleteProviderEndpoint(providerId));
            });
    }





    getProviderRolesEndpoint(page?: number, pageSize?: number): Observable<Response> {
        let endpointUrl = page && pageSize ? `${this.providerRolesUrl}/${page}/${pageSize}` : this.providerRolesUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getProviderRolesEndpoint(page, pageSize));
            });
    }





    getProviderAvailabilityEndpoint(providerId?: number): Observable<Response> {
        let endpointUrl = providerId ? `${this.providerAvailabilityUrl}/${providerId}` : this.currentProviderAvailabilityUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getProviderAvailabilityEndpoint(providerId));
            });
    }



    getProvidersAvailabilityEndpoint(page: number, pageSize: number): Observable<Response> {
        let endpointUrl = `${this.providerAvailabilityUrl}/${page}/${pageSize}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getProvidersAvailabilityEndpoint(page, pageSize));
            });
    }



    getNewAvailabilityEndpoint(availabilityGeneratorObject: any): Observable<Response> {

        return this.http.post(this.providerAvailabilityUrl, JSON.stringify(availabilityGeneratorObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNewAvailabilityEndpoint(availabilityGeneratorObject));
            });
    }


    getUpdateAvailabilityEndpoint(availabilityObject: any, availabilityId: number): Observable<Response> {
        let endpointUrl = `${this.providerAvailabilityUrl}/${availabilityId}`;

        return this.http.put(endpointUrl, JSON.stringify(availabilityObject), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUpdateAvailabilityEndpoint(availabilityObject, availabilityId));
            });
    }


    getDeleteAvailabilityEndpoint(availabilityId: number): Observable<Response> {
        let endpointUrl = `${this.providerAvailabilityUrl}/${availabilityId}`;

        return this.http.delete(endpointUrl, this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getDeleteAvailabilityEndpoint(availabilityId));
            });
    }

}