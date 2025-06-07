import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  fullName: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  roleId: number = 1;
  errorMessage: string = '';
  constructor(private RegisterService: RegisterService, private router: Router) {}
  onsubmit() {
  this.RegisterService.register(this.username, this.password, this.address, this.email, this.fullName, this.phone, this.roleId).subscribe(
      (response) => {
        // day 2
        this.router.navigate(['/login']); // Chuyển hướng đến trang đăng nhập
      },
       (error) => {
        this.errorMessage =
          'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.';
      }
    );
  }
}
