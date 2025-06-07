import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';

interface CartItem {
  productId: number;
  productName?: string;
  quantity: number;
  price: number;
  selected: boolean;
  product?: {
    id: number;
    name: string;
    price: number;
  };
}

@Component({
  selector: 'app-allcart',
  standalone: false,
  templateUrl: './allcart.component.html',
  styleUrl: './allcart.component.css'
})
export class AllcartComponent implements OnInit {
  cartItems: CartItem[] = [];
  errorMessage: string = '';

  constructor(private cartService: CartService, private router: Router) {}

  getUserIdFromToken(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || null;
    } catch {
      return null;
    }
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Authentication token is missing.';
      return;
    }
    const userId = this.getUserIdFromToken(token);
    if (!userId) {
      this.errorMessage = 'Không tìm thấy userId trong token.';
      return;
    }

    this.cartService.getCart(userId, token).subscribe({
      next: (data) => {
        console.log('Cart data from API:', data); // Debug log
        this.cartItems = data.map((item: any) => ({
          ...item,
          selected: false,
          productId: item.product?.id || item.productId,
          productName: item.product?.name || item.productName,
          price: item.product?.price || item.price
        }));
        console.log('Processed cart items:', this.cartItems); // Debug log
      },
      error: (error) => {
        this.errorMessage = 'Failed to load cart items.';
        console.error('Error loading cart:', error);
      }
    });
  }

  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  hasSelectedItems(): boolean {
    return this.cartItems.some(item => item.selected);
  }

  goToAddOrder() {
    const selectedItems = this.cartItems
      .filter(item => item.selected)
      .map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        productName: item.productName,
        price: item.price
      }));

    console.log('Selected items before navigation:', selectedItems); // Debug log

    if (selectedItems.length === 0) {
      this.errorMessage = 'Vui lòng chọn ít nhất một sản phẩm để đặt đơn.';
      return;
    }

    this.router.navigate(['/addorder'], { state: { items: selectedItems } });
  }
}