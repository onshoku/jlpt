import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

const backendUrl = 'http://localhost:3000/api/';
@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient) {}

  savePayment(data: any): Observable<any> {
    // console.log('readv4', data);
    // const accessToken = localStorage.getItem('accessToken') as string;
    // const accessToken = this.commonService.getToken().accessToken as string;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('token', accessToken);
    return this.http.post<{
      message: string;
    }>(backendUrl + 'jlpt/payment', data, { headers });
  }

  save(data: any): Observable<any> {
    // console.log('readv4', data);
    // const accessToken = localStorage.getItem('accessToken') as string;
    // const accessToken = this.commonService.getToken().accessToken as string;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('token', accessToken);
    return this.http.post<{
      message: string;
    }>(backendUrl + 'jlpt/save', data, { headers });
  }

  getFormsById(id: string): Observable<any> {
    const accessToken = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
    }).set('token', accessToken);
    const params = new HttpParams().set('id', id);

    return this.http.get<any>(backendUrl + 'jlpt/' + id, { headers, params });
  }

  getFormsByUserId(data: any = {}, timeOfExam = '25B'): Observable<any> {
    const accessToken = localStorage.getItem('authToken') || '';
    const userId = localStorage.getItem('userId') || '';
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
    }).set('token', accessToken);
    const params = new HttpParams()
      .set('userId', userId)
      .set('timeOfExam', timeOfExam);

    return this.http.post<any>(backendUrl + 'jlpt', data, { headers, params });
  }

  submit(data: any): Observable<any> {
    // console.log('readv4', data);
    // const accessToken = localStorage.getItem('accessToken') as string;
    // const accessToken = this.commonService.getToken().accessToken as string;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('token', accessToken);
    return this.http.post<{
      message: string;
    }>(backendUrl + 'jlpt/submit', data, { headers });
  }

  login(data: any): Observable<any> {
    // console.log('readv4', data);
    // const accessToken = localStorage.getItem('accessToken') as string;
    // const accessToken = this.commonService.getToken().accessToken as string;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('token', accessToken);
    return this.http.post<{
      message: string;
    }>(backendUrl + 'auth/login', data, { headers });
  }

  register(data: any): Observable<any> {
    // console.log('readv4', data);
    // const accessToken = localStorage.getItem('accessToken') as string;
    // const accessToken = this.commonService.getToken().accessToken as string;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('token', accessToken);
    return this.http.post<{
      message: string;
    }>(backendUrl + 'auth/register', data, { headers });
  }

  verifyOtp(data: any): Observable<any> {
    // console.log('readv4', data);
    // const accessToken = localStorage.getItem('accessToken') as string;
    // const accessToken = this.commonService.getToken().accessToken as string;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('token', accessToken);
    return this.http.post<{
      message: string;
    }>(backendUrl + 'auth/verify-otp', data, { headers });
  }

  resendOtp(data: any): Observable<any> {
    // console.log('readv4', data);
    // const accessToken = localStorage.getItem('accessToken') as string;
    // const accessToken = this.commonService.getToken().accessToken as string;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('token', accessToken);
    return this.http.post<{
      message: string;
    }>(backendUrl + 'auth/resend-otp', data, { headers });
  }

  createOrder(amount: number) {
    return this.http.post<any>(backendUrl + 'payments/create-order', {
      amount,
    });
  }

  verifyAndFetchDetails(data: any) {
    return this.http.post<any>(backendUrl + 'payments/details', data);
  }

  getData(data: any): Observable<any> {
    // console.log('readv4', data);
    const accessToken = localStorage.getItem('authToken') as string;
    // const accessToken = this.commonService.getToken().accessToken as string;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');

    headers = headers.append('authorization', accessToken);
    return this.http.get<{
      message: string;
    }>(backendUrl + 'getData', { headers });
  }
}
