import { Component, OnInit } from '@angular/core';
import { User } from '../../../services/user.service';

@Component({
  selector: 'app-home-admin',
  standalone: false,
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css',
})
export class HomeAdminComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: User) {}
  //day 2
  ngOnInit(): void {
    this.userService.getAllUser('', '', '', '', '', '', 2).subscribe((data) => {
      this.users = data;
    });
  }
  //day 4
  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter((user) => user.id !== id);
    });
  }
}
