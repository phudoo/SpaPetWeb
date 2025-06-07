import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Appointment {
  private apiUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  // User đặt lịch - Status mặc định là PENDING
  addAppointMent(
    petId: number,
    appointmentDate: string,
    note: string,
    serviceIds: number[]
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      petId,
      appointmentDate,
      note,
      serviceIds
    };

    return this.http.post<any>(`${this.apiUrl}/create`, body, { headers });
  }

  // User xem danh sách lịch hẹn của mình
  getAllAppointment(
    petId: string,
    appointmentDate: string,
    note: string,
    serviceIds: string
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/user/my-appointments`, {
      headers,
      params: { petId, appointmentDate, note, serviceIds }
    }).pipe(
      tap(response => {
        console.log('API Response:', response);
      })
    );
  }

  // User xem chi tiết lịch hẹn
  getAppointmentById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // User huỷ lịch hẹn
  cancelAppointment(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, null, { 
      headers,
      params: { status: 'CANCELLED' }
    });
  }

  // Admin/Bác sĩ xem tất cả lịch hẹn
  getAllUser(
    id: string,
    petName: string,
    petOwnerName: string,
    appointmentDate: string,
    note: string,
    status: string
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/admin/all`, {
      headers,
      params: { id, petName, petOwnerName, appointmentDate, note, status }
    });
  }

  // Admin/Bác sĩ cập nhật trạng thái lịch hẹn
  updateAppointmentStatus(id: number, status: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(
      `${this.apiUrl}/admin/${id}/status`,
      null,
      { headers, params: { status } }
    );
  }

  // Admin/Bác sĩ xem lịch hẹn theo ngày
  getAppointmentsByDate(date: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(
      `${this.apiUrl}/admin/date`,
      { headers, params: { date } }
    );
  }

  // Admin/Bác sĩ xem lịch hẹn theo tháng
  getAppointmentsByMonth(month: number, year: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(
      `${this.apiUrl}/admin/month`,
      { headers, params: { month, year } }
    );
  }

  // Admin/Bác sĩ xem lịch hẹn theo trạng thái
  getAppointmentsByStatus(status: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(
      `${this.apiUrl}/admin/status/${status}`,
      { headers }
    );
  }

  updateAppointmentReviewStatus(id: number, reviewed: boolean): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(
      `${this.apiUrl}/${id}/review-status`,
      { reviewed },
      { headers }
    );
  }

  // Get booked dates between start and end date
  getBookedDates(startDate: string, endDate: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/booked`, { 
      headers,
      params: { startDate, endDate }
    });
  }
}
