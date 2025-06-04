
import { Component, Inject, OnInit } from '@angular/core';
import { AdminUser } from '../../Services/admin/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserNameFilterPipe } from './userfilter.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-manage',
  imports: [CommonModule, FormsModule, UserEditComponent, UserNameFilterPipe],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.css'
})
export class UserManageComponent implements OnInit {
  userSearch: string = ''
  userList: any;
  userTypes: { UserTypeID: number; UserType: string }[] = [];
  selectedUserTypeID!: number;
  selectedUser: any = {};
  editing: boolean = false;
  token: string = "";
  companyId: string = "";
  userId: string = "";
  ErrorMessage: any = '';
  constructor(
    private AdminUser: AdminUser,
    private toastr: ToastrService
  ) { }
  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      console.log('ToastrService', this.toastr);
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';
      this.AdminUser.GetUserTypes(token, '-1')
        .subscribe((response) => {
          if (response.Status) {
            this.userTypes = response.Result;
            this.selectedUserTypeID = this.userTypes[1].UserTypeID;

            this.onUserTypeChange(this.selectedUserTypeID);
          }
          else {
            this.toastr.error('Error ', response.Message)

          }

        });
      this.token = token;
      this.companyId = companyID;
      this.userId = userid;




    }

  }
  onUserTypeChange(userTypeId: number) {

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.userList = "changing";
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';

      this.AdminUser.GetUsers(
        companyID,
        token,
        '-1',
        -1,
        userTypeId,
        1,
        100
      ).subscribe(response => {
        if (response.Status) {
          this.userList = response.Result;
        } else {
          this.toastr.error('Error ', response.Message)
          this.ErrorMessage = response.Message
          this.userList = "error";
        }


      });
    }
  }

  editUser(user: any) {
    this.selectedUser = { ...user };
    this.editing = true;
  }

  saveUser(updatedUser: any) {
    console.log('User saved:', updatedUser);
    this.editing = false;
    const token = localStorage.getItem('Token') || '';
    this.AdminUser.UpdateUser(token, {
      UserID: updatedUser.UserID,
      UserType: updatedUser.UserType,
      HashPassKey: updatedUser.HashPassKey,
      CreatedBy: updatedUser.CreatedBy,
      CreatedOn: updatedUser.CreatedOn,
      isActive: updatedUser.isActive,
      CompanyID: updatedUser.CompanyId,
      CompanyName: updatedUser.CompanyName,
      ContactNo: updatedUser.ContactNo,
      ProofTypeID: updatedUser.ProofTypeID,
      Proof: updatedUser.Proof,
      SecurityNumber: updatedUser.SecurityNumber,
      ProofType: updatedUser.ProofType,
      TradeID: updatedUser.TradeID,
      TradeType: updatedUser.TradeType,
      AddressType: updatedUser.AddressType,
      Address: updatedUser.Address,
      City: updatedUser.City,
      PostalCode: updatedUser.PostalCode,
      State: updatedUser.Province,
      Country: updatedUser.Country,
      UserName: updatedUser.UserName,
      UserFullName: updatedUser.UserFullName,
      UserImage: updatedUser.UserImage,
      EmailID: updatedUser.EmailID,
      UserTypeID: updatedUser.UserTypeID,
    }).subscribe((response) => {
      if (response.Status) {
        this.toastr.success('User Updated Successfully')
        this.onUserTypeChange(updatedUser.UserTypeID);
      } else {
        this.toastr.error('Error ', response.Message)
      }

    });
  }

  cancelEdit() {
    this.editing = false;
  }

  toggleActive(user: any, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    user.isActive = checkbox.checked ? 1 : 0;
    const token = localStorage.getItem('Token') || '';
    this.AdminUser.UpdateUserStatus(token, user.UserID, user.isActive).subscribe((response) => {
      if (response.Status) {
        this.toastr.success('User Updated Successfully')
      } else {
        this.toastr.error('Error ', response.Message)
      }

    });

  }
  doc(user: any) {
    this.toastr.error('Error ', 'Doc cant be shown at the moment')
  }
  onDelete(user: any) {
    if (!confirm(`Are you sure you want to delete user: ${user.UserName}?`)) {
      return;
    }
    this.AdminUser.Deleteuser(this.token, user.UserID, this.userId).subscribe((response) => {
      if (response.Status) {
        this.toastr.success("Deleted The User")
        this.onUserTypeChange(user.UserTypeID);
      }
      else {
        this.toastr.error('Error ', response.Message)
      }
    })
  }
}
