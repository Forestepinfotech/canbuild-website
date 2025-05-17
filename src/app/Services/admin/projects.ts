import { JobDetail } from './../../Model/project.Model';
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';



@Injectable({
    providedIn: 'root',
})
export class AdminProject {
    // Update this URL to match your API endpoint
    private apiUrl = 'http://triad.forestepinstitute.com/api/';

    constructor(
        private httpClient: HttpClient
    ) { }

    CreateJob(token: string, jobDetail: JobDetail): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        return this.httpClient.post<any>(this.apiUrl + 'Job/Create', jobDetail, {
            headers
        });
    }

    GetJob(token: string, companyId: string, managerId: number, statusId: number, active: number, jobId: number)
        : Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
            //wrong splling of company
            .set('companyid', companyId.toString())
            .set('managerid', managerId.toString())
            .set('statusid', statusId.toString())
            .set('active', active.toString())
            .set('jobid', jobId.toString())
        return this.httpClient.get<any>(this.apiUrl + 'Job/Return', {
            headers,
            params
        });
    }

    UpdateJobStatus(token: string, userId: string, isActive: number, jobId: number): Observable<any> {

        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
            //wrong splling of company
            .set('operand', userId.toString())
            .set('isActive', isActive.toString())
            .set('jobid', jobId.toString())
        return this.httpClient.get<any>(
            this.apiUrl + 'Job/status',
            // assuming no body needed
            { headers, params }
        );
    }

    UpdateJobWorkStatus(token: string, userId: string, statusId: number, jobId: number): Observable<any> {

        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
            //wrong splling of company
            .set('userID', userId.toString())
            .set('statusID', statusId.toString())
            .set('jobID', jobId.toString())
        return this.httpClient.get<any>(
            this.apiUrl + 'Job/WorkStatus',
            // assuming no body needed
            { headers, params }
        );
    }

    UpdateJob(token: string, jobDetail: JobDetail): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        return this.httpClient.post<any>(this.apiUrl + 'Job/Update', jobDetail, {
            headers
        });
    }

    DeleteJob(token: string, userid: string, jobid: string): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });


        const params = new HttpParams()
            //wrong splling of company
            .set('userid', userid.toString())
            .set('jobid', jobid.toString())

        return this.httpClient.get<any>(this.apiUrl + 'Job/Delete', {
            headers,
            params,
        });


    }


    GetJobDocs(token: string, documentId: number, jobId: number, typeId: number, isActive: number)
        : Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
            //wrong splling of company
            .set('documentid', documentId.toString())
            .set('jobid', jobId.toString())
            .set('typeid', typeId.toString())
            .set('isactive', isActive.toString())
        return this.httpClient.get<any>(this.apiUrl + 'Job/DocReturn', {
            headers,
            params
        });
    }
}
