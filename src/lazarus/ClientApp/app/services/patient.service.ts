import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { PatientEndpoint } from './patient-endpoint.service';
import { Patient } from '../models/patient.model';
import { Role } from '../models/role.model';



@Injectable()
export class PatientService {

    constructor(private patientEndpoint: PatientEndpoint, private authService: AuthService) {

    }


    getPatient(patientOrUserId?: number | string) {

        return this.patientEndpoint.getPatientEndpoint(patientOrUserId)
            .map((response: Response) => Patient.Create(response.json()));
    }


    getPatients(page?: number, pageSize?: number) {

        return this.patientEndpoint.getPatientsEndpoint(page, pageSize)
            .map((response: Response) => this.getPatientsFromResponse(response));
    }


    getPatientsAndPatientRoles(page?: number, pageSize?: number) {

        return Observable.forkJoin(
            this.patientEndpoint.getPatientsEndpoint(page, pageSize).map((response: Response) => this.getPatientsFromResponse(response)),
            this.patientEndpoint.getPatientRolesEndpoint().map((response: Response) => <Role[]>response.json()));
    }


    newPatient(patient: Patient) {
        return this.patientEndpoint.getNewPatientEndpoint(patient)
            .map((response: Response) => Patient.Create(response.json()));
    }

    updatePatient(patient: Patient) {
        return this.patientEndpoint.getUpdatePatientEndpoint(patient, patient.id);
    }



    deletePatient(patientOrPatientId: number | Patient): Observable<Patient> {

        if (typeof patientOrPatientId === 'number' || patientOrPatientId instanceof Number) { //Todo: Test me if its check is valid
            return this.patientEndpoint.getDeletePatientEndpoint(<number>patientOrPatientId)
                .map((response: Response) => Patient.Create(response.json()));
        }
        else {
            return this.deletePatient(patientOrPatientId.id);
        }
    }



    private getPatientsFromResponse(response: Response) {
        let result = response.json()
        let patients: Patient[] = [];

        for (let i in result) {
            patients[i] = Patient.Create(result[i]);
        }

        return patients;
    }



    get currentUser() {
        return this.authService.currentUser;
    }
}