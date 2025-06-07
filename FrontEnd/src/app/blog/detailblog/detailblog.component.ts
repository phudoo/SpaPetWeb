import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService, Blog } from '../../services/blog.service';

@Component({
  selector: 'app-detailblog',
  standalone: false,
  templateUrl: './detailblog.component.html',
  styleUrl: './detailblog.component.css'
})
export class DetailblogComponent implements OnInit {
  blog: Blog | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBlog(Number(id));
    } else {
      this.router.navigate(['/blog']);
    }
  }

  loadBlog(id: number): void {
    this.loading = true;
    this.blogService.getBlogById(id).subscribe(
      (data) => {
        this.blog = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading blog:', error);
        this.error = 'Failed to load blog post. Please try again later.';
        this.loading = false;
      }
    );
  }
}
