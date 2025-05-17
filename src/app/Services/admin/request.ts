// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';



@Injectable({
    providedIn: 'root',
})
export class AdminRequest {
    // Update this URL to match your API endpoint
    private apiUrl = 'http://triad.forestepinstitute.com/api/';

    constructor(
        private httpClient: HttpClient
    ) { }


    GetRequest(
        token: string,
        workid: number,
        requestid: number,
        userid: number,
        pagenumber: number,
        pagesize: number,
    ): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        const params = new HttpParams()
            //wrong splling of company
            .set('WorkID', workid.toString())
            .set('RequestID', requestid.toString())
            .set('UserID', userid.toString())
            .set('PageNumber', pagenumber.toString())
            .set('PageSize', pagesize.toString())

        return this.httpClient.get<any>(this.apiUrl + 'Work/RequestReturn', {
            headers,
            params,
        });


    }

    ApproveRequest(token: string, payload: {
        WorkSubject: string,
        RequestID: number,
        RequestNote: string,
        isApproval: number,
        isActive: number,
        isDeleted: number,
        OldStartDateTime: string,
        OldEndDateTime: string,
        StartDate: string,
        EndDate: string,
        WorkID: number,
        UserID: number,
        UserName: string,
        CreatedOn: string
    }): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });


        return this.httpClient.post<any>(this.apiUrl + 'Work/RequestApproval', payload, {
            headers,
        });


    }


}
