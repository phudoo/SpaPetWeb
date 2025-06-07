import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../../services/appointment.service';
import { Service } from '../../../services/services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detailappointment',
  standalone: false,
  templateUrl: './detailappointment.component.html',
  styleUrl: './detailappointment.component.css'
})
export class DetailappointmentComponent implements OnInit {
  appointment: any = {};
  allServices: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private appointmentService: Appointment,
    private serviceService: Service,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Load appointment details
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (data) => {
        this.appointment = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải thông tin lịch hẹn';
        this.loading = false;
      }
    });

    // Load all services for price calculation
    this.serviceService.getAllService('', '', '').subscribe({
      next: (data) => {
        this.allServices = data;
      },
      error: (err) => {
        console.error('Không thể tải danh sách dịch vụ:', err);
      }
    });
  }

  getServicePrice(serviceName: string): number {
    const service = this.allServices.find(s => s.name === serviceName);
    return service ? Number(service.price) : 0;
  }

  getTotalPrice(serviceNames: string[]): number {
    return serviceNames.reduce((sum, name) => sum + this.getServicePrice(name), 0);
  }

  goBack(): void {
    this.router.navigate(['/allappointment']);
  }

  cancelAppointment(): void {
    if (confirm('Bạn có chắc chắn muốn huỷ lịch hẹn này?')) {
      this.appointmentService.cancelAppointment(this.appointment.id).subscribe({
        next: (res) => {
          alert('Đã huỷ lịch hẹn thành công!');
          this.router.navigate(['/allappointment']);
        },
        error: (err) => {
          if (err.status === 200 || err.status === 204) {
            alert('Đã huỷ lịch hẹn thành công!');
            this.router.navigate(['/allappointment']);
          } else {
            alert('Huỷ lịch hẹn thất bại!');
          }
        }
      });
    }
  }
}



