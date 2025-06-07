import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../../services/appointment.service';
import { Service } from '../../services/services.service';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-userreview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userreview.component.html',
  styleUrl: './userreview.component.css',
})
export class UserreviewComponent implements OnInit {
  appointmentId: number = 0;
  appointment: any = null;
  services: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: Appointment,
    private serviceService: Service,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAppointmentDetails();
  }

  loadAppointmentDetails(): void {
    this.loading = true;
    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (data) => {
        this.appointment = data;
        if (this.appointment.status !== 'COMPLETED') {
          this.errorMessage = 'Chỉ có thể đánh giá lịch hẹn đã hoàn thành';
          this.router.navigate(['/allappointment']);
        }
        this.loadServices();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải thông tin lịch hẹn';
        this.loading = false;
      }
    });
  }

  loadServices(): void {
    this.serviceService.getAllService('', '', '').subscribe({
      next: (data) => {
        this.services = data.filter((service: any) => 
          this.appointment.services.includes(service.name)
        );
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải danh sách dịch vụ';
      }
    });
  }

  submitReview(serviceId: number, rating: number, comment: string): void {
    this.loading = true;
    const reviewData = {
      serviceId: serviceId,
      appointmentId: this.appointmentId,
      rating: rating,
      comment: comment
    };
    this.reviewService.createReview(reviewData).subscribe({
      next: (response) => {
        this.successMessage = 'Đánh giá thành công!';
        this.loading = false;
        // Reload the page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/all-appointment']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Không thể gửi đánh giá. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  canSubmitAll(): boolean {
    return this.services.every(service => service.rating && service.comment);
  }

  submitAllReviews(): void {
    if (!this.canSubmitAll()) {
      this.errorMessage = 'Vui lòng điền đầy đủ đánh giá và nhận xét cho tất cả dịch vụ';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const reviewPromises = this.services.map(service => {
      const reviewData = {
        serviceId: service.id,
        appointmentId: this.appointmentId,
        rating: service.rating,
        comment: service.comment
      };
      return this.reviewService.createReview(reviewData).toPromise();
    });

    Promise.all(reviewPromises)
      .then(() => {
        this.successMessage = 'Đánh giá tất cả dịch vụ thành công! Chuyển hướng về trang lịch hẹn...';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/allappointment']);
        }, 1500);
      })
      .catch((error) => {
        this.errorMessage = 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.';
        this.loading = false;
      });
  }
}
