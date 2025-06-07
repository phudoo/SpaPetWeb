import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RevenueService, RevenueStatistics, DetailedRevenue, MonthlyRevenue, YearlyRevenue, ProductRevenueStatistics } from '../../services/revenue.service';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';

interface Appointment {
  appointmentId: number;
  appointmentDate: string;
  petName: string;
  ownerName: string;
  services: Array<{
    serviceName: string;
    price: number;
  }>;
  appointmentRevenue: number;
}

@Component({
  selector: 'app-revenue',
  standalone: false,
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.css'
})
export class RevenueComponent implements OnInit {
  revenueForm: FormGroup;
  revenueStats: RevenueStatistics | null = null;
  detailedRevenue: DetailedRevenue[] = [];
  monthlyRevenue: MonthlyRevenue | null = null;
  yearlyRevenue: YearlyRevenue | null = null;
  
  loading = false;
  error: string | null = null;
  viewMode: 'range' | 'monthly' | 'yearly' = 'range';
  revenueType: 'appointments' | 'products' = 'appointments';

  monthlyAppointments: Appointment[] = [];
  yearlyAppointments: Appointment[] = [];

  productRevenueStats: ProductRevenueStatistics | null = null;
  monthlyProductRevenue: ProductRevenueStatistics | null = null;
  yearlyProductRevenue: ProductRevenueStatistics | null = null;

  constructor(
    private fb: FormBuilder,
    private revenueService: RevenueService
  ) {
    this.revenueForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
      month: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]]
    });
  }

  ngOnInit(): void {
    // Set default date range to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    this.revenueForm.patchValue({
      startDate: formatDate(firstDay, 'yyyy-MM-dd', 'en-US'),
      endDate: formatDate(lastDay, 'yyyy-MM-dd', 'en-US')
    });

    this.loadRevenueData();
  }

  setRevenueType(type: 'appointments' | 'products'): void {
    if (this.revenueType !== type) {
      this.revenueType = type;
      this.clearData();
      this.loadRevenueData();
    }
  }

  setViewMode(mode: 'range' | 'monthly' | 'yearly'): void {
    if (this.viewMode !== mode) {
      this.viewMode = mode;
      this.clearData();
      this.loadRevenueData();
    }
  }

  private clearData(): void {
    this.revenueStats = null;
    this.detailedRevenue = [];
    this.monthlyRevenue = null;
    this.yearlyRevenue = null;
    this.error = null;
    this.monthlyAppointments = [];
    this.yearlyAppointments = [];
  }

  loadRevenueData(): void {
    if (this.revenueForm.invalid) {
      this.error = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    this.loading = true;
    this.error = null;

    const { startDate, endDate, year, month } = this.revenueForm.value;

    if (this.revenueType === 'appointments') {
      switch (this.viewMode) {
        case 'range':
          if (!startDate || !endDate) {
            this.error = 'Vui lòng chọn khoảng thời gian';
            this.loading = false;
            return;
          }
          this.loadDateRangeRevenue(startDate, endDate);
          break;
        case 'monthly':
          if (!year || !month) {
            this.error = 'Vui lòng chọn tháng và năm';
            this.loading = false;
            return;
          }
          this.loadMonthlyRevenue(year, month);
          break;
        case 'yearly':
          if (!year) {
            this.error = 'Vui lòng chọn năm';
            this.loading = false;
            return;
          }
          this.loadYearlyRevenue(year);
          break;
      }
    } else {
      switch (this.viewMode) {
        case 'range':
          if (!startDate || !endDate) {
            this.error = 'Vui lòng chọn khoảng thời gian';
            this.loading = false;
            return;
          }
          this.loadDateRangeProductRevenue(startDate, endDate);
          break;
        case 'monthly':
          if (!year || !month) {
            this.error = 'Vui lòng chọn tháng và năm';
            this.loading = false;
            return;
          }
          this.loadMonthlyProductRevenue(year, month);
          break;
        case 'yearly':
          if (!year) {
            this.error = 'Vui lòng chọn năm';
            this.loading = false;
            return;
          }
          this.loadYearlyProductRevenue(year);
          break;
      }
    }
  }

  private loadDateRangeRevenue(startDate: string, endDate: string): void {
    // Format dates to include time
    const formattedStartDate = `${startDate}T00:00:00`;
    const formattedEndDate = `${endDate}T23:59:59`;

    console.log('Loading revenue with dates:', { formattedStartDate, formattedEndDate });

    this.revenueService.getRevenueByDateRange(formattedStartDate, formattedEndDate).subscribe({
      next: (stats) => {
        console.log('Revenue stats response:', stats);
        if (!stats) {
          this.error = 'Không có dữ liệu doanh thu trong khoảng thời gian này';
          this.loading = false;
          return;
        }
        this.revenueStats = stats;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải thống kê doanh thu. Vui lòng thử lại sau.';
        this.loading = false;
        console.error('Error loading revenue:', err);
      }
    });
  }

  private loadDetailedRevenue(startDate: string, endDate: string): void {
    console.log('Loading detailed revenue with dates:', { startDate, endDate });
    
    this.revenueService.getDetailedRevenue(startDate, endDate).subscribe({
      next: (detailed) => {
        console.log('Detailed revenue response:', detailed);
        if (!detailed || detailed.length === 0) {
          this.error = 'Không có dữ liệu chi tiết doanh thu trong khoảng thời gian này';
        } else {
          this.detailedRevenue = detailed;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải chi tiết doanh thu. Vui lòng thử lại sau.';
        this.loading = false;
        console.error('Error loading detailed revenue:', err);
      }
    });
  }

  private loadMonthlyRevenue(year: number, month: number): void {
    this.revenueService.getMonthlyRevenue(year, month).subscribe({
      next: (monthly) => {
        if (!monthly) {
          this.error = 'Không có dữ liệu doanh thu cho tháng này';
          this.loading = false;
        } else {
          this.monthlyRevenue = monthly;
          // Lấy chi tiết lịch hẹn cho tháng
          const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
          const endDate = new Date(year, month, 0); // ngày cuối cùng của tháng
          const endDateStr = `${year}-${month.toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
          this.revenueService.getRevenueByDateRange(`${startDate}T00:00:00`, `${endDateStr}T23:59:59`).subscribe({
            next: (stats) => {
              this.monthlyAppointments = stats.appointments || [];
              this.loading = false;
            },
            error: () => {
              this.monthlyAppointments = [];
              this.loading = false;
            }
          });
        }
      },
      error: (err) => {
        this.error = 'Không thể tải doanh thu theo tháng. Vui lòng thử lại sau.';
        this.loading = false;
        console.error('Error loading monthly revenue:', err);
      }
    });
  }

  private loadYearlyRevenue(year: number): void {
    this.revenueService.getYearlyRevenue(year).subscribe({
      next: (yearly) => {
        if (!yearly) {
          this.error = 'Không có dữ liệu doanh thu cho năm này';
          this.loading = false;
        } else {
          this.yearlyRevenue = yearly;
          // Lấy chi tiết lịch hẹn cho năm
          const startDate = `${year}-01-01T00:00:00`;
          const endDate = `${year}-12-31T23:59:59`;
          this.revenueService.getRevenueByDateRange(startDate, endDate).subscribe({
            next: (stats) => {
              this.yearlyAppointments = stats.appointments || [];
              this.loading = false;
            },
            error: () => {
              this.yearlyAppointments = [];
              this.loading = false;
            }
          });
        }
      },
      error: (err) => {
        this.error = 'Không thể tải doanh thu theo năm. Vui lòng thử lại sau.';
        this.loading = false;
        console.error('Error loading yearly revenue:', err);
      }
    });
  }

  private loadDateRangeProductRevenue(startDate: string, endDate: string): void {
    const formattedStartDate = `${startDate}T00:00:00`;
    const formattedEndDate = `${endDate}T23:59:59`;

    this.revenueService.getProductRevenueByDateRange(formattedStartDate, formattedEndDate).subscribe({
      next: (stats) => {
        if (!stats) {
          this.error = 'Không có dữ liệu doanh thu sản phẩm trong khoảng thời gian này';
          this.loading = false;
          return;
        }
        this.productRevenueStats = stats;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải thống kê doanh thu sản phẩm';
        this.loading = false;
        console.error('Error loading product revenue:', err);
      }
    });
  }

  private loadMonthlyProductRevenue(year: number, month: number): void {
    this.revenueService.getMonthlyProductRevenue(year, month).subscribe({
      next: (stats) => {
        this.monthlyProductRevenue = stats;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải doanh thu sản phẩm theo tháng';
        this.loading = false;
        console.error('Error loading monthly product revenue:', err);
      }
    });
  }

  private loadYearlyProductRevenue(year: number): void {
    this.revenueService.getYearlyProductRevenue(year).subscribe({
      next: (stats) => {
        this.yearlyProductRevenue = stats;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải doanh thu sản phẩm theo năm';
        this.loading = false;
        console.error('Error loading yearly product revenue:', err);
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  exportToExcel(): void {
    const { year, month } = this.revenueForm.value;
    if (this.revenueType === 'appointments') {
      this.exportAppointmentRevenue(year, month);
    } else {
      this.exportProductRevenue(year, month);
    }
  }

  private exportAppointmentRevenue(year?: number, month?: number): void {
    let aoa: any[][] = [];
    let fileName = '';
    let timeStr = '';

    if (this.viewMode === 'range' && this.revenueStats?.appointments) {
      fileName = `doanh_thu_lich_hen_tu_${formatDate(this.revenueStats.startDate, 'dd-MM-yyyy', 'en-US')}_den_${formatDate(this.revenueStats.endDate, 'dd-MM-yyyy', 'en-US')}.xlsx`;
      timeStr = `Từ ngày ${formatDate(this.revenueStats.startDate, 'dd/MM/yyyy', 'en-US')} đến ngày ${formatDate(this.revenueStats.endDate, 'dd/MM/yyyy', 'en-US')}`;
      // Header rows
      aoa.push(['Loại doanh thu', 'Doanh thu lịch hẹn']);
      aoa.push(['Thời Gian', timeStr]);
      aoa.push([]); // Hàng trống
      // Table header
      aoa.push(['Ngày', 'Thú cưng', 'Chủ sở hữu', 'Dịch vụ', 'Doanh thu']);
      // Data rows
      this.revenueStats.appointments.forEach(appointment => {
        aoa.push([
          formatDate(appointment.appointmentDate, 'dd/MM/yyyy HH:mm', 'en-US'),
          appointment.petName,
          appointment.ownerName,
          appointment.services.map(s => `${s.serviceName}`).join(', '),
          this.formatCurrency(appointment.appointmentRevenue)
        ]);
      });
      // Summary row
      aoa.push(['Tổng cộng', '', '', '', this.formatCurrency(this.revenueStats.totalRevenue)]);
    } else if (this.viewMode === 'monthly' && this.monthlyRevenue && month && year) {
      fileName = `doanh_thu_lich_hen_thang_${month}_nam_${year}.xlsx`;
      timeStr = `Tháng ${month} năm ${year}`;
      aoa.push(['Loại doanh thu', 'Thời gian']);
      aoa.push(['Doanh thu lịch hẹn', timeStr]);
      aoa.push([]); // Hàng trống
      aoa.push(['Ngày', 'Thú cưng', 'Chủ sở hữu', 'Dịch vụ', 'Doanh thu']);
      if (this.monthlyAppointments && this.monthlyAppointments.length > 0) {
        this.monthlyAppointments.forEach(appointment => {
          aoa.push([
            formatDate(appointment.appointmentDate, 'dd/MM/yyyy HH:mm', 'en-US'),
            appointment.petName,
            appointment.ownerName,
            appointment.services.map(s => `${s.serviceName}`).join(', '),
            this.formatCurrency(appointment.appointmentRevenue)
          ]);
        });
      }
      aoa.push(['Tổng Cộng', '', '', '', this.formatCurrency(this.monthlyRevenue.totalRevenue)]);
    } else if (this.viewMode === 'yearly' && this.yearlyRevenue && year) {
      fileName = `doanh_thu_lich_hen_nam_${year}.xlsx`;
      timeStr = `Năm ${year}`;
      aoa.push(['Loại doanh thu', 'Thời gian']);
      aoa.push(['Doanh thu lịch hẹn', timeStr]);
      aoa.push([]); // Hàng trống
      aoa.push(['Ngày', 'Thú cưng', 'Chủ sở hữu', 'Dịch vụ', 'Doanh thu']);
      if (this.yearlyAppointments && this.yearlyAppointments.length > 0) {
        this.yearlyAppointments.forEach(appointment => {
          aoa.push([
            formatDate(appointment.appointmentDate, 'dd/MM/yyyy HH:mm', 'en-US'),
            appointment.petName,
            appointment.ownerName,
            appointment.services.map(s => `${s.serviceName}`).join(', '),
            this.formatCurrency(appointment.appointmentRevenue)
          ]);
        });
      }
      aoa.push(['Tổng cộng', '', '', '', this.formatCurrency(this.yearlyRevenue.totalRevenue)]);
    }
    if (aoa.length > 0) {
      this.exportExcelFileAOA(aoa, fileName);
    } else {
      console.error('No data to export');
    }
  }

  private exportProductRevenue(year?: number, month?: number): void {
    let aoa: any[][] = [];
    let fileName = '';
    let timeStr = '';
    if (this.viewMode === 'range' && this.productRevenueStats?.products) {
      fileName = `doanh_thu_san_pham_tu_${formatDate(this.productRevenueStats.startDate, 'dd-MM-yyyy', 'en-US')}_den_${formatDate(this.productRevenueStats.endDate, 'dd-MM-yyyy', 'en-US')}.xlsx`;
      timeStr = `Từ ngày ${formatDate(this.productRevenueStats.startDate, 'dd/MM/yyyy', 'en-US')} đến ngày ${formatDate(this.productRevenueStats.endDate, 'dd/MM/yyyy', 'en-US')}`;
      aoa.push(['Loại doanh thu', 'Doanh thu sản phẩm']);
      aoa.push(['Thời gian', timeStr]);
      aoa.push([]); // Hàng trống
      aoa.push(['Sản phẩm', 'Đơn giá', 'Số lượng', 'Doanh thu']);
      this.productRevenueStats.products.forEach(item => {
        aoa.push([
          item.productName,
          this.formatCurrency(item.price),
          item.totalQuantity,
          this.formatCurrency(item.totalRevenue)
        ]);
      });
      aoa.push(['Tổng cộng', '', '', this.formatCurrency(this.productRevenueStats.totalRevenue)]);
    } else if (this.viewMode === 'monthly' && this.monthlyProductRevenue && month && year) {
      fileName = `doanh_thu_san_pham_thang_${month}_nam_${year}.xlsx`;
      timeStr = `Tháng ${month} năm ${year}`;
      aoa.push(['Loại doanh thu', 'Doanh thu sản phẩm']);
      aoa.push(['Thời gian', timeStr]);
      aoa.push([]); // Hàng trống
      aoa.push(['Sản phẩm', 'Đơn giá', 'Số lượng', 'Doanh thu']);
      this.monthlyProductRevenue.products.forEach(item => {
        aoa.push([
          item.productName,
          this.formatCurrency(item.price),
          item.totalQuantity,
          this.formatCurrency(item.totalRevenue)
        ]);
      });
      aoa.push(['Tổng cộng', '', '', this.formatCurrency(this.monthlyProductRevenue.totalRevenue)]);
    } else if (this.viewMode === 'yearly' && this.yearlyProductRevenue && year) {
      fileName = `doanh_thu_san_pham_nam_${year}.xlsx`;
      timeStr = `Năm ${year}`;
      aoa.push(['Loại doanh thu', 'Doanh thu sản phẩm']);
      aoa.push(['Thời gian', timeStr]);
      aoa.push([]); // Hàng trống
      aoa.push(['Sản phẩm', 'Đơn giá', 'Số lượng', 'Doanh thu']);
      if (this.yearlyProductRevenue.products && this.yearlyProductRevenue.products.length > 0) {
        this.yearlyProductRevenue.products.forEach(item => {
          aoa.push([
            item.productName,
            this.formatCurrency(item.price),
            item.totalQuantity,
            this.formatCurrency(item.totalRevenue)
          ]);
        });
      }
      aoa.push(['Tổng cộng', '', '', this.formatCurrency(this.yearlyProductRevenue.totalRevenue)]);
    }
    if (aoa.length > 0) {
      this.exportExcelFileAOA(aoa, fileName);
    } else {
      console.error('No data to export');
    }
  }

  private exportExcelFileAOA(aoa: any[][], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);
    // Auto-fit column width
    const colWidths = aoa[0].map((_, colIdx) => {
      let maxLen = 10;
      for (let row = 0; row < aoa.length; row++) {
        const cell = aoa[row][colIdx];
        const cellLen = cell ? cell.toString().length : 0;
        if (cellLen > maxLen) maxLen = cellLen;
      }
      return { width: maxLen + 2 };
    });
    worksheet['!cols'] = colWidths;
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, fileName);
  }

  canExportExcel(): boolean {
    if (this.revenueType === 'appointments') {
      if (this.viewMode === 'range') return !!this.revenueStats;
      if (this.viewMode === 'monthly') return !!this.monthlyRevenue;
      if (this.viewMode === 'yearly') return !!this.yearlyRevenue;
    } else {
      if (this.viewMode === 'range') return !!this.productRevenueStats;
      if (this.viewMode === 'monthly') return !!this.monthlyProductRevenue;
      if (this.viewMode === 'yearly') return !!this.yearlyProductRevenue;
    }
    return false;
  }
}
