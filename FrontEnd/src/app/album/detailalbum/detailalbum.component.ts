import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumService, Album } from '../../services/album.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detailalbum',
  standalone: false,
  templateUrl: './detailalbum.component.html',
  styleUrl: './detailalbum.component.css'
})
export class DetailalbumComponent implements OnInit, OnDestroy {
  album: Album | null = null;
  imageUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private albumService: AlbumService,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const albumId = +params['id'];
      this.loadAlbumDetails(albumId);
    });
  }

  loadAlbumDetails(id: number): void {
    console.log('Loading album details for id:', id);
    this.albumService.getImageById(id).subscribe({
      next: (data) => {
        console.log('Album data received:', data);
        this.album = data;
        this.loadImage(id);
      },
      error: (error) => {
        console.error('Error loading album details:', error);
      }
    });
  }

  loadImage(id: number): void {
    console.log('Loading image for id:', id);
    this.albumService.getImageFile(id).subscribe({
      next: (blob) => {
        console.log('Image blob received:', blob);
        this.imageUrl = URL.createObjectURL(blob);
        console.log('Image URL created:', this.imageUrl);
      },
      error: (error) => {
        console.error('Error loading image:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
}
