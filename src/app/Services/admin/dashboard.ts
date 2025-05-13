// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';



@Injectable({
    providedIn: 'root',
})
export class AdminDashboard {
    // Update this URL to match your API endpoint
    private apiUrl = 'http://triad.forestepinstitute.com/api/';

    constructor(
        private httpClient: HttpClient
    ) { }

    GetDashboardCardsUser(CompanyID: string, token: string): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams().set('CompanyID', CompanyID.toString());
        return this.httpClient.get<any>(this.apiUrl + 'Dashboard/DashboardUserCountReturn', {
            headers,
            params,
        });
    }
    GetDashboardCardsWork(CompanyID: string, token: string): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams().set('CompanyID', CompanyID.toString());
        return this.httpClient.get<any>(this.apiUrl + 'Dashboard/DashboardProjectCountReturn', {
            headers,
            params,
        });
    }


    GetScheduler(
        companyid: string,
        jobid: string,
        managerid: string,
        userid: string,
        token: string
    ): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        const params = new HttpParams()
            .set('companyid', companyid.toString())
            .set('jobid', jobid.toString())
            .set('managerid', managerid.toString())
            .set('userid', userid.toString()); // Pass userId as a query parameter

        return this.httpClient.get<any>(this.apiUrl + 'Work/ReturnSchedule', {
            headers,
            params,
        });
    }

    GetColorNotes(
        companyid: string,
        token: string,
        colorId: string
    ): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const url = `${this.apiUrl}Work/CompanyColorReturn/${colorId}`;

        const params = new HttpParams()
            //wrong splling of company
            .set('compnayid', companyid.toString())

        return this.httpClient.get<any>(url, {
            headers,
            params,
        });


    }


}
