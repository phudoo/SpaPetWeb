import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../../services/appointment.service';
import { Service } from '../../../services/services.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReviewService } from '../../../services/review.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './all-appointment.component.html',
  styleUrl: './all-appointment.component.css'
})
export class AllAppointmentComponent implements OnInit {
  appointments: any[] = [];
  allServices: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  showReviewModal: boolean = false;
  selectedAppointment: any = null;
  newReview: any = {
    rating: 5,
    comment: ''
  };
  reviews: any[] = [];
  userId: number = 0;

  constructor(
    private appointmentService: Appointment,
    private serviceService: Service,
    private reviewService: ReviewService,
    private router: Router
  ) {
    this.userId = this.getUserIdFromToken();
  }

  private getUserIdFromToken(): number {
    const token = localStorage.getItem('token');
    if (!token) return 0;
    
    try {
      // JWT tokens are in format: header.payload.signature
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.userId || 0;
    } catch (error) {
      console.error('Error decoding token:', error);
      return 0;
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadAppointments();
    this.loadServices();
    this.loadUserReviews();
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointment('', '', '', '').subscribe({
      next: (data) => {
        this.appointments = data.sort((a: any, b: any) => 
          new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải danh sách lịch hẹn';
        this.loading = false;
      }
    });
  }

  loadServices(): void {
    this.serviceService.getAllService('', '', '').subscribe({
      next: (data) => {
        this.allServices = data;
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải danh sách dịch vụ';
      }
    });
  }

  loadUserReviews(): void {
    this.reviewService.getUserReviews(this.userId).subscribe({
      next: (data) => {
        this.reviews = data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải danh sách đánh giá';
      }
    });
  }

  getTotalPrice(serviceNames: string[]): number {
    return this.allServices
      .filter(s => serviceNames.includes(s.name))
      .reduce((sum, s) => sum + Number(s.price), 0);
  }

  getServiceName(serviceId: number): string {
    const service = this.allServices.find(s => s.id === serviceId);
    return service ? service.name : 'Không xác định';
  }

  getServiceId(serviceName: string): number {
    const service = this.allServices.find(s => s.name === serviceName);
    return service ? service.id : 0;
  }

  hasReviewedService(serviceId: number, appointmentId: number): boolean {
    return this.reviews.some(review => 
      review.service.id === serviceId && 
      review.appointment.id === appointmentId
    );
  }

  hasReviewedAllServices(appointment: any): boolean {
    return appointment.services.every((serviceName: string) => 
      this.hasReviewedService(this.getServiceId(serviceName), appointment.id)
    );
  }

  navigateToReview(appointmentId: number): void {
    this.router.navigate(['/userreview', appointmentId]);
  }

  viewAppointmentDetails(appointmentId: number): void {
    this.router.navigate(['/detailappointment', appointmentId]);
  }
}