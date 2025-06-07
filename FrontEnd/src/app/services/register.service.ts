import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:8080/api/auth/register';
  constructor(private http: HttpClient) {}
//day 2 register
  register(  username: string , password: string, fullName: string, email: string , phone: string, address: string, 
  roleId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password, fullName, email, phone, address, roleId });
  }
 
}
