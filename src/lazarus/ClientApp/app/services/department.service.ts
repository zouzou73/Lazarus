import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { DepartmentEndpoint } from './department-endpoint.service';
import { Department } from '../models/department.model';



@Injectable()
export class DepartmentService {

    constructor(private departmentEndpoint: DepartmentEndpoint, private authService: AuthService) {

    }


    getDepartment(departmentId: number) {

        return this.departmentEndpoint.getDepartmentEndpoint(departmentId)
            .map((response: Response) => <Department>response.json());
    }

    getDepartments(page?: number, pageSize?: number) {

        return this.departmentEndpoint.getDepartmentsEndpoint(page, pageSize)
            .map((response: Response) => <Department[]>response.json());
    }


    newDepartment(department: Department) {
        return this.departmentEndpoint.getNewDepartmentEndpoint(department)
            .map((response: Response) => <Department>response.json());
    }

    updateDepartment(department: Department) {
        return this.departmentEndpoint.getUpdateDepartmentEndpoint(department, department.id);
    }



    deleteDepartment(departmentId: number | Department): Observable<Department> {

        if (typeof departmentId === 'number' || departmentId instanceof Number) { //Todo: Test me if its check is valid
            return this.departmentEndpoint.getDeleteDepartmentEndpoint(<number>departmentId)
                .map((response: Response) => <Department>response.json());
        }
        else {
            return this.deleteDepartment(departmentId.id);
        }
    }



    get currentUser() {
        return this.authService.currentUser;
    }
}