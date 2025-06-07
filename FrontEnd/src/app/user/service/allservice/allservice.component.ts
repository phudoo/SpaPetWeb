import { Component, OnInit } from '@angular/core';
import { Service as ServiceService } from '../../../services/services.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../services/review.service';

interface Review {
  id: number;
  serviceId: number;
  appointmentId: number;
  rating: number;
  comment: string;
  serviceName: string;
  userName: string;
  createdAt: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  averageRating?: number;
  reviewCount?: number;
  completedAppointments?: number[];
}

@Component({
  selector: 'app-allservice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './allservice.component.html',
  styleUrl: './allservice.component.css',
})
export class AllserviceComponent implements OnInit {
  services: Service[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  serviceReviews: { [key: number]: Review[] } = {};
  loadingReviews: { [key: number]: boolean } = {};
  expandedReviews: { [key: number]: boolean } = {};
  newReview = {
    rating: 0,
    comment: '',
  };
  userId: number | null = null;

  constructor(
    private serviceService: ServiceService,
    private reviewService: ReviewService
  ) {
    // Get user ID from token or user service
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) { 
      this.userId = JSON.parse(userInfo).id;
    }
  }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.serviceService.getAllService('', '', '').subscribe({
      next: (data: Service[]) => {
        this.services = data;
        // Load reviews for each service
        this.services.forEach((service) => {
          this.loadServiceReviews(service.id);
        });
        this.loading = false;
      },
      error: (err: Error) => {
        this.errorMessage = 'Không thể tải danh sách dịch vụ';
        this.loading = false;
      },
    });
  }

  loadServiceReviews(serviceId: number): void {
    this.loadingReviews[serviceId] = true;
    this.reviewService.getServiceReviews(serviceId).subscribe({
      next: (reviews: Review[]) => {
        this.serviceReviews[serviceId] = reviews;
        this.updateServiceRating(serviceId, reviews);
        this.loadingReviews[serviceId] = false;
        // Initialize expanded state to false for new services
        if (this.expandedReviews[serviceId] === undefined) {
          this.expandedReviews[serviceId] = false;
        }
      },
      error: (err: Error) => {
        console.error('Error loading reviews:', err);
        this.loadingReviews[serviceId] = false;
      },
    });
  }

  toggleReviews(serviceId: number): void {
    this.expandedReviews[serviceId] = !this.expandedReviews[serviceId];
  }

  updateServiceRating(serviceId: number, reviews: Review[]): void {
    const service = this.services.find(s => s.id === serviceId);
    if (service) {
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        service.averageRating = totalRating / reviews.length;
        service.reviewCount = reviews.length;
      } else {
        service.averageRating = 0;
        service.reviewCount = 0;
      }
    }
  }

  getAverageRating(serviceId: number): number {
    const service = this.services.find(s => s.id === serviceId);
    return service?.averageRating || 0;
  }

  getReviewCount(serviceId: number): number {
    const service = this.services.find(s => s.id === serviceId);
    return service?.reviewCount || 0;
  }

  canReview(service: Service): boolean {
    if (!this.userId) return false;
    return (
      service.completedAppointments?.some((appointmentId) =>
        this.isUserAppointmentOwner(appointmentId)
      ) || false
    );
  }

  isUserAppointmentOwner(appointmentId: number): boolean {
    // Implement logic to check if the current user is the owner of the appointment
    // This should be implemented based on your appointment service
    return true; // Placeholder
  }

  setRating(rating: number): void {
    this.newReview.rating = rating;
  }

  submitReview(service: Service): void {
    if (!this.newReview.rating || !this.newReview.comment) {
      return;
    }

    const reviewData = {
      serviceId: service.id,
      appointmentId: this.getCompletedAppointmentId(service), // Implement this method
      rating: this.newReview.rating,
      comment: this.newReview.comment,
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: (response) => {
        // Refresh reviews for this service
        this.loadServiceReviews(service.id);
        // Reset form
        this.newReview = {
          rating: 0,
          comment: '',
        };
      },
      error: (error: Error) => {
        console.error('Error submitting review:', error);
        // Handle error (show message to user)
      },
    });
  }

  private getCompletedAppointmentId(service: Service): number {
    // Implement logic to get the completed appointment ID for this service
    // This should return the ID of a completed appointment owned by the current user
    return service.completedAppointments?.[0] || 0; // Placeholder
  }
}
