import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orderdoctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orderdoctor.component.html',
  styleUrl: './orderdoctor.component.css'
})
export class OrderdoctorComponent implements OnInit {
  orders: any[] = [];
  paginatedOrders: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  updatingStatus: { [key: number]: boolean } = {};
  confirmingOrder: { [key: number]: boolean } = {};
  completingOrder: { [key: number]: boolean } = {};
  filterUserId: number | null = null;
  filterStatus: string = '';
  statusOptions: string[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  first: any;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.error = null;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
        console.error('Error loading orders:', err);
      }
    });
  }

  loadOrdersByUser(userId: number) {
    this.loading = true;
    this.error = null;
    this.orderService.getOrdersByUser(userId).subscribe({
      next: (data) => {
        this.orders = data;
        this.currentPage = 1;
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders by user. Please try again later.';
        this.loading = false;
        console.error('Error loading orders by user:', err);
      }
    });
  }

  loadOrdersByStatus(status: string) {
    this.loading = true;
    this.error = null;
    this.orderService.getOrdersByStatus(status).subscribe({
      next: (data) => {
        this.orders = data;
        this.currentPage = 1;
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders by status. Please try again later.';
        this.loading = false;
        console.error('Error loading orders by status:', err);
      }
    });
  }

  clearFilters() {
    this.filterUserId = null;
    this.filterStatus = '';
    this.currentPage = 1;
    this.loadOrders();
  }

  // Pagination methods
  updatePagination() {
    this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.orders.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  confirmOrder(orderId: number) {
    this.confirmingOrder[orderId] = true;
    this.orderService.confirmOrder(orderId).subscribe({
      next: (updatedOrder) => {
        // Update the order in the local array
        const index = this.orders.findIndex(order => order.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        this.confirmingOrder[orderId] = false;
        this.loadOrders(); // Reload orders after successful confirmation
      },
      error: (err) => {
        this.error = 'Failed to confirm order. Please try again later.';
        this.confirmingOrder[orderId] = false;
        console.error('Error confirming order:', err);
      }
    });
  }

  updateStatus(orderId: number, status: string) {
    this.updatingStatus[orderId] = true;
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(order => order.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        this.updatingStatus[orderId] = false;
        this.loadOrders(); // Reload orders after successful status update
      },
      error: (err) => {
        this.error = 'Failed to update order status. Please try again later.';
        this.updatingStatus[orderId] = false;
        console.error('Error updating status:', err);
      }
    });
  }
}
