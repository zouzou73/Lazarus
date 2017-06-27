import { Injectable } from '@angular/core';

import { AppTranslationService } from './app-translation.service';
import { LocalStoreManager } from './local-store-manager.service';
import { DBkeys } from './db-Keys';
import { Utilities } from './utilities';



type UserConfiguration = {
    language: string,
    homeUrl: string,
    theme: string,
    showDashboardMedicalHistory: boolean,
    showDashboardNotifications: boolean,
    showDashboardAppointments: boolean
};

@Injectable()
export class ConfigurationService {

    public static readonly appVersion: string = "1.0.0";

    public baseUrl: string = Utilities.baseUrl().replace(/\/$/, '');
    public fallbackBaseUrl: string = "http://ebenmonney.com/demo/quickapp";
    public loginUrl: string = "/Login";

    //***Specify default configurations here***
    public static readonly defaultLanguage: string = "en";
    public static readonly defaultHomeUrl: string = "/appointments";
    public static readonly defaultTheme: string = "Default";
    public static readonly defaultShowDashboardMedicalHistory: boolean = true;
    public static readonly defaultShowDashboardNotifications: boolean = true;
    public static readonly defaultShowDashboardAppointments: boolean = false;
    //***End of defaults***  

    private _language: string = null;
    private _homeUrl: string = null;
    private _theme: string = null;
    private _showDashboardMedicalHistory: boolean = null;
    private _showDashboardNotifications: boolean = null;
    private _showDashboardAppointments: boolean = null;


    constructor(private localStorage: LocalStoreManager, private translationService: AppTranslationService) {
        this.loadLocalChanges();
    }



    private loadLocalChanges() {

        if (this.localStorage.exists(DBkeys.LANGUAGE)) {
            this._language = this.localStorage.getDataObject<string>(DBkeys.LANGUAGE);
            this.translationService.changeLanguage(this._language);
        }
        else {
            this.resetLanguage();
        }

        if (this.localStorage.exists(DBkeys.HOME_URL))
            this._homeUrl = this.localStorage.getDataObject<string>(DBkeys.HOME_URL);

        if (this.localStorage.exists(DBkeys.THEME))
            this._theme = this.localStorage.getDataObject<string>(DBkeys.THEME);

        if (this.localStorage.exists(DBkeys.SHOW_DASHBOARD_MEDICAL_HISTORY))
            this._showDashboardMedicalHistory = this.localStorage.getDataObject<boolean>(DBkeys.SHOW_DASHBOARD_MEDICAL_HISTORY);

        if (this.localStorage.exists(DBkeys.SHOW_DASHBOARD_NOTIFICATIONS))
            this._showDashboardNotifications = this.localStorage.getDataObject<boolean>(DBkeys.SHOW_DASHBOARD_NOTIFICATIONS);

        if (this.localStorage.exists(DBkeys.SHOW_DASHBOARD_APPOINTMENTS))
            this._showDashboardAppointments = this.localStorage.getDataObject<boolean>(DBkeys.SHOW_DASHBOARD_APPOINTMENTS);
    }


    private saveToLocalStore(data: any, key: string) {
        setTimeout(() => this.localStorage.savePermanentData(data, key));
    }


    public import(jsonValue: string) {

        this.clearLocalChanges();

        if (!jsonValue)
            return;

        let importValue: UserConfiguration = Utilities.JSonTryParse(jsonValue);

        if (importValue.language != null)
            this.language = importValue.language;

        if (importValue.homeUrl != null)
            this.homeUrl = importValue.homeUrl;

        if (importValue.theme != null)
            this.theme = importValue.theme;

        if (importValue.showDashboardMedicalHistory != null)
            this.showDashboardMedicalHistory = importValue.showDashboardMedicalHistory;

        if (importValue.showDashboardNotifications != null)
            this.showDashboardNotifications = importValue.showDashboardNotifications;

        if (importValue.showDashboardAppointments != null)
            this.showDashboardAppointments = importValue.showDashboardAppointments;
    }


    public export(changesOnly = true): string {

        let exportValue: UserConfiguration =
            {
                language: changesOnly ? this._language : this.language,
                homeUrl: changesOnly ? this._homeUrl : this.homeUrl,
                theme: changesOnly ? this._theme : this.theme,
                showDashboardMedicalHistory: changesOnly ? this._showDashboardMedicalHistory : this.showDashboardMedicalHistory,
                showDashboardNotifications: changesOnly ? this._showDashboardNotifications : this.showDashboardNotifications,
                showDashboardAppointments: changesOnly ? this._showDashboardAppointments : this.showDashboardAppointments
            };

        return JSON.stringify(exportValue);
    }


    public clearLocalChanges() {
        this._language = null;
        this._homeUrl = null;
        this._theme = null;
        this._showDashboardMedicalHistory = null;
        this._showDashboardNotifications = null;
        this._showDashboardAppointments = null;

        this.localStorage.deleteData(DBkeys.LANGUAGE);
        this.localStorage.deleteData(DBkeys.HOME_URL);
        this.localStorage.deleteData(DBkeys.THEME);
        this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_MEDICAL_HISTORY);
        this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_NOTIFICATIONS);
        this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_APPOINTMENTS);

        this.resetLanguage();
    }


    private resetLanguage() {
        let language = this.translationService.useBrowserLanguage();

        if (language) {
            this._language = language;
        }
        else {
            this._language = this.translationService.changeLanguage()
        }
    }




    set language(value: string) {
        this._language = value;
        this.saveToLocalStore(value, DBkeys.LANGUAGE);
        this.translationService.changeLanguage(value);
    }
    get language() {
        if (this._language != null)
            return this._language;

        return ConfigurationService.defaultLanguage;
    }


    set homeUrl(value: string) {
        this._homeUrl = value;
        this.saveToLocalStore(value, DBkeys.HOME_URL);
    }
    get homeUrl() {
        if (this._homeUrl != null)
            return this._homeUrl;

        return ConfigurationService.defaultHomeUrl;
    }


    set theme(value: string) {
        this._theme = value;
        this.saveToLocalStore(value, DBkeys.THEME);
    }
    get theme() {
        if (this._theme != null)
            return this._theme;

        return ConfigurationService.defaultTheme;
    }


    set showDashboardMedicalHistory(value: boolean) {
        this._showDashboardMedicalHistory = value;
        this.saveToLocalStore(value, DBkeys.SHOW_DASHBOARD_MEDICAL_HISTORY);
    }
    get showDashboardMedicalHistory() {
        if (this._showDashboardMedicalHistory != null)
            return this._showDashboardMedicalHistory;

        return ConfigurationService.defaultShowDashboardMedicalHistory;
    }


    set showDashboardNotifications(value: boolean) {
        this._showDashboardNotifications = value;
        this.saveToLocalStore(value, DBkeys.SHOW_DASHBOARD_NOTIFICATIONS);
    }
    get showDashboardNotifications() {
        if (this._showDashboardNotifications != null)
            return this._showDashboardNotifications;

        return ConfigurationService.defaultShowDashboardNotifications;
    }


    set showDashboardAppointments(value: boolean) {
        this._showDashboardAppointments = value;
        this.saveToLocalStore(value, DBkeys.SHOW_DASHBOARD_APPOINTMENTS);
    }
    get showDashboardAppointments() {
        if (this._showDashboardAppointments != null)
            return this._showDashboardAppointments;

        return ConfigurationService.defaultShowDashboardAppointments;
    }
}