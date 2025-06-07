import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService, Contact } from '../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  success = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = false;

    if (this.contactForm.valid) {
      const contact: Contact = this.contactForm.value;
      this.contactService.createContact(contact).subscribe({
        next: (response) => {
          this.success = true;
          this.contactForm.reset();
          this.submitted = false;
        },
        error: (err) => {
          this.error = 'Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại sau.';
        }
      });
    }
  }
}
