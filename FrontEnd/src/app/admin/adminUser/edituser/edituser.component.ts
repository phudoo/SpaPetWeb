import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../services/user.service';

@Component({
  selector: 'app-edituser',
  standalone: false,
  templateUrl: './edituser.component.html',
  styleUrl: './edituser.component.css',
})
export class EdituserComponent {
  user: any;

  constructor(private userService: User, private route: ActivatedRoute) {}
  // day 4
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getUserById(id).subscribe((data) => {
      this.user = data;
    });
  }
  // day 4
  onSubmit(): void {
    this.userService.updateUser(this.user.id, this.user).subscribe((res) => {
      alert('Cập nhật thành công!');
    });
  }
}
