import { JobDetail } from './../../Model/project.Model';
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';



@Injectable({
    providedIn: 'root',
})
export class AdminJobDocs {
    // Update this URL to match your API endpoint
    private apiUrl = 'http://triad.forestepinstitute.com/api/';

    constructor(
        private httpClient: HttpClient
    ) { }

    CreateJobDoc(token: string, jobDetail: {
        "JobID": number,
        "DocumentTypeID": number,
        "DocumentType": string,
        "PermissionTo": number,
        "JobDocument": string,
        "UserID": number,
        "UserType": string
    }): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        return this.httpClient.post<any>(this.apiUrl + 'Job/DocCreate', jobDetail, {
            headers
        });
    }


    UpdateJobDocPermission(token: string, jobDetail: {
        "JobID": number,
        "DocumentTypeID": number,
        "PermissionTo": number,
        "JobDocumentID": number,

    }): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        return this.httpClient.post<any>(this.apiUrl + 'Job/DocPermissionUpdate', jobDetail, {
            headers
        });
    }

    DeleteJobDoc(token: string, docId: number): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });


        const params = new HttpParams()
            //wrong splling of company
            .set('doc', docId.toString())

        return this.httpClient.get<any>(this.apiUrl + 'Job/DocDelete', {
            headers,
            params,
        });


    }


    GetJobDocs(token: string, documentId: number, jobId: number, typeId: number)
        : Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
            //wrong splling of company
            .set('documentid', documentId.toString())
            .set('jobid', jobId.toString())
            .set('typeid', typeId.toString())
        return this.httpClient.get<any>(this.apiUrl + 'Job/DocPivotReturn', {
            headers,
            params
        });
    }

    GetJobDocsID(token: string, documentId: number, jobId: number, typeId: number)
        : Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
            //wrong splling of company
            .set('documentid', documentId.toString())
            .set('jobid', jobId.toString())
            .set('typeid', typeId.toString())
            .set('isactive', '-1')
        return this.httpClient.get<any>(this.apiUrl + 'Job/DocReturn', {
            headers,
            params
        });
    }
}
