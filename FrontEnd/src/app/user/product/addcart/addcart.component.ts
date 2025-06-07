import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-addcart',
  standalone: false,
  templateUrl: './addcart.component.html',
  styleUrl: './addcart.component.css',
})
export class AddcartComponent implements OnInit {
  productId: number | null = null;
  quantity: number = 1;
  product: any = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.productId = params['id'];
      if (this.productId) {
        this.loadProductDetails();
      }
    });
  }

  loadProductDetails(): void {
    if (!this.productId) return;

    this.productService.getProductById(this.productId).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product details:', err);
        this.error = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại.';
        this.loading = false;
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
    if (!this.productId || this.quantity <= 0) {
      this.error = 'ID sản phẩm không hợp lệ hoặc số lượng phải lớn hơn 0!';
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

    const productId = Number(this.productId);
    
    this.cartService
      .addToCart(userId, productId, this.quantity, token)
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
