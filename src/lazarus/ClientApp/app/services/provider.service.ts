import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { ProviderEndpoint } from './provider-endpoint.service';
import { DepartmentEndpoint } from './department-endpoint.service';
import { Provider } from '../models/provider.model';
import { Availability, AvailabilityGenerator } from '../models/availability.model';
import { Role } from '../models/role.model';
import { Department } from '../models/department.model';



@Injectable()
export class ProviderService {

    constructor(private providerEndpoint: ProviderEndpoint, private departmentEndpoint: DepartmentEndpoint, private authService: AuthService) {

    }


    getProvider(providerOrUserId?: number | string) {

        return this.providerEndpoint.getProviderEndpoint(providerOrUserId)
            .map((response: Response) => Provider.Create(response.json()));
    }

    getProviderAndDepartments(providerOrUserId?: number | string) {

        return Observable.forkJoin(
            this.providerEndpoint.getProviderEndpoint(providerOrUserId).map((response: Response) => Provider.Create(response.json())),
            this.departmentEndpoint.getDepartmentsEndpoint().map((response: Response) => <Department[]>response.json()));
    }


    getProviders(page?: number, pageSize?: number) {

        return this.providerEndpoint.getProvidersEndpoint(page, pageSize)
            .map((response: Response) => this.getProvidersFromResponse(response));
    }

    getProvidersAndDepartments(page?: number, pageSize?: number) {

        return Observable.forkJoin(
            this.providerEndpoint.getProvidersEndpoint(page, pageSize).map((response: Response) => this.getProvidersFromResponse(response)),
            this.departmentEndpoint.getDepartmentsEndpoint().map((response: Response) => <Department[]>response.json()));
    }

    getProvidersAndDepartmentsAndRoles(page?: number, pageSize?: number) {

        return Observable.forkJoin(
            this.providerEndpoint.getProvidersEndpoint(page, pageSize).map((response: Response) => this.getProvidersFromResponse(response)),
            this.departmentEndpoint.getDepartmentsEndpoint().map((response: Response) => <Department[]>response.json()),
            this.providerEndpoint.getProviderRolesEndpoint().map((response: Response) => <Role[]>response.json()));
    }

    getProvidersAndProviderRoles(page?: number, pageSize?: number) {

        return Observable.forkJoin(
            this.providerEndpoint.getProvidersEndpoint(page, pageSize).map((response: Response) => this.getProvidersFromResponse(response)),
            this.providerEndpoint.getProviderRolesEndpoint().map((response: Response) => <Role[]>response.json()));
    }

    getProvidersOnDuty(start: Date, end?: Date, page?: number, pageSize?: number) {

        return this.providerEndpoint.getProvidersOnDutyEndpoint(start, end, page, pageSize)
            .map((response: Response) => this.getProvidersFromResponse(response));
    }


    newProvider(provider: Provider) {
        return this.providerEndpoint.getNewProviderEndpoint(provider)
            .map((response: Response) => Provider.Create(response.json()));
    }

    updateProvider(provider: Provider) {
        return this.providerEndpoint.getUpdateProviderEndpoint(provider, provider.id);
    }



    deleteProvider(providerOrProviderId: number | Provider): Observable<Provider> {

        if (typeof providerOrProviderId === 'number' || providerOrProviderId instanceof Number) { //Todo: Test me if its check is valid
            return this.providerEndpoint.getDeleteProviderEndpoint(<number>providerOrProviderId)
                .map((response: Response) => Provider.Create(response.json()));
        }
        else {
            return this.deleteProvider(providerOrProviderId.id);
        }
    }





    getProviderAvailability(providerId?: number) {

        return this.providerEndpoint.getProviderAvailabilityEndpoint(providerId)
            .map((response: Response) => this.getAvailabilityFromResponse(response));
    }

    getCurrentProviderAndAvailability() {

        return Observable.forkJoin(
            this.providerEndpoint.getProviderEndpoint().map((response: Response) => Provider.Create(response.json())),
            this.getProviderAvailability());
    }


    getProvidersAvailability(page: number, pageSize: number) {

        return this.providerEndpoint.getProvidersAvailabilityEndpoint(page, pageSize)
            .map((response: Response) => this.getAvailabilityFromResponse(response));
    }


    newAvailability(availability: AvailabilityGenerator) {
        return this.providerEndpoint.getNewAvailabilityEndpoint(availability)
            .map((response: Response) => this.getAvailabilityFromResponse(response));
    }

    updateAvailability(availability: Availability) {
        return this.providerEndpoint.getUpdateAvailabilityEndpoint(availability, availability.id);
    }


    toggleAvailabilityIsReserved(availability: Availability, isReserved?: boolean) {

        let availability_ = new Availability();
        Object.assign(availability_, availability);

        if (isReserved)
            availability_.isReserved = isReserved;
        else
            availability_.isReserved = !availability_.isReserved;

        return this.providerEndpoint.getUpdateAvailabilityEndpoint(availability_, availability_.id);
    }


    deleteAvailability(availabilityOrAvailabilityId: number | Availability): Observable<Availability> {

        if (typeof availabilityOrAvailabilityId === 'number' || availabilityOrAvailabilityId instanceof Number) { //Todo: Test me if its check is valid
            return this.providerEndpoint.getDeleteAvailabilityEndpoint(<number>availabilityOrAvailabilityId)
                .map((response: Response) => Availability.create(response.json()));
        }
        else {
            return this.deleteAvailability(availabilityOrAvailabilityId.id);
        }
    }





    private getProvidersFromResponse(response: Response) {
        let result = response.json()
        let providers: Provider[] = [];

        for (let i in result) {
            providers[i] = Provider.Create(result[i]);
        }

        return providers;
    }

    private getAvailabilityFromResponse(response: Response) {
        let result = response.json()
        let availability: Availability[] = [];

        for (let i in result) {
            availability[i] = Availability.create(result[i]);
        }

        return availability;
    }




    get currentUser() {
        return this.authService.currentUser;
    }
}