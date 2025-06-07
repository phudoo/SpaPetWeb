import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  userName: string | null = null;
  userRole: string | null = null;
  isDropdownOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.username$.subscribe(name => {
      this.userName = name;
    });
    this.authService.role$.subscribe(role => {
      this.userRole = role;
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown') && !target.closest('.dropdown-menu')) {
      this.isDropdownOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isDropdownOpen = false;
  }
}
