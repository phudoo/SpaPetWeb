import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactService, Contact } from '../../services/contact.service';

@Component({
  selector: 'app-allcontact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './allcontact.component.html',
  styleUrl: './allcontact.component.css'
})
export class AllcontactComponent implements OnInit {
  contacts: Contact[] = [];
  loading = true;
  error = '';
  statusOptions = ['PENDING', 'READ'];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.loading = true;
    this.contactService.getAllContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Có lỗi xảy ra khi tải danh sách liên hệ.';
        this.loading = false;
      }
    });
  }

  onStatusChange(contactId: number | undefined, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;
    this.updateStatus(contactId, newStatus);
  }

  updateStatus(contactId: number | undefined, newStatus: string): void {
    if (!contactId) return;
    
    this.contactService.updateContactStatus(contactId, newStatus).subscribe({
      next: (updatedContact) => {
        const index = this.contacts.findIndex(c => c.id === contactId);
        if (index !== -1) {
          this.contacts[index] = updatedContact;
        }
      },
      error: (err) => {
        this.error = 'Có lỗi xảy ra khi cập nhật trạng thái.';
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'READ':
        return 'status-read';
      default:
        return '';
    }
  }
}
