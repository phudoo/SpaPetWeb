import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'Có lỗi xảy ra';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  createOrderWithAddress(orderData: { items: any[], address: string, phone: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getMyOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-orders`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${orderId}/cancel`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAllOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/all`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  confirmOrder(orderId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${orderId}/confirm`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

// Thêm hàm mới vào OrderService

updateOrderStatus(orderId: number, status: string): Observable<any> {
  const url = `${this.apiUrl}/admin/${orderId}/status?status=${status}`;
  return this.http.put<any>(url, {}, { headers: this.getHeaders() })
    .pipe(catchError(this.handleError));
}

// Lấy đơn hàng theo user (admin/doctor)
getOrdersByUser(userId: number): Observable<any> {
  const url = `${this.apiUrl}/admin/user/${userId}`;
  return this.http.get<any>(url, { headers: this.getHeaders() })
    .pipe(catchError(this.handleError));
}

// Lấy đơn hàng theo trạng thái (admin/doctor)
getOrdersByStatus(status: string): Observable<any> {
  const url = `${this.apiUrl}/admin/status/${status}`;
  return this.http.get<any>(url, { headers: this.getHeaders() })
    .pipe(catchError(this.handleError));
}

}