import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService, Blog } from '../../services/blog.service';

@Component({
  selector: 'app-addblog',
  standalone: false,
  templateUrl: './addblog.component.html',
  styleUrl: './addblog.component.css'
})
export class AddblogComponent {
  blog: Blog = {
    title: '',
    content: ''
  };

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.blogService.createBlog(this.blog).subscribe(
      (response) => {
        console.log('Blog created successfully:', response);
        this.router.navigate(['/blog']);
      },
      (error) => {
        console.error('Error creating blog:', error);
      }
    );
  }
}
