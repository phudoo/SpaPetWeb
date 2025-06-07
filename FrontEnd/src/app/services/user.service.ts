import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

//day 2 get all user
 getAllUser(username: string, password: string, fullName: string, email: string, phone: string, address: string, 
roleId: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any>(this.apiUrl, {
    headers,
    params: { username, password, fullName, email, phone, address, roleId: roleId.toString()
    }
  });
}

//day 3
adduser(
  username: string,
  password: string,
  address: string,
  email: string,
  fullName: string,
  phone: string,
  roleId: number
): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  const body = { username, password, address, email, fullName, phone, roleId };
  return this.http.post<any>(this.apiUrl, body, { headers });
}
//day 3 
getUserById(id: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
}
// day 4
deleteUser(id: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
}
//day 4
updateUser(id: number, userData: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.put<any>(`${this.apiUrl}/${id}`, userData, { headers });
}

}