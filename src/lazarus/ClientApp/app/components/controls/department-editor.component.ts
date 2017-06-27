import { Component, ViewChild } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from "../../services/account.service";
import { DepartmentService } from "../../services/department.service";
import { Department } from '../../models/department.model';
import { Permission } from '../../models/permission.model';


@Component({
    selector: 'department-editor',
    templateUrl: './department-editor.component.html',
    styleUrls: ['./department-editor.component.css']
})
export class DepartmentEditorComponent {

    private isNewDepartment = false;
    private isSaving: boolean;
    private showValidationErrors: boolean = true;
    private formResetToggle = true;
    private departmentEdit: Department = new Department();

    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;


    @ViewChild('f')
    private form;



    constructor(private alertService: AlertService, private accountService: AccountService, private departmentService: DepartmentService) {
    }



    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }


    private save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Saving changes...");

        if (this.isNewDepartment) {
            this.departmentService.newDepartment(this.departmentEdit).subscribe(department => this.saveSuccessHelper(department), error => this.saveFailedHelper(error));
        }
        else {
            this.departmentService.updateDepartment(this.departmentEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }




    private saveSuccessHelper(department?: Department) {
        if (department)
            Object.assign(this.departmentEdit, department);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;

        if (this.isNewDepartment)
            this.alertService.showMessage("Success", `Department \"${this.departmentEdit.name}\" was created successfully`, MessageSeverity.success);
        else
            this.alertService.showMessage("Success", `Changes to department \"${this.departmentEdit.name}\" was saved successfully`, MessageSeverity.success);


        this.departmentEdit = new Department();
        this.resetForm();


        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }



    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }


    private cancel() {
        this.departmentEdit = new Department();

        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage("Cancelled", "Operation cancelled by user", MessageSeverity.default);
        this.alertService.resetStickyMessage();

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }



    resetForm(replace = false) {

        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }


    newDepartment() {
        this.isNewDepartment = true;
        this.showValidationErrors = true;

        this.departmentEdit = new Department();

        return this.departmentEdit;
    }

    editDepartment(department: Department) {
        if (department) {
            this.isNewDepartment = false;
            this.showValidationErrors = true;

            this.departmentEdit = new Department();
            Object.assign(this.departmentEdit, department);

            return this.departmentEdit;
        }
        else {
            return this.newDepartment();
        }
    }



    get canManageDepartments() {
        return this.accountService.userHasPermission(Permission.manageRolesPermission);  //Todo: Consider creating separate permission for departments
    }
}
