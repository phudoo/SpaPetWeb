import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contact {
  id?: number;
  fullName: string;
  phone: string;
  address: string;
  email: string;
  subject: string;
  content: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:8080/api/contacts';

  constructor(private http: HttpClient) { }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}/create`, contact);
  }

  getAllContacts(): Observable<Contact[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Contact[]>(this.apiUrl, { headers });
  }

  getContactById(id: number): Observable<Contact> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Contact>(`${this.apiUrl}/${id}`, { headers });
  }

  updateContactStatus(id: number, status: string): Observable<Contact> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch<Contact>(`${this.apiUrl}/${id}/status?status=${status}`, {}, { headers });
  }
}
