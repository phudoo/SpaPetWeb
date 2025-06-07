import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface RevenueStatistics {
  totalRevenue: number;
  totalCompletedAppointments: number;
  startDate: string;
  endDate: string;
  appointments: {
    appointmentId: number;
    appointmentDate: string;
    petName: string;
    ownerName: string;
    services: {
      serviceName: string;
      price: number;
    }[];
    appointmentRevenue: number;
  }[];
}

export interface DetailedRevenue {
  date: string;
  revenue: number;
  appointmentCount: number;
  appointments: {
    id: number;
    petName: string;
    petOwnerName: string;
    services: string[];
    totalAmount: number;
    status: string;
  }[];
}

export interface MonthlyRevenue {
  month: number;
  year: number;
  totalRevenue: number;
  appointmentCount: number;
}

export interface YearlyRevenue {
  year: number;
  totalRevenue: number;
  appointmentCount: number;
  monthlyBreakdown: MonthlyRevenue[];
}

export interface ProductRevenueStatistics {
  totalRevenue: number;
  startDate: string;
  endDate: string;
  month?: number;
  year?: number;
  totalProducts: number;
  totalOrders: number;
  averageOrderValue: number;
  monthlyBreakdown?: {
    month: number;
    totalRevenue: number;
    totalProducts: number;
    totalOrders: number;
    averageOrderValue: number;
  }[];
  products: {
    productId: number;
    productName: string;
    price: number;
    totalQuantity: number;
    totalRevenue: number;
  }[];
}

export interface DetailedProductRevenue {
  productId: number;
  productName: string;
  totalRevenue: number;
  totalQuantity: number;
  orders: number;
}

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
  private apiUrl = 'http://localhost:8080/api/statistics/revenue';
  private productApiUrl = 'http://localhost:8080/api/statistics/products/revenue';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getRevenueByDateRange(startDate: string, endDate: string): Observable<RevenueStatistics> {
    console.log('Service: Getting revenue by date range', { startDate, endDate });
    return this.http.get<RevenueStatistics>(`${this.apiUrl}`, {
      headers: this.getHeaders(),
      params: { startDate, endDate }
    }).pipe(
      tap(response => {
        console.log('Service: Revenue response', response);
      })
    );
  }

  getDetailedRevenue(startDate: string, endDate: string): Observable<DetailedRevenue[]> {
    console.log('Service: Getting detailed revenue', { startDate, endDate });
    return this.http.get<DetailedRevenue[]>(`${this.apiUrl}/detailed`, {
      headers: this.getHeaders(),
      params: { startDate, endDate }
    }).pipe(
      tap(response => {
        console.log('Service: Detailed revenue response', response);
      })
    );
  }

  getMonthlyRevenue(year: number, month: number): Observable<MonthlyRevenue> {
    return this.http.get<MonthlyRevenue>(`${this.apiUrl}/monthly`, {
      headers: this.getHeaders(),
      params: { year: year.toString(), month: month.toString() }
    });
  }

  getYearlyRevenue(year: number): Observable<YearlyRevenue> {
    return this.http.get<YearlyRevenue>(`${this.apiUrl}/yearly`, {
      headers: this.getHeaders(),
      params: { year: year.toString() }
    });
  }

  getProductRevenueByDateRange(startDate: string, endDate: string): Observable<ProductRevenueStatistics> {
    return this.http.get<ProductRevenueStatistics>(`${this.productApiUrl}`, {
      headers: this.getHeaders(),
      params: { startDate, endDate }
    });
  }

  getDetailedProductRevenue(startDate: string, endDate: string): Observable<DetailedProductRevenue[]> {
    return this.http.get<DetailedProductRevenue[]>(`${this.productApiUrl}/detailed`, {
      headers: this.getHeaders(),
      params: { startDate, endDate }
    });
  }

  getMonthlyProductRevenue(year: number, month: number): Observable<ProductRevenueStatistics> {
    return this.http.get<ProductRevenueStatistics>(`${this.productApiUrl}/monthly`, {
      headers: this.getHeaders(),
      params: { year: year.toString(), month: month.toString() }
    });
  }

  getYearlyProductRevenue(year: number): Observable<ProductRevenueStatistics> {
    return this.http.get<ProductRevenueStatistics>(`${this.productApiUrl}/yearly`, {
      headers: this.getHeaders(),
      params: { year: year.toString() }
    });
  }
}
