import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pets } from '../../../services/pet.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-editpet',
  standalone: false,
  templateUrl: './editpet.component.html',
  styleUrl: './editpet.component.css'
})
export class EditpetComponent implements OnInit {
  petForm!: FormGroup;
  petId!: number;
  imageFile?: File;
  currentImageUrl: SafeUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private petService: Pets,
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.petId = Number(this.route.snapshot.paramMap.get('id'));
    this.petForm = this.fb.group({
      name: [''],
      species: [''],
      breed: [''],
      birthday: [''],
      sex: ['']
    });

    this.petService.getPetById(this.petId).subscribe(data => {
      if (data.birthday) {
        const date = new Date(data.birthday);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        data.birthday = `${yyyy}-${mm}-${dd}`;
      }
      this.petForm.patchValue(data);
      this.loadPetImage();
    }, err => {
      console.error('Lỗi lấy dữ liệu thú cưng:', err);
    });
  }

  loadPetImage(): void {
    this.petService.getPetImage(this.petId).subscribe({
      next: (imageBlob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.currentImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (err) => {
        console.error('Error loading pet image:', err);
        this.currentImageUrl = null;
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      // Hiển thị preview ảnh mới
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentImageUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.petForm.valid) {
      this.petService.updatePet(this.petId, this.petForm.value, this.imageFile).subscribe({
        next: () => {
          this.router.navigate(['/listmypets']);
        },
        error: (err) => {
          console.error('Error updating pet:', err);
        }
      });
    }
  }
}