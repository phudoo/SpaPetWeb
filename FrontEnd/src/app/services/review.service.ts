import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  createReview(reviewData: {
    serviceId: number;
    appointmentId: number;
    rating: number;
    comment: string;
  }): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Không tìm thấy token xác thực'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, reviewData, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Không thể tạo đánh giá';
        if (error.status === 403) {
          errorMessage = 'Bạn không có quyền đánh giá dịch vụ này';
        } else if (error.status === 400) {
          errorMessage = 'Dịch vụ chưa hoàn thành hoặc bạn không phải chủ sở hữu lịch hẹn';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getServiceReviews(serviceId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${this.apiUrl}/service/${serviceId}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Không thể tải đánh giá'));
      })
    );
  }

  getUserReviews(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Không tìm thấy token xác thực'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Không thể tải đánh giá';
        if (error.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.status === 403) {
          errorMessage = 'Bạn không có quyền xem đánh giá này';
        } else if (error.status === 404) {
          errorMessage = 'Không tìm thấy đánh giá';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
