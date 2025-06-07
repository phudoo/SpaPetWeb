import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  productName?: string;
}

interface Order {
  id: number;
  items: OrderItem[];
  address: string;
  phone: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

@Component({
  selector: 'app-detailorder',
  standalone: false,
  templateUrl: './detailorder.component.html',
  styleUrl: './detailorder.component.css'
})
export class DetailorderComponent implements OnInit {
  order: Order | null = null;
  errorMessage: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrderDetail();
  }

  loadOrderDetail(): void {
    this.loading = true;
    this.errorMessage = '';

    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.errorMessage = 'Không tìm thấy ID đơn hàng.';
      this.loading = false;
      return;
    }

    this.orderService.getOrderById(Number(orderId)).subscribe({
      next: (data: Order) => {
        console.log('Order detail data:', data);
        this.order = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading order detail:', error);
        this.errorMessage = 'Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  goBack(): void {
    this.router.navigate(['/myorder']);
  }
}
