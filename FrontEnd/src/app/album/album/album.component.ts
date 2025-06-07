import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlbumService, Album } from '../../services/album.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})
export class AlbumComponent implements OnInit {
  albums: Album[] = [];
  loading: boolean = true;
  error: string | null = null;
  isAdminOrDoctor: boolean = false;
  isAuthenticated: boolean = false;

  constructor(
    private albumService: AlbumService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {
    this.authService.role$.subscribe(role => {
      this.isAdminOrDoctor = role === 'admin' || role === 'doctor';
      this.isAuthenticated = !!role;
      // Reload images when role changes
      if (this.isAuthenticated) {
        this.loadImages();
      }
    });
  }

  ngOnInit(): void {
    if (this.isAuthenticated) {
      this.loadImages();
    }
  }

  loadImages(): void {
    if (!this.isAuthenticated) {
      return;
    }

    this.loading = true;
    // For admin/doctor, show all images. For regular users, show their own images
    const observable = this.isAdminOrDoctor 
      ? this.albumService.getAllImages()
      : this.albumService.getMyImages();

    observable.subscribe(
      (data) => {
        this.albums = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading images:', error);
        this.error = 'Failed to load images. Please try again later.';
        this.loading = false;
      }
    );
  }

  getImageUrl(id: number): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`http://localhost:8080/api/albums/image/${id}`);
  }

  deleteImage(id: number): void {
    if (!this.isAuthenticated) {
      this.error = 'You must be logged in to delete images';
      return;
    }

    if (confirm('Are you sure you want to delete this image?')) {
      this.albumService.deleteImage(id).subscribe(
        () => {
          this.albums = this.albums.filter(album => album.id !== id);
        },
        (error) => {
          console.error('Error deleting image:', error);
          this.error = 'Failed to delete image. Please try again later.';
        }
      );
    }
  }
}
