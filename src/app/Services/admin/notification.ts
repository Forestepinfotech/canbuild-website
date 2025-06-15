import { JobDetail } from './../../Model/project.Model';
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

interface NotificationPayload {
    Token: string;
    Title: string;
    Body: string;
    accessToken: string;
    Data: {
        action: string;
        data: string;
        userid: string;
        type: string;
    };
}

@Injectable({
    providedIn: 'root',
})
export class AdminNotification {
    // Update this URL to match your API endpoint
    private apiUrl = 'http://triad.forestepinstitute.com/api/';

    constructor(
        private httpClient: HttpClient
    ) { }

    // Define a type for the notification payload


    SendNotification(token: string, workDetal: NotificationPayload): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        return this.httpClient.post<any>(this.apiUrl + 'Notification/SendNotification', workDetal, {
            headers
        });
    }




    GetUserId(token: string, id: number): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const url = `${this.apiUrl}Notification/UserDeviceToken/${id}`;

        return this.httpClient.get<any>(url, {
            headers
        });
    }


}
