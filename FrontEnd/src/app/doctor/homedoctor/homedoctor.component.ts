import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../services/appointment.service';

@Component({
  selector: 'app-homedoctor',
  standalone: false,
  templateUrl: './homedoctor.component.html',
  styleUrl: './homedoctor.component.css'
})
export class HomedoctorComponent implements OnInit {
  appointments: any[] = [];
  paginatedAppointments: any[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // Biến lọc
  filterDate: string = '';
  filterMonth: number | null = null;
  filterYear: number | null = null;
  filterStatus: string = '';
  originalAppointments: any[] = [];

  constructor(private appointmentService: Appointment) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAllUser('', '', '', '', '', '').subscribe({
      next: (data) => {
        this.appointments = data;
        this.originalAppointments = [...data];
        this.updatePagination();
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách lịch hẹn:', err);
      }
    });
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.appointments.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.updatePaginatedAppointments();
  }

  updatePaginatedAppointments(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAppointments = this.appointments.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedAppointments();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Xác nhận lịch hẹn (PENDING -> SCHEDULED)
  confirmAppointment(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xác nhận lịch hẹn này?')) {
      this.appointmentService.updateAppointmentStatus(id, 'SCHEDULED').subscribe({
        next: () => {
          alert('Đã xác nhận lịch hẹn thành công!');
          this.loadAppointments();
        },
        error: (err) => {
          if (err.status === 400) {
            alert('Không thể xác nhận lịch hẹn này. Vui lòng kiểm tra trạng thái hiện tại.');
          } else {
            alert('Có lỗi xảy ra khi xác nhận lịch hẹn!');
          }
        }
      });
    }
  }

  // Đánh dấu hoàn thành (SCHEDULED -> COMPLETED)
  markCompleted(id: number): void {
    if (confirm('Bạn có chắc chắn muốn đánh dấu lịch hẹn này đã hoàn thành?')) {
      this.appointmentService.updateAppointmentStatus(id, 'COMPLETED').subscribe({
        next: () => {
          alert('Đã đánh dấu lịch hẹn hoàn thành!');
          this.loadAppointments();
        },
        error: (err) => {
          if (err.status === 400) {
            alert('Không thể đánh dấu hoàn thành. Lịch hẹn phải ở trạng thái SCHEDULED.');
          } else {
            alert('Có lỗi xảy ra khi cập nhật trạng thái!');
          }
        }
      });
    }
  }

  // Huỷ lịch hẹn (PENDING/SCHEDULED -> CANCELLED)
  cancelAppointment(id: number): void {
    if (confirm('Bạn có chắc chắn muốn huỷ lịch hẹn này?')) {
      this.appointmentService.updateAppointmentStatus(id, 'CANCELLED').subscribe({
        next: () => {
          alert('Đã huỷ lịch hẹn thành công!');
          this.loadAppointments();
        },
        error: (err) => {
          if (err.status === 400) {
            alert('Không thể huỷ lịch hẹn này. Chỉ có thể huỷ lịch hẹn ở trạng thái PENDING hoặc SCHEDULED.');
          } else {
            alert('Có lỗi xảy ra khi huỷ lịch hẹn!');
          }
        }
      });
    }
  }

  filterByDate(): void {
    if (this.filterDate) {
      const dateString = this.filterDate.length === 10 ? this.filterDate + 'T00:00:00' : this.filterDate;
      this.appointmentService.getAppointmentsByDate(dateString).subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.appointments = data;
          } else {
            this.appointments = [...this.originalAppointments];
            alert('Không tìm thấy lịch hẹn nào cho ngày này!');
          }
          this.updatePagination();
        },
        error: (err) => {
          console.error('Lỗi khi lọc theo ngày:', err);
          this.appointments = [...this.originalAppointments];
          this.updatePagination();
        }
      });
    } else {
      this.appointments = [...this.originalAppointments];
      this.updatePagination();
    }
  }

  filterByMonth(): void {
    if (this.filterMonth && this.filterYear) {
      this.appointmentService.getAppointmentsByMonth(this.filterMonth, this.filterYear).subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.appointments = data;
          } else {
            this.appointments = [...this.originalAppointments];
            alert('Không tìm thấy lịch hẹn nào cho tháng và năm này!');
          }
          this.updatePagination();
        },
        error: (err) => {
          console.error('Lỗi khi lọc theo tháng:', err);
          this.appointments = [...this.originalAppointments];
          this.updatePagination();
        }
      });
    } else {
      this.appointments = [...this.originalAppointments];
      this.updatePagination();
    }
  }

  filterByStatus(): void {
    if (this.filterStatus) {
      this.appointmentService.getAppointmentsByStatus(this.filterStatus).subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.appointments = data;
          } else {
            this.appointments = [...this.originalAppointments];
            alert('Không tìm thấy lịch hẹn nào với trạng thái này!');
          }
          this.updatePagination();
        },
        error: (err) => {
          console.error('Lỗi khi lọc theo trạng thái:', err);
          this.appointments = [...this.originalAppointments];
          this.updatePagination();
        }
      });
    } else {
      this.appointments = [...this.originalAppointments];
      this.updatePagination();
    }
  }
}