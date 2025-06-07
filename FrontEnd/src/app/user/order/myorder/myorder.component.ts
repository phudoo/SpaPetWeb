import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-myorder',
  standalone: false,
  templateUrl: './myorder.component.html',
  styleUrl: './myorder.component.css'
})
export class MyorderComponent implements OnInit {
  orders: Order[] = [];
  errorMessage: string = '';
  loading: boolean = true;
  cancelingOrderId: number | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        console.log('Orders data:', data); // Debug log
        this.orders = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.';
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

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/detailorder', orderId]);
  }

  canCancelOrder(status: string): boolean {
    return status.toLowerCase() === 'pending';
  }

  cancelOrder(orderId: number): void {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      this.cancelingOrderId = orderId;
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          // Cập nhật trạng thái đơn hàng trong danh sách
          const order = this.orders.find(o => o.id === orderId);
          if (order) {
            order.status = 'cancelled';
          }
          this.cancelingOrderId = null;
          alert('Hủy đơn hàng thành công!');
        },
        error: (error) => {
          console.error('Error canceling order:', error);
          this.errorMessage = 'Không thể hủy đơn hàng. Vui lòng thử lại sau.';
          this.cancelingOrderId = null;
        }
      });
    }
  }
}
