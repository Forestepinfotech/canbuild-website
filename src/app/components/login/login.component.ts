import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule],
})
export class LoginComponent implements OnInit {
  loginObj: any = {
    username: '',
    passkey: '',
  };
  _loader: boolean = false;
  router = inject(Router);
  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('Token');
      const type = localStorage.getItem('UserType');
      if (token) {
        if (type == 'Manager') {
          this.router.navigate(['admin/dashboard']);
        } else if (type == 'Customer') {
          this.router.navigate(['user/dashboard']);
        } else if (type == 'Supervisor') {
          console.log('Supervisor')
          this.router.navigate(['supervisor/dashboard']);
        }
      }
    }
  }
  onSubmit() {
    if (this.loginObj.username != null && this.loginObj.passkey != null) {
      this.authService.Login(this.loginObj).subscribe((response) => {
        if (response.Status) {
          localStorage.setItem('Token', response.Result[0].Token);
          localStorage.setItem('CompanyID', response.Result[0].CompanyID);
          localStorage.setItem('UserID', response.Result[0].UserID);
          localStorage.setItem('UserType', response.Result[0].UserType);
if (response.Result[0].UserType == 'Manager') {
  this.toastr.success('Success', 'Admin Login Successfully!');
  this.router.navigate(['admin/dashboard']).then(() => {
    window.location.reload();
  });
} else if (response.Result[0].UserType == 'Customer') {
  this.toastr.success('Success', 'User Login Successfully!');
  this.router.navigate(['user/dashboard']).then(() => {
    window.location.reload();
  });
} else if (response.Result[0].UserType == 'Supervisor') {
  this.toastr.success('Success', 'User Login Successfully!');
  this.router.navigate(['supervisor/dashboard']).then(() => {
    window.location.reload();
  });
}

        } else {
          this.toastr.error('Error', 'Email or Pass Key Invalid');
        }
      });
    } else {
      this.toastr.error('Error', 'Something wrong');
    }
  }
}