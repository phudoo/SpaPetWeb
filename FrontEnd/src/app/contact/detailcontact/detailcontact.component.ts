import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService, Contact } from '../../services/contact.service';

@Component({
  selector: 'app-detailcontact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detailcontact.component.html',
  styleUrl: './detailcontact.component.css'
})
export class DetailcontactComponent implements OnInit {
  contact: Contact | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadContactDetails(Number(id));
    } else {
      this.router.navigate(['/contacts']);
    }
  }

  loadContactDetails(id: number): void {
    this.loading = true;
    this.contactService.getContactById(id).subscribe({
      next: (data) => {
        this.contact = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Có lỗi xảy ra khi tải thông tin liên hệ.';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'PROCESSING':
        return 'status-processing';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return '';
    }
  }
}
