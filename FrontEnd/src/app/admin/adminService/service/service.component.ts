import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Service } from '../../../services/services.service';
@Component({
  selector: 'app-service',
  standalone: false,
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent implements OnInit {
  services: any[] = [];

  constructor(private adminService: Service) {}
  //day 2
  ngOnInit(): void {
    this.adminService.getAllService('', '', '').subscribe((data) => {
      this.services = data;
    });
  }
  //day 4
  deleteService(id: number) {
    this.adminService.deleteService(id).subscribe(() => {
      this.services = this.services.filter((service) => service.id !== id);
    });
  }
}
