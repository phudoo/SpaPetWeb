import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart/user';

  constructor(private http: HttpClient) {}

  addToCart(userId: number, productId: number, quantity: number, token: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const body = { productId, quantity };
    return this.http.post(url, body, { headers });
  }

  getCart(userId: number, token: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(url, { headers });
  }
}