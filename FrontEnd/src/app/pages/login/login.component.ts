import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

 onSubmit() {
  this.authService.login(this.username, this.password).subscribe(
    (response) => {
      console.log('Login response:', response); // Debug log
      localStorage.setItem('token', response.token);
      this.authService.setLoginInfo(response.username, response.role);
      console.log('Stored role:', response.role); // Debug log

      if (response.role.toLowerCase() === 'admin') {
        this.router.navigate(['/menuadmin']);
      } else if (response.role.toLowerCase() === 'doctor') {
        this.router.navigate(['/homedoctor']);
      } else {
        this.router.navigate(['/interface']);
      }
    },
    (error) => {
      console.error('Login error:', error); // Debug log
      this.errorMessage = 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.';
    }
  );
}

}
