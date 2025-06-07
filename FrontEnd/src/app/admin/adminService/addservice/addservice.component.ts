import { Component } from '@angular/core';
import { Router } from '@angular/router';
// Update the import path below if the actual location of service.service.ts is different
import { Service } from '../../../services/services.service';
@Component({
  selector: 'app-addservice',
  standalone: false,
  templateUrl: './addservice.component.html',
  styleUrl: './addservice.component.css',
})
export class AddserviceComponent {
  name: string = '';
  description: string = '';
  price: string = '';
  errorMessage: string = '';
  constructor(private addService: Service, private router: Router) {}
  onsubmit() {
    this.addService
      .addService(this.name, this.description, this.price)
      .subscribe(
        (response) => {
          this.router.navigate(['/home']);
        },
        (error) => {
          this.errorMessage =
            'Thêm không thành công. Vui lòng kiểm tra lại thông tin.';
        }
      );
  }
}
