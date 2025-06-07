import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { ActivatedRoute } from '@angular/router';

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

@Component({
  selector: 'app-reviewuser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviewuser.component.html',
  styleUrl: './reviewuser.component.css'
})
export class ReviewuserComponent implements OnInit {
  reviews: Review[] = [];
  loading: boolean = false;
  error: string | null = null;
  userId: number | null = null;
  serviceId: number | null = null;
  isServiceReviews: boolean = false;
  protected readonly Math = Math;

  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['serviceId']) {
        this.serviceId = +params['serviceId'];
        this.isServiceReviews = true;
        this.loadServiceReviews();
      } else if (params['userId']) {
        this.userId = +params['userId'];
        this.isServiceReviews = false;
        this.loadUserReviews();
      } else {
        this.error = 'Không tìm thấy thông tin cần thiết để tải đánh giá';
      }
    });
  }

  loadServiceReviews() {
    if (!this.serviceId) {
      this.error = 'Không tìm thấy ID dịch vụ';
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.reviewService.getServiceReviews(this.serviceId).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.reviews = response;
        } else if (response && response.data) {
          this.reviews = response.data;
        } else {
          this.reviews = [];
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Không thể tải đánh giá dịch vụ';
        this.loading = false;
        this.reviews = [];
      }
    });
  }

  loadUserReviews() {
    if (!this.userId) {
      this.error = 'Không tìm thấy ID người dùng';
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.reviewService.getUserReviews(this.userId).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.reviews = response;
        } else if (response && response.data) {
          this.reviews = response.data;
        } else {
          this.reviews = [];
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Không thể tải đánh giá người dùng';
        this.loading = false;
        this.reviews = [];
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  calculateAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.reviews.length;
  }
}
