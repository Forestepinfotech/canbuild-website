import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  // Create or update the Authorization header as needed
  private createAuthorizationHeader(): void {
            this.headers.append('Access-Control-Allow-Origin','*');
            this.headers.append('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
            this.headers.append('Access-Control-Allow-Headers','Origin, Content-Type, X-Auth-Token');
    const token = localStorage.getItem('token');
    if (token) {
      this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // GET method
  get<T>(url: string): Promise<T> {
    this.createAuthorizationHeader();
    return lastValueFrom(this.http.get<T>(url, { headers: this.headers }));
  }

  // POST method
  post<T>(url: string, body: any): Promise<T> {
    this.createAuthorizationHeader();
    return lastValueFrom(this.http.post<T>(url, body, { headers: this.headers }));
  }

  // PUT method
  put<T>(url: string, body: any): Promise<T> {
    this.createAuthorizationHeader();
    return lastValueFrom(this.http.put<T>(url, body, { headers: this.headers }));
  }

  // DELETE method
  delete<T>(url: string): Promise<T> {
    this.createAuthorizationHeader();
    return lastValueFrom(this.http.delete<T>(url, { headers: this.headers }));
  }
}
