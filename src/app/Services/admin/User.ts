// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';



@Injectable({
    providedIn: 'root',
})
export class AdminUser {
    // Update this URL to match your API endpoint
    private apiUrl = 'http://triad.forestepinstitute.com/api/';

    constructor(
        private httpClient: HttpClient
    ) { }

    GetUserTypes(token: string, userId: string): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const url = `${this.apiUrl}/UserType/Return/${userId}`;
        return this.httpClient.get<any>(url, {
            headers
        });
    }
    CreateUser(
        token: string,
        userData: {
            UserID?: number,
            UserName?: string,
            UserFullName?: string,
            UserType?: string,
            HashPassKey?: string,
            EmailID?: string,
            UserImage?: string,
            ContactNo?: string,
            CreatedBy?: number,
            CreatedOn?: string,
            isActive?: number,
            CompanyID?: number,
            CompanyName?: string,
            UserTypeID?: number,
            ProofTypeID?: number,
            Proof?: string,
            SecurityNumber?: string,
            ProofType?: string,
            TradeID?: number,
            TradeType?: string,
            AddressType?: number,
            Address?: string,
            City?: string,
            PostalCode?: string,
            State?: string,
            Country?: string
        }
    ): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        return this.httpClient.post<any>(this.apiUrl + 'User/Create', userData, {
            headers,
        });
    }

    UploadFile(token: string, fileData: {
        FileBytes: string,
        FileName: string,
        FilePath: string,
    }): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        return this.httpClient.post<any>(this.apiUrl + 'FileUpload/UploadData', fileData, {
            headers,
        });
    }

    UpdateUser(token: string,
        userData: {
            UserID?: number,
            UserName?: string,
            UserFullName?: string,
            UserType?: string,
            HashPassKey?: string,
            EmailID?: string,
            UserImage?: string,
            ContactNo?: string,
            CreatedBy?: number,
            CreatedOn?: string,
            isActive?: number,
            CompanyID?: number,
            CompanyName?: string,
            UserTypeID?: number,
            ProofTypeID?: number,
            Proof?: string,
            SecurityNumber?: string,
            ProofType?: string,
            TradeID?: number,
            TradeType?: string,
            AddressType?: number,
            Address?: string,
            City?: string,
            PostalCode?: string,
            State?: string,
            Country?: string
        }
    ): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });

        return this.httpClient.post<any>(this.apiUrl + 'User/Update', userData, {
            headers,
        });
    }
    UpdateUserStatus(token: string, userId: number, isActive: number): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const params = new HttpParams()
            //wrong splling of company
            .set('userid', userId.toString())
            .set('isActive', isActive.toString())
        return this.httpClient.get<any>(
            this.apiUrl + 'User/userStatus',
            // assuming no body needed
            { headers, params }
        );
    }
    GetUsers(
        companyid: string,
        token: string,
        id: string,
        isActive: number,
        usertypeid: number,
        pagenumber: number,
        rowpage: number
    ): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });
        const url = `${this.apiUrl}User/Return/${id}`;

        const params = new HttpParams()
            //wrong splling of company
            .set('companyid', companyid.toString())
            .set('isactive', isActive.toString())
            .set('usertypeid', usertypeid.toString())
            .set('pagenumber', pagenumber.toString())
            .set('rowpage', rowpage.toString())

        return this.httpClient.get<any>(url, {
            headers,
            params,
        });


    }

    Deleteuser(token: string, userid: string, operrand: string): Observable<any> {
        const headers = new HttpHeaders({
            Token: token, // Pass the token in the Authorization header
        });


        const params = new HttpParams()
            //wrong splling of company
            .set('userid', userid.toString())
            .set('operand', operrand.toString())

        return this.httpClient.get<any>(this.apiUrl + 'User/userDelete', {
            headers,
            params,
        });


    }
}
