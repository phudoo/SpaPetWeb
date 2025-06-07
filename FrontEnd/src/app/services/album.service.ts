import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Album {
  id?: number;
  description: string;
  imageUrl?: string;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private apiUrl = 'http://localhost:8080/api/albums';

  constructor(private http: HttpClient) { }

  uploadImage(description: string, image: File): Observable<Album> {
    const formData = new FormData();
    formData.append('album', JSON.stringify({ description }));
    formData.append('image', image);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post<Album>(this.apiUrl, formData, { headers });
  }

  getImageById(id: number): Observable<Album> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<Album>(`${this.apiUrl}/${id}`, { headers });
  }

  getImageFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/image/${id}`, { 
      responseType: 'blob'
    });
  }

  getMyImages(): Observable<Album[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<Album[]>(`${this.apiUrl}/my-images`, { headers });
  }

  getAllImages(): Observable<Album[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<Album[]>(`${this.apiUrl}/all`, { headers });
  }

  updateImage(id: number, description: string, image?: File): Observable<Album> {
    const formData = new FormData();
    formData.append('album', JSON.stringify({ description }));
    if (image) {
      formData.append('image', image);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.put<Album>(`${this.apiUrl}/${id}`, formData, { headers });
  }

  deleteImage(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
