import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlbumService } from '../../services/album.service';

@Component({
  selector: 'app-addalbum',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './addalbum.component.html',
  styleUrl: './addalbum.component.css'
})
export class AddalbumComponent {
  description: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private albumService: AlbumService,
    private router: Router
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.error = 'Please select an image';
      return;
    }

    this.loading = true;
    this.error = null;

    this.albumService.uploadImage(this.description, this.selectedFile).subscribe(
      () => {
        this.loading = false;
        this.router.navigate(['/album']);
      },
      (error) => {
        console.error('Error uploading image:', error);
        this.error = 'Failed to upload image. Please try again.';
        this.loading = false;
      }
    );
  }
}
