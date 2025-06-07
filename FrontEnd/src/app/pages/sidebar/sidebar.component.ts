import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // kiểm tra lại đường dẫn nếu cần

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userRole: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.role$.subscribe((role) => {
      this.userRole = role;
    });
  }

  muteVideo(event: Event) {
    const video = event.target as HTMLVideoElement;
    video.muted = true;
    video.volume = 0;
    video.play().catch(error => {
      console.log('Video play failed:', error);
    });
  }
}
