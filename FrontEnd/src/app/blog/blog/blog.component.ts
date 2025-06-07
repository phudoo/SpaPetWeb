import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog',
  standalone: false,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {
  blogs: Blog[] = [];
  loading: boolean = false;
  error: string | null = null;
  isAdminOrDoctor: boolean = false;

  constructor(
    private blogService: BlogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
    this.checkUserRole();
  }

  private checkUserRole(): void {
    this.authService.role$.subscribe(role => {
      this.isAdminOrDoctor = role === 'admin' || role === 'doctor';
    });
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;
    this.blogService.getAllBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load blogs. Please try again later.';
        this.loading = false;
        console.error('Error loading blogs:', err);
      }
    });
  }

  deleteBlog(id: number): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.loading = true;
      this.error = null;
      this.blogService.deleteBlog(id).subscribe({
        next: () => {
          this.blogs = this.blogs.filter(blog => blog.id !== id);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to delete blog. Please try again later.';
          this.loading = false;
          console.error('Error deleting blog:', err);
        }
      });
    }
  }
}
