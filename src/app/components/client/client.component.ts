import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserleftsidebarComponent } from "../userleftsidebar/userleftsidebar.component";
import { UserrightbarComponent } from "../userrightbar/userrightbar.component";

@Component({
  selector: 'app-client',
  imports: [RouterOutlet, UserleftsidebarComponent, UserrightbarComponent],
  templateUrl: './client.component.html',
  standalone: true,
})
export class ClientComponent {
  isLoading = false;
  router=inject(Router)
  constructor() {}

  LogoutAdmin() {
    localStorage.removeItem('Token');
    localStorage.removeItem('CompanyID');
    localStorage.removeItem('UserID');
    localStorage.removeItem('UserType');
    this.router.navigate(['/login']);
  }
}
