import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(products => {
        return products.map(product => ({
          ...product,
          imageUrl: `${this.apiUrl}/image/${product.id}`
        }));
      })
    );
  }

  getProductsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${category}`).pipe(
      map(products => {
        return products.map(product => ({
          ...product,
          imageUrl: `${this.apiUrl}/image/${product.id}`
        }));
      })
    );
  }

  searchProducts(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?name=${encodeURIComponent(name)}`).pipe(
      map(products => {
        return products.map(product => ({
          ...product,
          imageUrl: `${this.apiUrl}/image/${product.id}`
        }));
      })
    );
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(product => ({
        ...product,
        imageUrl: `${this.apiUrl}/image/${product.id}`
      }))
    );
  }

  createProduct(product: { name: string; description: string; price: number; stock: number }, image: File): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    formData.append('image', image);

    return this.http.post<any>(this.apiUrl, formData, { headers });
  }

  getProductImage(productId: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/image/${productId}`, { 
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'image/*',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  updateProduct(id: number, product: any, image?: File): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    if (image) {
      formData.append('image', image);
    }

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData, { headers });
  }

  updateProductStock(id: number, quantity: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.apiUrl}/${id}/stock`, null, {
      headers,
      params: { quantity: quantity.toString() }
    });
  }

  deleteProduct(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}