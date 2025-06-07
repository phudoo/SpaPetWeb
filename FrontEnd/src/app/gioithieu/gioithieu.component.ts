import { Component, OnInit } from '@angular/core';
import { Service } from '../services/services.service';
import { ReviewService } from '../services/review.service';
import { ProductService } from '../services/product.service';
import { BlogService } from '../services/blog.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-gioithieu',
  standalone: false,
  templateUrl: './gioithieu.component.html',
  styleUrl: './gioithieu.component.css'
})
export class GioithieuComponent implements OnInit {
  services: any[] = [];
  reviews: any[] = [];
  products: any[] = [];
  blogs: any[] = [];
  loading = {
    services: true,
    reviews: true,
    products: true,
    blogs: true
  };

  // Pagination properties for products
  currentProductPage = 1;
  productsPerPage = 6;
  totalProducts = 0;

  // Pagination properties for blogs
  currentBlogPage = 1;
  blogsPerPage = 3;
  totalBlogs = 0;

  constructor(
    private serviceService: Service,
    private reviewService: ReviewService,
    private productService: ProductService,
    private blogService: BlogService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadServices();
    this.loadReviews();
    this.loadProducts();
    this.loadBlogs();
  }

  viewProductDetail(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  loadServices() {
    this.serviceService.getAllService('', '', '').subscribe({
      next: (data) => {
        this.services = data;
        this.loading.services = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.loading.services = false;
      }
    });
  }

  loadReviews() {
    // Load reviews for a specific service (e.g., service ID 1)
    this.reviewService.getServiceReviews(1).subscribe({
      next: (data) => {
        this.reviews = data;
        this.loading.reviews = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.loading.reviews = false;
      }
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.totalProducts = data.length;
        this.loading.products = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading.products = false;
      }
    });
  }

  loadBlogs() {
    this.blogService.getAllBlogs().subscribe({
      next: (data) => {
        this.blogs = data;
        this.totalBlogs = data.length;
        this.loading.blogs = false;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.loading.blogs = false;
      }
    });
  }

  // Pagination methods for products
  get paginatedProducts() {
    const startIndex = (this.currentProductPage - 1) * this.productsPerPage;
    return this.products.slice(startIndex, startIndex + this.productsPerPage);
  }

  get totalProductPages() {
    return Math.ceil(this.totalProducts / this.productsPerPage);
  }

  changeProductPage(page: number) {
    if (page >= 1 && page <= this.totalProductPages) {
      this.currentProductPage = page;
    }
  }

  // Pagination methods for blogs
  get paginatedBlogs() {
    const startIndex = (this.currentBlogPage - 1) * this.blogsPerPage;
    return this.blogs.slice(startIndex, startIndex + this.blogsPerPage);
  }

  get totalBlogPages() {
    return Math.ceil(this.totalBlogs / this.blogsPerPage);
  }

  changeBlogPage(page: number) {
    if (page >= 1 && page <= this.totalBlogPages) {
      this.currentBlogPage = page;
    }
  }

  checkLoginAndNavigate() {
    const username = this.authService.getUsername();
    if (!username) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/addappointment']);
    }
  }
}
