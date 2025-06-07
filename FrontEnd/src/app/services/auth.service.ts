import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login';

  private usernameSubject = new BehaviorSubject<string | null>(null);
  public username$ = this.usernameSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(null);
  public role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedUsername = localStorage.getItem('username');
      const savedRole = localStorage.getItem('role');
      this.usernameSubject.next(savedUsername);
      this.roleSubject.next(savedRole);
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password });
  }

  setLoginInfo(username: string, role: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('username', username);
      localStorage.setItem('role', role.toLowerCase());
      console.log('AuthService - Stored role:', role.toLowerCase());
    }
    this.usernameSubject.next(username);
    this.roleSubject.next(role.toLowerCase());
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    }
    this.usernameSubject.next(null);
    this.roleSubject.next(null);
  }

  getUsername(): string | null {
    return this.usernameSubject.value;
  }

  getRole(): string | null {
    const role = this.roleSubject.value;
    console.log('AuthService - Retrieved role:', role);
    return role;
  }

  getUserIdFromToken(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.userId || null;
        } catch (e) {
          console.error('Error parsing token:', e);
          return null;
        }
      }
    }
    return null;
  }
}
