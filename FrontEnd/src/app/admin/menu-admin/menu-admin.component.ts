import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu-admin',
  standalone: false,
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.css'
})
export class MenuAdminComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user is admin
    this.checkAdminRole();
  }

  private checkAdminRole(): void {
    const userRole = localStorage.getItem('role');
    console.log('MenuAdmin - Checking role:', userRole); // Debug log
    
    if (!userRole) {
      console.log('MenuAdmin - No role found, redirecting to login'); // Debug log
      this.router.navigate(['/login']);
      return;
    }

    this.isAdmin = userRole.toLowerCase() === 'admin';
    console.log('MenuAdmin - Is admin:', this.isAdmin); // Debug log
    
    if (!this.isAdmin) {
      console.log('MenuAdmin - Not admin, redirecting to login'); // Debug log
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
