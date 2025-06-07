import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private apiUrl = 'http://localhost:8080/api/services';

  constructor(private http: HttpClient) {}

  //day 2 get all user
  getAllService(
    name: string,
    description: string,
    price: string
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.apiUrl, {
      headers,
      params: { name, description, price },
    });
  }
  //day 3
  addService(
    name: string,
    description: string,
    price: string
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const body = { name, description, price };
    return this.http.post<any>(this.apiUrl, body, { headers });
  }
  //day 3
  getServiceById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }
  // day 4
  deleteService(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
  //day 4
  updateService(id: number, serviceData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(`${this.apiUrl}/${id}`, serviceData, { headers });
  }
}
