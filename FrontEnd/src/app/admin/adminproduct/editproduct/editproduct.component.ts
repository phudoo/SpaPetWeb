import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-editproduct',
  standalone: false,
  templateUrl: './editproduct.component.html',
  styleUrl: './editproduct.component.css'
})
export class EditproductComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
  imageFile?: File;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productForm = this.fb.group({
      id: [this.productId],
      name: [''],
      description: [''],
      price: [''],
      stock: ['']
    });

    this.productService.getProductById(this.productId).subscribe({
      next: (data) => {
        this.productForm.patchValue(data);
      },
      error: (err) => {
        console.error('Lỗi lấy dữ liệu sản phẩm:', err);
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      console.log('Submitting product data:', this.productForm.value);
      console.log('Submitting image file:', this.imageFile);

      this.productService.updateProduct(this.productId, this.productForm.value, this.imageFile).subscribe({
        next: () => {
          alert('Cập nhật sản phẩm thành công!');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          console.error('Error updating product:', err);
          alert('Có lỗi xảy ra khi cập nhật sản phẩm.');
        }
      });
    }
  }

  getImageUrl(product: any): SafeUrl {
    if (product.id) {
      const imageUrl = `${this.productService.apiUrl}/image/${product.id}`;
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    return this.sanitizer.bypassSecurityTrustUrl('assets/default-product-image.png');
  }
}