import { response } from 'express';
import { AdminUser } from './../../Services/admin/User';
import { AdminColor } from './../../Services/admin/color';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leftsidebar',
  imports: [],
  templateUrl: './leftsidebar.component.html',
  styleUrl: './leftsidebar.component.css'
})
export class LeftsidebarComponent implements OnInit {
  userName: any;
  userType: any;
  constructor(private AdminUser: AdminUser) { }
  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';
      const userType = localStorage.getItem('UserType') || '';
      const userTypeId = Number(userType) || 0;
      this.AdminUser.GetUsersById(token, userid).subscribe((response) => {
        if (response.Status) {
          console.log(response)
          this.userName = response.Result[0].UserName + ' ' + response.Result[0].UserFullName
          this.userType = response.Result[0].UserType
        }
      })
    }
  }


}
