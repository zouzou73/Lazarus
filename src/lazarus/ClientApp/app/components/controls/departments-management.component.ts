import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';//Todo: Change back to 'ng2-bootstrap/modal' when valorsoft fixes umd module

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { DepartmentService } from "../../services/department.service";
import { AccountService } from "../../services/account.service";
import { Permission } from '../../models/permission.model';
import { Utilities } from "../../services/utilities";
import { Department } from '../../models/department.model';
import { DepartmentEditorComponent } from "./department-editor.component";


@Component({
    selector: 'departments-management',
    templateUrl: './departments-management.component.html',
    styleUrls: ['./departments-management.component.css']
})
export class DepartmentsManagementComponent implements OnInit, AfterViewInit {
    columns: any[] = [];
    rows: Department[] = [];
    rowsCache: Department[] = [];
    editedDepartment: Department;
    sourceDepartment: Department;
    editingDepartmentName: string;
    loadingIndicator: boolean;



    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('departmentEditor')
    departmentEditor: DepartmentEditorComponent;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private accountService: AccountService, private departmentService: DepartmentService) {
    }


    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);
        this.columns = [
            { prop: "index", name: '#', width: 50, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'name', name: gT('departments.name'), width: 180 },
            { prop: 'description', name: gT('departments.description'), width: 350 },
            { prop: 'usersCount', name: gT('departments.users'), width: 30 }
        ];

        if (this.canManageDepartments)
            this.columns.push({ name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });

        this.loadData();
    }





    ngAfterViewInit() {

        this.departmentEditor.changesSavedCallback = () => {
            this.addNewDepartmentToList();
            this.editorModal.hide();
        };

        this.departmentEditor.changesCancelledCallback = () => {
            this.editedDepartment = null;
            this.sourceDepartment = null;
            this.editorModal.hide();
        };
    }


    addNewDepartmentToList() {
        if (this.sourceDepartment) {
            Object.assign(this.sourceDepartment, this.editedDepartment);
            this.editedDepartment = null;
            this.sourceDepartment = null;
        }
        else {
            let department = new Department();
            Object.assign(department, this.editedDepartment);
            this.editedDepartment = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>department).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, department);
            this.rows.splice(0, 0, department);
        }
    }




    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.departmentService.getDepartments()
            .subscribe(departments => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                departments.forEach((department, index, departments) => {
                    (<any>department).index = index + 1;
                });


                this.rowsCache = [...departments];
                this.rows = departments;
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Load Error", `Unable to retrieve departments from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }


    onSearchChanged(value: string) {
        if (value) {
            value = value.toLowerCase();

            let filteredRows = this.rowsCache.filter(r => {
                let isChosen = !value
                    || r.name.toLowerCase().indexOf(value) !== -1
                    || r.description && r.description.toLowerCase().indexOf(value) !== -1;

                return isChosen;
            });

            this.rows = filteredRows;
        }
        else {
            this.rows = [...this.rowsCache];
        }
    }

    onEditorModalHidden() {
        this.editingDepartmentName = null;
        this.departmentEditor.resetForm(true);
    }


    newDepartment() {
        this.editingDepartmentName = null;
        this.sourceDepartment = null;
        this.editedDepartment = this.departmentEditor.newDepartment();
        this.editorModal.show();
    }


    editDepartment(department: Department) {
        this.editingDepartmentName = department.name;
        this.sourceDepartment = department;
        this.editedDepartment = this.departmentEditor.editDepartment(department);
        this.editorModal.show();
    }

    deleteDepartment(row: Department) {
        this.alertService.showDialog('Are you sure you want to delete the \"' + row.name + '\" department?', DialogType.confirm, () => this.deleteDepartmentHelper(row));
    }


    deleteDepartmentHelper(row: Department) {

        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;

        this.departmentService.deleteDepartment(row)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Delete Error", `An error occured whilst deleting the department.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }


    get canManageDepartments() {
        return this.accountService.userHasPermission(Permission.manageRolesPermission); //Todo: Consider creating separate permission for departments
    }

}
