import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { fadeInOut } from '../../services/animations';
import { BootstrapTabDirective } from "../../directives/bootstrap-tab.directive";
import { AccountService } from "../../services/account.service";
import { Permission } from '../../models/permission.model';


@Component({
    selector: 'appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.css'],
    animations: [fadeInOut]
})
export class AppointmentsComponent implements AfterViewInit, OnDestroy {

    isAppointmentsActived = true;
    isAvailabilityActived = false;

    fragmentSubscription: any;

    readonly appointmentsTab = "appointments";
    readonly availabilityTab = "availability";

    activeTab: string = this.appointmentsTab;


    @ViewChild("tab")
    tab: BootstrapTabDirective;


    constructor(private route: ActivatedRoute, private accountService: AccountService) {
    }


    ngAfterViewInit() {
        this.fragmentSubscription = this.route.fragment.subscribe(anchor => this.showContent(anchor));
    }


    ngOnDestroy() {
        this.fragmentSubscription.unsubscribe();
    }


    showContent(anchor: string) {
        if (!this.canAcceptAppointments)
            return;

        this.tab.show(`#${anchor || this.appointmentsTab}Tab`);
    }


    onShowTab(event) {
        this.setActiveTab(event.target.hash);

        switch (this.activeTab) {
            case this.appointmentsTab:
                this.isAppointmentsActived = true;
                this.isAvailabilityActived = false; //Force reload on tab change
                break;
            case this.availabilityTab:
                this.isAvailabilityActived = true;
                this.isAppointmentsActived = false; //Force reload on tab change
                break;
            default:
                throw new Error("Selected bootstrap tab is unknown. Selected Tab: " + this.activeTab);
        }
    }


    setActiveTab(tab: string) {
        this.activeTab = tab.split("#", 2).pop();
    }


    get canAcceptAppointments() {
        return this.accountService.userHasPermission(Permission.acceptAppointmentsPermission) || this.accountService.userHasPermission(Permission.manageAppointmentsPermission);
    }
}
