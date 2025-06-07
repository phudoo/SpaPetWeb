import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Appointment as AppointmentService } from '../../services/appointment.service';
import { Service } from '../../services/services.service';

interface Appointment {
  id: number;
  petName: string;
  petOwnerName: string;
  appointmentDate: string;
  status: string;
  services: string[];
  totalPrice?: number;
  isRead?: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-interfaceuser',
  standalone: false,
  templateUrl: './interfaceuser.component.html',
  styleUrl: './interfaceuser.component.css'
})
export class InterfaceuserComponent implements OnInit {
  username: string = '';
  userRole: string = '';
  appointments: Appointment[] = [];
  scheduledAppointments: Appointment[] = [];
  notifications: Appointment[] = [];
  showNotifications: boolean = false;
  allServices: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  unreadCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appointmentService: AppointmentService,
    private serviceService: Service
  ) {}

  ngOnInit() {
    const username = this.authService.getUsername();
    const role = this.authService.getRole();
    
    if (!username || !role) {
      // If no username or role, redirect to login
      this.router.navigate(['/login']);
      return;
    }

    this.username = username;
    this.userRole = role;
    this.loadServices();
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getAllAppointment('', '', '', '').subscribe({
      next: (response) => {
        if (response) {
          this.appointments = response.map((appointment: any) => ({
            ...appointment,
            isRead: false
          })).sort((a: any, b: any) => 
            new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
          );
          
          // Filter scheduled appointments
          this.scheduledAppointments = this.appointments
            .filter(appointment => appointment.status === 'SCHEDULED')
            .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
            
          this.updateNotifications();
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = 'Không thể tải danh sách lịch hẹn';
        this.loading = false;
        console.error('Error loading appointments:', error);
      }
    });
  }

  loadServices() {
    this.serviceService.getAllService('', '', '').subscribe({
      next: (data) => {
        this.allServices = data;
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải danh sách dịch vụ';
        console.error('Error loading services:', err);
      }
    });
  }

  updateNotifications() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.notifications = this.appointments.map(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);
      
      return {
        ...appointment,
        isNew: appointmentDate.getTime() >= today.getTime()
      };
    });

    this.updateUnreadCount();
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(notification => notification.isNew).length;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.updateNotifications();
    }
  }

  closeNotifications() {
    this.showNotifications = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'COMPLETED': return 'status-completed';
      case 'PENDING': return 'status-pending';
      case 'SCHEDULED': return 'status-scheduled';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  getTotalPrice(services: string[]): number {
    return this.allServices
      .filter(s => services.includes(s.name))
      .reduce((sum, s) => sum + Number(s.price), 0);
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'COMPLETED':
        return 'hoàn thành';
      case 'PENDING':
        return 'đang chờ xác nhận';
      case 'CONFIRMED':
        return 'đã xác nhận';
      case 'CANCELLED':
        return 'đã huỷ';
      default:
        return status.toLowerCase();
    }
  }

  navigateToAppointmentDetails(appointmentId: number) {
    // Mark the notification as read
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.isRead = true;
      this.updateNotifications();
    }
    
    this.router.navigate(['/detailappointment', appointmentId]);
    this.closeNotifications();
  }
}
