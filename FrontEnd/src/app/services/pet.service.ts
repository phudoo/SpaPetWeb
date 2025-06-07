import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Pets {

  private apiUrl = 'http://localhost:8080/api/pets';

  constructor(private http: HttpClient) {}

//day 7
 getAllMyPets(name: string, species: string, breed: string, birthday: string, sex: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
   return this.http.get<any>(`${this.apiUrl}/my-pets`,  {
    headers, 
    params: { name, species, breed, birthday, sex
    }
  });
}
//day 7
addPet(pet: any, imageFile: File): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  const formData = new FormData();
  formData.append('pet', JSON.stringify(pet));
  formData.append('image', imageFile);
  return this.http.post<any>(this.apiUrl, formData, { headers });
}

// day 7
deletePet(id: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
}

//day 10
getPetById(id: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
}
//day 10
updatePet(id: number, pet: any, imageFile?: File): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    // Không set Content-Type, để HttpClient tự set khi dùng FormData
  });
  const formData = new FormData();
  formData.append('pet', JSON.stringify(pet));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return this.http.put<any>(`${this.apiUrl}/${id}`, formData, { headers });
}
//day 11
getPetImage(id: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  const imageUrl = `${this.apiUrl}/image/${id}`;
  console.log('Fetching image from URL:', imageUrl);
  return this.http.get(imageUrl, { 
    headers,
    responseType: 'blob' as 'json'
  });
}
}