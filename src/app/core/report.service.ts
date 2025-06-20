import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

const backendUrl = 'http://13.203.168.84:3000/api/';
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  exportMatchingRecords(data: any): Observable<any> {
    // console.log('readv4', data);
    // const accessToken = localStorage.getItem('accessToken') as string;
    // const accessToken = this.commonService.getToken().accessToken as string;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('token', accessToken);
    return this.http.post(backendUrl + 'jlpt/export', data, {
    headers,
    responseType: 'blob'  // 👈 Correct way to receive binary file
  })
  }

  exportLevelRecords(data: any): Observable<any> {
    // console.log('readv4', data);
    // const accessToken = localStorage.getItem('accessToken') as string;
    // const accessToken = this.commonService.getToken().accessToken as string;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('token', accessToken);
    return this.http.post(backendUrl + 'jlpt/export/level', data, {
    headers,
    responseType: 'blob'  // 👈 Correct way to receive binary file
  })
  }
}
