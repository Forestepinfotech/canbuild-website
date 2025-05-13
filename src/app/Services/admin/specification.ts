import { JobDetail } from './../../Model/project.Model';
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { WorkModel } from '../../Model/Work.Model';



@Injectable({
    providedIn: 'root',
})
export class AdminSpecifications {
    // Update this URL to match your API endpoint
    private apiUrl = 'http://triad.forestepinstitute.com/api/';

    constructor(
        private httpClient: HttpClient
    ) { }



    GetSpecification(token: string, companyId: string, specificationID: number, active: number)
        : Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
            //wrong splling of company
            .set('companyid', companyId.toString())
            .set('specificationid', specificationID.toString())
            .set('active', active.toString())
        return this.httpClient.get<any>(this.apiUrl + 'Specification/SpecificationReturn', {
            headers,
            params
        });
    }

    UpdateSpecification(token: string, payload: {
        JobID: number,
        JobDetail: string,
        SpecificationID: number,
        Specification: string,
        isDone: number,
        Done: string,
        CompanyID: number,
        UserID: number,
        isActive: number,
        WorkID: number,
        WorkSubject: string
    }): Observable<any> {

        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });


        return this.httpClient.post<any>(
            this.apiUrl + 'Specification/SpecificationUpdate',
            payload,
            { headers }
        );
    }

    CreateSpecification(token: string, payload: {
        JobDetail: string | " ",
        SpecificationID: number,
        Specification: string,
        isDone: number,
        Done: string,
        CompanyID: number,
        UserID: number,
        isActive: number,
        WorkID: number,
        WorkSubject: string
    }): Observable<any> {

        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });


        return this.httpClient.post<any>(
            this.apiUrl + 'Specification/SpecificationCreate',
            payload,
            { headers }
        );
    }


    DeleteSpecification(token: string, id: number): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        const url = `${this.apiUrl}/Specification/SpecificationDelete/${id}`;

        return this.httpClient.get<any>(url, {
            headers,
        });


    }



}
