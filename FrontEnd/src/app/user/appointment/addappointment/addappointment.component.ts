import { Component, OnInit } from '@angular/core';
import { Service } from '../../../services/services.service';
import { Appointment } from '../../../services/appointment.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pets } from '../../../services/pet.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addappointment',
  templateUrl: './addappointment.component.html',
  styleUrls: ['./addappointment.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddappointmentComponent implements OnInit {
  services: any[] = [];
  appointmentForm!: FormGroup;
  pets: any[] = []; 
  totalPrice: number = 0;
  bookedDates: string[] = [];
  bookedAppointments: any[] = [];
  loading: boolean = false;
  minDate: string = '';
  maxDate: string = '';
  isFormSubmitted: boolean = false;
  showSuccessModal: boolean = false;
  createdAppointmentId: number | null = null;

  // Calendar properties
  showCalendar: boolean = false;
  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  weekDays: string[] = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  calendarDates: any[] = [];
  selectedDate: Date | null = null;
  timeSlots: string[] = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00'
  ];

  constructor(
    private adminService: Service,
    private appointmentService: Appointment,
    private petService: Pets, 
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Check if user is logged in
    const username = this.authService.getUsername();
    if (!username) {
      this.router.navigate(['/login']);
      return;
    }

    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().slice(0, 16);

    // Set maximum date to 1 month from today
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 1);
    this.maxDate = maxDate.toISOString().slice(0, 16);

    this.appointmentForm = this.fb.group({
      petId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      note: [''],
      serviceIds: [[]]
    });

    // Initialize calendar
    this.generateCalendar();
  }

  ngOnInit(): void {
    // Check if user is logged in
    const username = this.authService.getUsername();
    if (!username) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.adminService.getAllService('', '', '').subscribe((data) => {
      this.services = data;
    });
    this.petService.getAllMyPets('', '', '', '', '').subscribe((data) => {
      this.pets = data;
    });
    this.loadBookedDates();
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth, 1).toLocaleString('vi-VN', { month: 'long' });
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    this.calendarDates = [];

    // Add days from previous month
    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay - i);
      this.calendarDates.push({
        day: prevMonthLastDay - i,
        date: date,
        dateString: date.toISOString().slice(0, 10),
        isCurrentMonth: false
      });
    }

    // Add days from current month
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      this.calendarDates.push({
        day: i,
        date: date,
        dateString: date.toISOString().slice(0, 10),
        isCurrentMonth: true
      });
    }

    // Add days from next month
    const remainingDays = 42 - this.calendarDates.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, i);
      this.calendarDates.push({
        day: i,
        date: date,
        dateString: date.toISOString().slice(0, 10),
        isCurrentMonth: false
      });
    }
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
    this.selectedDate = null;
    this.appointmentForm.patchValue({
      appointmentDate: ''
    }, { emitEvent: false });
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
    this.selectedDate = null;
    this.appointmentForm.patchValue({
      appointmentDate: ''
    }, { emitEvent: false });
  }

  getBookingsForDate(dateString: string): any[] {
    return this.bookedAppointments.filter(app => {
      const appDate = new Date(app.appointmentDate);
      return appDate.toISOString().slice(0, 10) === dateString;
    });
  }

  getBookingsForTime(time: string): any[] {
    if (!this.selectedDate) return [];
    const dateString = this.selectedDate.toISOString().slice(0, 10);
    return this.bookedAppointments.filter(app => {
      const appDate = new Date(app.appointmentDate);
      const appTime = appDate.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh'
      });
      return appDate.toISOString().slice(0, 10) === dateString && appTime === time;
    });
  }

  selectDate(date: any): void {
    if (date.isCurrentMonth) {
      this.selectedDate = date.date;
      this.showCalendar = true;
      
      // Nếu ngày đã được đặt nhiều lịch, hiển thị thông báo
      const bookings = this.getBookingsForDate(date.dateString);
      if (bookings.length > 0) {
        console.log(`${bookings.length} lịch hẹn đã được đặt cho ngày này`);
      }
    }
  }

  selectTime(time: string): void {
    if (this.selectedDate) {
      const bookings = this.getBookingsForTime(time);
      if (bookings.length > 0) {
        alert('Thời gian này đã được đặt. Vui lòng chọn thời gian khác!');
        return;
      }

      // Create date in local timezone
      const dateTime = new Date(this.selectedDate);
      const [hours, minutes] = time.split(':').map(Number);
      
      // Set the time in local timezone
      dateTime.setHours(hours, minutes, 0, 0);
      
      // Convert to ISO string and adjust for timezone
      const year = dateTime.getFullYear();
      const month = String(dateTime.getMonth() + 1).padStart(2, '0');
      const day = String(dateTime.getDate()).padStart(2, '0');
      const hour = String(hours).padStart(2, '0');
      const minute = String(minutes).padStart(2, '0');
      
      const formattedDateTime = `${year}-${month}-${day}T${hour}:${minute}`;
      
      this.appointmentForm.patchValue({
        appointmentDate: formattedDateTime
      });
    }
  }

  confirmTimeSelection(): void {
    if (this.appointmentForm.get('appointmentDate')?.value) {
      this.showCalendar = false;
    } else {
      alert('Vui lòng chọn thời gian trước khi xác nhận!');
    }
  }

  isTimeBooked(time: string): boolean {
    if (!this.selectedDate) return false;
    const bookings = this.getBookingsForTime(time);
    return bookings.length > 0;
  }

  loadBookedDates() {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    this.appointmentService.getBookedDates(
      startDate.toISOString(),
      endDate.toISOString()
    ).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.bookedDates = data.map((appointment: any) => {
            const date = new Date(appointment.appointmentDate);
            return date.toISOString().slice(0, 16);
          });
          
          this.bookedAppointments = data.map((appointment: any) => ({
            ...appointment,
            appointmentDate: new Date(appointment.appointmentDate)
          })).sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime());
          
          this.loading = false;
        } else {
          console.error('Invalid response format from API');
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading booked dates:', error);
        alert('Không thể tải danh sách lịch hẹn đã đặt. Vui lòng thử lại sau.');
        this.loading = false;
      }
    });
  }

  isDateBooked(date: string): boolean {
    if (!date) return false;
    return this.bookedDates.some(bookedDate => bookedDate.startsWith(date));
  }

  onDateChange(event: any) {
    const selectedDate = event.target.value;
    if (this.isDateBooked(selectedDate)) {
      alert('Thời gian này đã được đặt. Vui lòng chọn thời gian khác!');
      this.appointmentForm.patchValue({ appointmentDate: '' });
    }
  }

  onServiceChange(event: any) {
    let serviceIds = this.appointmentForm.value.serviceIds || [];
    const value = Number(event.target.value);
    if (event.target.checked) {
      if (!serviceIds.includes(value)) {
        serviceIds.push(value);
      }
    } else {
      serviceIds = serviceIds.filter((id: number) => id !== value);
    }
    this.appointmentForm.patchValue({ serviceIds });
    this.updateTotalPrice(serviceIds); // Cập nhật tổng tiền
  }

  updateTotalPrice(serviceIds: number[]) {
    this.totalPrice = this.services
      .filter(s => serviceIds.includes(s.id))
      .reduce((sum, s) => sum + Number(s.price), 0);
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.appointmentForm.invalid) {
      return;
    }

    const formValue = this.appointmentForm.value;
    const petId = Number(formValue.petId);
    
    // Format the date time correctly for the API
    const appointmentDate = formValue.appointmentDate;
    const note = formValue.note;
    const serviceIds = (formValue.serviceIds || []).map((id: any) => Number(id));

    this.appointmentService.addAppointMent(
      petId,
      appointmentDate,
      note,
      serviceIds
    ).subscribe({
      next: (response) => {
        this.createdAppointmentId = response.id;
        this.showSuccessModal = true;
        this.appointmentForm.reset();
        this.isFormSubmitted = false;
        this.loadBookedDates();
      },
      error: (error) => {
        alert('Tạo lịch hẹn thất bại!');
        console.error('Lỗi tạo lịch hẹn:', error);
      }
    });
  }

  viewAppointmentDetails() {
    if (this.createdAppointmentId) {
      this.router.navigate(['/detailappointment', this.createdAppointmentId]);
    }
  }

  navigateToAddPet() {
    this.router.navigate(['/addpet']);
  }
}
