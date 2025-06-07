import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlbumService, Album } from '../services/album.service';

@Component({
  selector: 'app-allalbum',
  standalone: false,
  templateUrl: './allalbum.component.html',
  styleUrl: './allalbum.component.css'
})
export class AllalbumComponent implements OnInit, OnDestroy {
  albums: Album[] = [];
  selectedAlbum: Album | null = null;
  imageUrls: { [key: number]: string } = {};

  constructor(private albumService: AlbumService) {}

  ngOnInit(): void {
    this.loadAlbums();
  }

  loadAlbums(): void {
    this.albumService.getAllImages().subscribe({
      next: (data) => {
        this.albums = data;
        this.albums.forEach(album => {
          if (album.id) {
            this.loadImage(album.id);
          }
        });
      },
      error: (error) => {
        console.error('Error loading albums:', error);
      }
    });
  }

  loadImage(id: number): void {
    this.albumService.getImageFile(id).subscribe({
      next: (blob) => {
        this.imageUrls[id] = URL.createObjectURL(blob);
      },
      error: (error) => {
        console.error('Error loading image:', error);
      }
    });
  }

  openImageModal(album: Album) {
    this.selectedAlbum = album;
  }

  closeImageModal() {
    this.selectedAlbum = null;
  }

  ngOnDestroy() {
    Object.values(this.imageUrls).forEach(url => {
      URL.revokeObjectURL(url);
    });
  }
}
