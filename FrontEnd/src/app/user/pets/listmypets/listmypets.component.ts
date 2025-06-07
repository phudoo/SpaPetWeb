import { Component, OnInit } from '@angular/core';
import { Pets } from '../../../services/pet.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-listmypets',
  standalone: false,
  templateUrl: './listmypets.component.html',
  styleUrl: './listmypets.component.css'
})
export class ListmypetsComponent implements OnInit {
  pets: any[] = [];

  constructor(private petService: Pets,  private sanitizer: DomSanitizer) {}
  //day 11
loadPetImage(pet: any): void {
  if (!pet.id) {
    console.warn('Pet does not have an ID:', pet);
    return;
  }

  this.petService.getPetImage(pet.id).subscribe({
    next: (imageBlob) => {
      const objectURL = URL.createObjectURL(imageBlob); // Tạo URL từ Blob
      console.log('Generated image URL:', objectURL); // Log URL được tạo
      pet.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL); // Sanitize URL
    },
    error: (err) => {
      console.error('Error loading image for pet ID:', pet.id, err);
      pet.imageUrl = 'assets/default-pet-image.png'; // Gán ảnh mặc định nếu không tìm thấy ảnh
    }
  });
}
ngOnInit(): void {
  this.petService.getAllMyPets('', '', '', '', '').subscribe({
    next: (data) => {
      this.pets = data;
      console.log('Fetched pets:', this.pets); // Log danh sách thú cưng
      this.pets.forEach((pet) => {
        if (pet.id) {
          this.loadPetImage(pet);
        }
      });
    },
    error: (err) => {
      console.error('Error fetching pets:', err);
    }
  });
}

  // day 7
deletemypet(id: number): void {
  if (confirm('Bạn có chắc chắn muốn xóa thú cưng này không?')) {
    this.petService.deletePet(id).subscribe({
      next: () => {
        this.pets = this.pets.filter((pet) => pet.id !== id);
        console.log(`Pet với ID ${id} đã được xóa.`);
      },
      error: (err) => {
        console.error(`Lỗi khi xóa Pet với ID ${id}:`, err);
      }
    });
  }
}
}
