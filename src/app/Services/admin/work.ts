import { JobDetail } from './../../Model/project.Model';
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { WorkModel } from '../../Model/Work.Model';



@Injectable({
    providedIn: 'root',
})
export class AdminWork {
    // Update this URL to match your API endpoint
    private apiUrl = 'http://triad.forestepinstitute.com/api/';

    constructor(
        private httpClient: HttpClient
    ) { }

    CreateWork(token: string, workDetal: WorkModel): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        return this.httpClient.post<any>(this.apiUrl + 'Work/Create', workDetal, {
            headers
        });
    }
    GetPriorityWork(token: string, id: number): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const url = `${this.apiUrl}/Misc/PriorityReturn/${id}`;

        return this.httpClient.get<any>(url, {
            headers
        });
    }


    GetDocId(token: string)
        : Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()

        return this.httpClient.get<any>(this.apiUrl + 'Misc/DocmentTypeReturn/-1', {
            headers,
            params
        });
    }

    GetWork(token: string, companyId: string, managerId: number, userId: number, jobId: number)
        : Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
            //wrong splling of company
            .set('companyid', companyId.toString())
            .set('managerid', managerId.toString())
            .set('userid', userId.toString())
            .set('jobid', jobId.toString())
        return this.httpClient.get<any>(this.apiUrl + 'Work/Return', {
            headers,
            params
        });
    }

    UpdateWorkStatus(token: string, workId: string, isActive: number): Observable<any> {

        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
            .set('workid', workId.toString())
            .set('status', isActive.toString())
        return this.httpClient.get<any>(
            this.apiUrl + 'Work/WorkActive',
            // assuming no body needed
            { headers, params }
        );
    }

    UpdateWorkCompleteStatus(token: string, userId: string, statusId: number, workId: number): Observable<any> {

        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
            //wrong splling of company
            .set('userid', userId.toString())
            .set('status', statusId.toString())
            .set('workid', workId.toString())
        return this.httpClient.get<any>(
            this.apiUrl + 'Work/WorkStatus',
            // assuming no body needed
            { headers, params }
        );
    }

    UpdateWork(token: string, workDetail: WorkModel): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        return this.httpClient.post<any>(this.apiUrl + 'Work/Update', workDetail, {
            headers
        });
    }

    DeleteWork(token: string, workDetail: WorkModel): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
        return this.httpClient.post<any>(this.apiUrl + 'Work/WorkDelete', workDetail, {
            headers,
            params,
        });
    }

    GetWorkDoc(token: string, documentId: string, workId: number, userId: number, jobId: number, jobName: string, pagenumber: number, pageSize: number, type: number)
        : Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
            //wrong splling of company
            .set('UserID', userId.toString())
            .set('JobID', jobId.toString())
            .set('WorkID', workId.toString())
            .set('DocumentID', documentId.toString())
            .set('jobname', jobName.toString())
            .set('PageNumber', pagenumber.toString())
            .set('PageSize', pageSize.toString())
            .set('DocTypeID', type)
        return this.httpClient.get<any>(this.apiUrl + 'Documents/WorkDocReturnByType', {
            headers,
            params
        });
    }

    CreateWorkDoc(token: string, workDetal: {
        "JobID": number,
        "JobName": string,
        "WorkID": number,
        "WorkDetail": string,
        "DocumentTypeID": number,
        "DocumentType": string,
        "DocumentName": string,
        "DocumentDetail": string,
        "isActive": number,
        "isDeleted": number,
        "UserID": number,
        "UserName": string
    }): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        return this.httpClient.post<any>(this.apiUrl + 'Documents/WorkDocCreate', workDetal, {
            headers
        });
    }

    UpdateWorkDoc(token: string, workDetal: {
        "DocumentID": string,
        "isActive": number,
    }): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        return this.httpClient.post<any>(this.apiUrl + 'Documents/WorkDocRejected', workDetal, {
            headers
        });
    }

}
