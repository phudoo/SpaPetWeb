import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../services/blog.service';

@Component({
  selector: 'app-editblog',
  standalone: false,
  templateUrl: './editblog.component.html',
  styleUrl: './editblog.component.css'
})
export class EditblogComponent implements OnInit {
  blog: Blog = { id: 0, title: '', content: '' };
  loading: boolean = false;
  error: string | null = null;
  blogId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.blogId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.blogId) {
      this.loadBlog();
    }
  }

  loadBlog(): void {
    this.loading = true;
    this.error = null;
    this.blogService.getBlogById(this.blogId).subscribe({
      next: (blog: Blog) => {
        this.blog = blog;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Failed to load blog. Please try again later.';
        this.loading = false;
        console.error('Error loading blog:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.blog.title && this.blog.content) {
      this.loading = true;
      this.error = null;
      this.blogService.updateBlog(this.blogId, this.blog).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/blog']);
        },
        error: (err: Error) => {
          this.error = 'Failed to update blog. Please try again later.';
          this.loading = false;
          console.error('Error updating blog:', err);
        }
      });
    }
  }
}
