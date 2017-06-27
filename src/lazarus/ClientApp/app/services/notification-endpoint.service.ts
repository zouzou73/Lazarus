import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class NotificationEndpoint extends EndpointFactory {

    private readonly _notificationsUrl: string = "/api/notifications";
    private readonly _currentUserNotificationsUrl: string = "/api/notifications/me";
    private readonly _currentUserNewNotificationsUrl: string = "/api/notifications/me/new";
    private readonly _allNotificationsUrl: string = "/api/notifications/all";
    private readonly _pinNotificationsUrl: string = "/api/notifications/pin";
    private readonly _readNotificationsUrl: string = "/api/notifications/read";

    get notificationsUrl() { return this.configurations.baseUrl + this._notificationsUrl; }
    get currentUserNotificationUrl() { return this.configurations.baseUrl + this._currentUserNotificationsUrl; }
    get currentUserNewNotificationUrl() { return this.configurations.baseUrl + this._currentUserNewNotificationsUrl; }
    get allNotificationsUrl() { return this.configurations.baseUrl + this._allNotificationsUrl; }
    get pinNotificationsUrl() { return this.configurations.baseUrl + this._pinNotificationsUrl; }
    get readNotificationsUrl() { return this.configurations.baseUrl + this._readNotificationsUrl; }



    constructor(http: Http, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }



    getNotificationEndpoint(notificationId: number): Observable<Response> {
        let endpointUrl = `${this.notificationsUrl}/${notificationId}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNotificationEndpoint(notificationId));
            });
    }



    getNotificationsEndpoint(page: number, pageSize: number): Observable<Response> {
        let endpointUrl = `${this.allNotificationsUrl}/${page}/${pageSize}`;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNotificationsEndpoint(page, pageSize));
            });
    }



    getUnreadNotificationsEndpoint(userId?: string): Observable<Response> {
        let endpointUrl = userId ? `${this.notificationsUrl}/${userId}` : this.currentUserNotificationUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getUnreadNotificationsEndpoint(userId));
            });
    }



    getNewNotificationsEndpoint(lastNotificationDate?: Date): Observable<Response> {
        let endpointUrl = lastNotificationDate ? `${this.currentUserNewNotificationUrl}/${lastNotificationDate}` : this.currentUserNewNotificationUrl;

        return this.http.get(endpointUrl, this.getAuthHeader())
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getNewNotificationsEndpoint(lastNotificationDate));
            });
    }



    getPinUnpinNotificationEndpoint(notificationId: number, isPinned?: boolean, ): Observable<Response> {
        let endpointUrl = `${this.pinNotificationsUrl}/${notificationId}`;

        return this.http.put(endpointUrl, isPinned ? JSON.stringify(isPinned) : isPinned, this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getPinUnpinNotificationEndpoint(notificationId, isPinned));
            });
    }



    getReadUnreadNotificationEndpoint(notificationIds: number[], isRead: boolean, ): Observable<Response> {
        let endpointUrl = `${this.readNotificationsUrl}/${isRead}`;

        return this.http.put(endpointUrl, JSON.stringify(notificationIds), this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getReadUnreadNotificationEndpoint(notificationIds, isRead));
            });
    }



    getDeleteNotificationEndpoint(notificationId: number): Observable<Response> {
        let endpointUrl = `${this.notificationsUrl}/${notificationId}`;

        return this.http.delete(endpointUrl, this.getAuthHeader(true))
            .map((response: Response) => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, () => this.getDeleteNotificationEndpoint(notificationId));
            });
    }

}