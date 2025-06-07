import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-detailproduct',
  standalone: false,
  templateUrl: './detailproduct.component.html',
  styleUrl: './detailproduct.component.css'
})
export class DetailproductComponent implements OnInit {
  product: any;
  quantity: number = 1;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(productId).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
        this.error = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại.';
      }
    });
  }

  increaseQuantity(): void {
    if (this.quantity < (this.product?.stock || 1)) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    const token = localStorage.getItem('token');
    if (!this.product || this.quantity <= 0) {
      this.error = 'Số lượng phải lớn hơn 0!';
      return;
    }

    if (!token) {
      this.error = 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!';
      return;
    }

    const userId = this.getUserIdFromToken(token);
    if (!userId) {
      this.error = 'Không tìm thấy userId trong token!';
      return;
    }

    this.cartService
      .addToCart(userId, this.product.id, this.quantity, token)
      .subscribe({
        next: () => {
          alert('Đã thêm sản phẩm vào giỏ hàng thành công!');
          this.router.navigate(['/cart']);
        },
        error: (err) => {
          console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', err);
          this.error = 'Lỗi khi thêm sản phẩm vào giỏ hàng! Vui lòng thử lại.';
        },
      });
  }

  private getUserIdFromToken(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || null;
    } catch {
      return null;
    }
  }
}