import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  updateQuantity?: number;
}

@Component({
  selector: 'app-allproductadmin',
  standalone: false,
  templateUrl: './allproductadmin.component.html',
  styleUrl: './allproductadmin.component.css'
})
export class AllproductadminComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.map((product: any) => ({
          ...product,
          updateQuantity: 0
        }));
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  getImageUrl(product: Product): SafeUrl {
    if (product.id) {
      const imageUrl = `${this.productService.apiUrl}/image/${product.id}`;
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    return this.sanitizer.bypassSecurityTrustUrl('assets/default-product-image.png');
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/default-product-image.png';
  }

  updateStock(productId: number, quantity: number): void {
    if (confirm(`Bạn có chắc chắn muốn cập nhật số lượng tồn kho cho sản phẩm ID ${productId}?`)) {
      this.productService.updateProductStock(productId, quantity).subscribe({
        next: () => {
          alert(`Cập nhật số lượng tồn kho thành công cho sản phẩm ID ${productId}`);
          this.loadProducts();
        },
        error: (err) => {
          console.error(`Lỗi khi cập nhật số lượng tồn kho cho sản phẩm ID ${productId}:`, err);
          alert('Đã xảy ra lỗi khi cập nhật số lượng tồn kho. Vui lòng thử lại.');
        }
      });
    }
  }

  deleteProduct(productId: number): void {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID ${productId}?`)) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          alert(`Sản phẩm ID ${productId} đã được xóa thành công.`);
          this.loadProducts();
        },
        error: (err) => {
          console.error(`Lỗi khi xóa sản phẩm ID ${productId}:`, err);
          alert('Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại.');
        }
      });
    }
  }
}