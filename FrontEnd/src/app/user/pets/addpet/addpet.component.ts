import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pets } from '../../../services/pet.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addpet',
  templateUrl: './addpet.component.html',
  styleUrl: './addpet.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AddpetComponent {
  petForm: FormGroup;
  selectedFile: File | null = null;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private petService: Pets,
    private router: Router
  ) {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      birthday: ['', Validators.required],
      sex: ['', Validators.required],
      image: [null, Validators.required],
    });
  }

onFileChange(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    this.selectedFile = event.target.files[0];
    this.petForm.patchValue({ image: this.selectedFile }); // cập nhật giá trị cho control image
    this.petForm.get('image')?.updateValueAndValidity();   // cập nhật trạng thái hợp lệ
  }
}

  onSubmit() {
  if (this.petForm.invalid || !this.selectedFile) {
    this.message = 'Vui lòng nhập đầy đủ thông tin!';
    return;
  }
  const petData = {
    name: this.petForm.value.name,
    species: this.petForm.value.species,
    breed: this.petForm.value.breed,
    birthday: this.petForm.value.birthday,
    sex: this.petForm.value.sex,
  };
  console.log('petData:', petData);
  console.log('selectedFile:', this.selectedFile);

  this.petService.addPet(petData, this.selectedFile).subscribe({
    next: (res) => {
      console.log('API response:', res);
      this.message = 'Thêm pet thành công!';
      this.router.navigate(['/pets']);
    },
    error: (err) => {
      console.error('API error:', err);
      this.message = 'Có lỗi xảy ra!';
    },
  });
}
}
