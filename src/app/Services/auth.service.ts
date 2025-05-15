// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './base-http-service';
import { LoginDetails } from '../Model/Login.Model';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Update this URL to match your API endpoint
  private apiUrl = 'http://triad.forestepinstitute.com/api/';

  constructor(
    private ApiServices: ApiService,
    private httpClient: HttpClient
  ) { }

  Login(login: LoginDetails): Observable<any> {
    const params = new HttpParams()
      .set('username', login.username)
      .set('passkey', login.passkey);
    return this.httpClient.get<any>(this.apiUrl + 'User/Login', { params });
  }

  GetUserByID(userId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Token: token, // Pass the token in the Authorization header
    });

    const params = new HttpParams().set('id', userId.toString()); // Pass userId as a query parameter

    return this.httpClient.get<any>(this.apiUrl + 'User/ReturnByID', {
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
}
