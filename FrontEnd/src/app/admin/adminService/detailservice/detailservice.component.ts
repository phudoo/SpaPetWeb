import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Service } from '../../../services/services.service';
@Component({
  selector: 'app-detailservice',
  standalone: false,
  templateUrl: './detailservice.component.html',
  styleUrl: './detailservice.component.css',
})
export class DetailserviceComponent {
  detail: any;

  constructor(private detailService: Service, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.detailService.getServiceById(id).subscribe((data) => {
      this.detail = data;
    });
  }
}
