import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addproduct',
  standalone: false,
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.css'
})
export class AddproductComponent {
  product = {
    name: '',
    description: '',
    price: 0,
    stock: 0
  };
  selectedImage: File | null = null;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.selectedImage) {
      alert('Vui lòng chọn một file ảnh!');
      return;
    }

    this.productService.createProduct(this.product, this.selectedImage).subscribe({
      next: (response) => {
        alert('Sản phẩm đã được thêm thành công!');
        this.router.navigate(['/admin/products']); // Navigate to all products page
      },
      error: (err) => {
        console.error('Error adding product:', err);
        alert('Có lỗi xảy ra khi thêm sản phẩm.');
      }
    });
  }
}