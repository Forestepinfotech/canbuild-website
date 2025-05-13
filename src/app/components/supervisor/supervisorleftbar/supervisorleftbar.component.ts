import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supervisorleftbar',
  imports: [FormsModule, CommonModule],
  templateUrl: './supervisorleftbar.component.html',

})
export class SupervisorleftbarComponent implements OnInit {
UserName:string='';

constructor(private authService: AuthService,
    private toastr: ToastrService)
{}

ngOnInit() {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') 
    {
      const token = localStorage.getItem('Token');
      const userid = localStorage.getItem('UserID'); 
    if(userid!=null || token!=null)
    {
      this.authService.GetUserByID(userid??'-1', token??'-1').subscribe((response) => {
        if (response.Status) {
         
          this.UserName=response.Result[0].UserName+' '+response.Result[0].UserFullName;
        }
      });
    }
  }
}}
