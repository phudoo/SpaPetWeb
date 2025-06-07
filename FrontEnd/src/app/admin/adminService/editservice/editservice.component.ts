import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Service } from '../../../services/services.service';
@Component({
  selector: 'app-editservice',
  standalone: false,
  templateUrl: './editservice.component.html',
  styleUrl: './editservice.component.css',
})
export class EditserviceComponent {
  service: any;

  constructor(private Service: Service, private route: ActivatedRoute) {}
  // day 4
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.Service.getServiceById(id).subscribe((data) => {
      this.service = data;
    });
  }
  // day 4
  onSubmit(): void {
    this.Service.updateService(this.service.id, this.service).subscribe(
      (res) => {
        alert('Cập nhật thành công!');
      }
    );
  }
}
