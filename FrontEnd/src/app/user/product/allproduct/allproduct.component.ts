import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-allproduct',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './allproduct.component.html',
  styleUrl: './allproduct.component.css'
})
export class AllproductComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 16;
  totalPages: number = 1;
  paginatedProducts: any[] = [];

  categories = [
    { value: '', label: 'Tất cả' },
    { value: 'Thức ăn', label: 'Thức ăn' },
    { value: 'Phụ Kiện Thú Cưng', label: 'Phụ Kiện Thú Cưng' },
    { value: 'Sữa Tắm', label: 'Sữa Tắm' },
    { value: 'Chuồng Lồng Nuôi Nhốt', label: 'Chuồng Lồng Nuôi Nhốt' },
    { value: 'Thuốc', label: 'Thuốc' }
  ];

  constructor(
    private productService: ProductService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadAllProducts();
  }

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.updatePagination();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  loadProductsByCategory(category: string): void {
    if (!category) {
      this.loadAllProducts();
      return;
    }

    this.productService.getProductsByCategory(category).subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.currentPage = 1;
        this.updatePagination();
      },
      error: (err) => {
        console.error('Error fetching products by category:', err);
      }
    });
  }

  searchProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
      this.currentPage = 1;
      this.updatePagination();
      return;
    }

    this.productService.searchProducts(this.searchTerm).subscribe({
      next: (data) => {
        this.filteredProducts = data;
        this.currentPage = 1;
        this.updatePagination();
      },
      error: (err) => {
        console.error('Error searching products:', err);
      }
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.loadProductsByCategory(category);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getImageUrl(product: any): SafeUrl {
    if (product.imageUrl) {
      return this.sanitizer.bypassSecurityTrustUrl(product.imageUrl);
    }
    return this.sanitizer.bypassSecurityTrustUrl('assets/default-product-image.png');
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/default-product-image.png';
  }
}