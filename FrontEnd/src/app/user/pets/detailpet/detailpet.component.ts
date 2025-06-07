import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pets } from '../../../services/pet.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detailpet',
  standalone: false,
  templateUrl: './detailpet.component.html',
  styleUrl: './detailpet.component.css'
})
export class DetailpetComponent implements OnInit, OnDestroy {
  pet: any;
  imageUrl: SafeUrl | null = null;
  private objectURL: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private petService: Pets,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.petService.getPetById(id).subscribe(data => {
      this.pet = data;
      this.loadPetImage(id);
    });
  }

  ngOnDestroy(): void {
    if (this.objectURL) {
      URL.revokeObjectURL(this.objectURL);
    }
  }

  loadPetImage(petId: number): void {
    this.petService.getPetImage(petId).subscribe({
      next: (imageBlob) => {
        if (this.objectURL) {
          URL.revokeObjectURL(this.objectURL);
        }
        this.objectURL = URL.createObjectURL(imageBlob);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectURL);
      },
      error: (err) => {
        console.error('Error loading pet image:', err);
        this.imageUrl = null;
      }
    });
  }
}