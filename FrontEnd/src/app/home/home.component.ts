import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  userName: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const name = localStorage.getItem('username');

      if (name && name !== 'undefined' && name !== 'null') {
        this.userName = name;
      } else {
        this.userName = null;
      }
    }
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
  }
    
}