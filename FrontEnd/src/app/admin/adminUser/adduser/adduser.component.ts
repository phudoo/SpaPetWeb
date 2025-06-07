import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../services/user.service';
@Component({
  selector: 'app-adduser',
  standalone: false,
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.css',
})
export class AdduserComponent {
  username: string = '';
  password: string = '';
  fullName: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  roleId: number = 2;
  errorMessage: string = '';
  constructor(private userService: User, private router: Router) {}
  onsubmit() {
    this.userService
      .adduser(
        this.username,
        this.password,
        this.address,
        this.email,
        this.fullName,
        this.phone,
        this.roleId
      )
      .subscribe(
        (response) => {
          this.router.navigate(['/home']);
        },
        (error) => {
          this.errorMessage =
            'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.';
        }
      );
  }
}
