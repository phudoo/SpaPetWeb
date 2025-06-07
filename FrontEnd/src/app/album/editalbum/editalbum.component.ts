import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlbumService, Album } from '../../services/album.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-editalbum',
  standalone: false,
  templateUrl: './editalbum.component.html',
  styleUrl: './editalbum.component.css'
})
export class EditalbumComponent implements OnInit {
  album: Album = {
    description: ''
  };
  albumId: number = 0;
  selectedFile: File | null = null;
  previewUrl: string | SafeUrl | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private albumService: AlbumService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.albumId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAlbum();
  }

  loadAlbum(): void {
    this.loading = true;
    this.albumService.getImageById(this.albumId).subscribe(
      (data) => {
        this.album = data;
        this.previewUrl = this.getImageUrl(this.albumId);
        this.loading = false;
      },
      (error) => {
        console.error('Error loading album:', error);
        this.error = 'Failed to load image. Please try again.';
        this.loading = false;
      }
    );
  }

  getImageUrl(id: number): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`http://localhost:8080/api/albums/image/${id}`);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.error = null;

    this.albumService.updateImage(
      this.albumId,
      this.album.description,
      this.selectedFile || undefined
    ).subscribe(
      () => {
        this.loading = false;
        this.router.navigate(['/album']);
      },
      (error) => {
        console.error('Error updating image:', error);
        this.error = 'Failed to update image. Please try again.';
        this.loading = false;
      }
    );
  }
}
