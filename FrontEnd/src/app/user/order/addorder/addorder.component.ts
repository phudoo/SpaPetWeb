import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-addorder',
  standalone: false,
  templateUrl: './addorder.component.html',
  styleUrl: './addorder.component.css'
})
export class AddorderComponent implements OnInit {
  address: string = '';
  phone: string = '';
  orderResult: any = null;
  errorMessage: string = '';
  items: any[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private cartService: CartService
  ) {
    // Get items from router state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { items: any[] };
    if (state?.items) {
      this.items = state.items;
      console.log('Received items from cart:', this.items); // Debug log
    }
  }

  ngOnInit() {
    // If no items from router state, try to get from cart
    if (this.items.length === 0) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.errorMessage = 'Bạn cần đăng nhập để đặt hàng!';
        return;
      }

      const userId = this.getUserIdFromToken(token);
      if (!userId) {
        this.errorMessage = 'Không tìm thấy thông tin người dùng!';
        return;
      }

      this.cartService.getCart(userId, token).subscribe({
        next: (cartData) => {
          if (Array.isArray(cartData)) {
            this.items = cartData.map(item => ({
              productId: item.productId,
              quantity: item.quantity
            }));
            console.log('Loaded items from cart:', this.items); // Debug log
          }
        },
        error: (err) => {
          console.error('Lỗi khi lấy thông tin giỏ hàng:', err);
          this.errorMessage = 'Không thể lấy thông tin giỏ hàng!';
        }
      });
    }
  }

  private getUserIdFromToken(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || null;
    } catch {
      return null;
    }
  }

  calculateTotal(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  submitOrder() {
    this.errorMessage = '';
    this.orderResult = null;
    
    if (this.items.length === 0) {
      this.errorMessage = 'Không có sản phẩm nào được chọn!';
      return;
    }

    // Format order data according to the required structure
    const orderData = {
      items: this.items.map(item => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity)
      })),
      address: this.address.trim(),
      phone: this.phone.trim()
    };

    console.log('Order data being sent:', orderData); // Debug log

    this.orderService.createOrderWithAddress(orderData).subscribe({
      next: (result) => {
        this.orderResult = result;
        this.items = [];
        alert('Đặt hàng thành công!');
        // Navigate back to cart after successful order
        this.router.navigate(['/cart']);
      },
      error: (err) => {
        console.error('Lỗi khi đặt hàng:', err);
        this.errorMessage = 'Đặt đơn thất bại! Vui lòng thử lại.';
      }
    });
  }
}