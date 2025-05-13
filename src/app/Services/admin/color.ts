// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';



@Injectable({
    providedIn: 'root',
})
export class AdminColor {
    // Update this URL to match your API endpoint
    private apiUrl = 'http://triad.forestepinstitute.com/api/';

    constructor(
        private httpClient: HttpClient
    ) { }


    GetColor(
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

    CreateColor(token: string, payload: {
        ColorID: number,
        ColorName: string,
        Color_Hex: string,
        ColorDetail: string,
        CompanyID: number,
        UserID: number
    }): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });


        return this.httpClient.post<any>(this.apiUrl + 'Work/ColorCreate', payload, {
            headers,
        });


    }


}
