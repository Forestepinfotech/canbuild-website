import { Component, inject, Inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LeftsidebarComponent } from "../leftsidebar/leftsidebar.component";
import { RightsidebarComponent } from "../rightsidebar/rightsidebar.component";



@Component({
  standalone: true,

  templateUrl: './admin.component.html',
  imports: [RouterOutlet, LeftsidebarComponent, RightsidebarComponent],
})
export class AdminComponent {
  isLoading = false;
  router = inject(Router)
  constructor() { }

  LogoutAdmin() {

    localStorage.removeItem('Token');
    localStorage.removeItem('CompanyID');
    localStorage.removeItem('UserID');
    localStorage.removeItem('UserType');
    this.router.navigate(['/login']);
  }
}
