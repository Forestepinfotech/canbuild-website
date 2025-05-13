import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SupervisorleftbarComponent } from '../supervisorleftbar/supervisorleftbar.component';
import { SupervisorrightbarComponent } from '../supervisorrightbar/supervisorrightbar.component';

@Component({
  selector: 'app-supervisor',
  imports: [RouterOutlet,SupervisorleftbarComponent,SupervisorrightbarComponent],
  templateUrl: './supervisor.component.html',
  standalone:true,
})
export class SupervisorComponent {
  isLoading = false;
  router = inject(Router);
  constructor() {}
  Logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('CompanyID');
    localStorage.removeItem('UserID');
    localStorage.removeItem('UserType');
    this.router.navigate(['/login']);
  }
}
