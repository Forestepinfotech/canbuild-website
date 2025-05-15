import { Component, Inject, OnInit } from '@angular/core';
import { AdminUser } from '../../Services/admin/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-user-manage',
  imports: [CommonModule, FormsModule, UserEditComponent],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.css'
})
export class UserManageComponent implements OnInit {

  userList: any;
  userTypes: { UserTypeID: number; UserType: string }[] = [];
  selectedUserTypeID!: number;
  selectedUser: any = {};
  editing: boolean = false;
  token: string = "";
  companyId: string = "";
  userId: string = "";
  constructor(
    private AdminUser: AdminUser,
  ) { }
  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {

      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';
      this.AdminUser.GetUserTypes(token, '-1')
        .subscribe({
          next: (data) => {
            console.log('Dashboard data:', data);
            this.userTypes = data.Result;
            this.selectedUserTypeID = this.userTypes[1].UserTypeID;
            console.log(this.selectedUserTypeID)
            this.onUserTypeChange(this.selectedUserTypeID);
          },
          error: (err) => {
            console.error('Error fetching dashboard data:', err);
          }
        });
      this.token = token;
      this.companyId = companyID;
      this.userId = userid;




    }

  }
  onUserTypeChange(userTypeId: number) {
    console.log('changes')
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
        this.userList = response.Result;
        console.log("Updated", this.userList)
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
      EmailID: updatedUser.Email,
      UserTypeID: updatedUser.UserTypeID,
    }).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        this.onUserTypeChange(updatedUser.UserTypeID);

      },
      error: (err) => {
        console.error('Error updating user:', err);
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
    this.AdminUser.UpdateUserStatus(token, user.UserID, user.isActive).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        alert(response.Message)

      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });

  }
  doc(user: any) {
    alert("Error! Doc cant be shown at this moment.")
  }
  onDelete(user: any) {
    this.AdminUser.Deleteuser(this.token, user.UserID, this.userId).subscribe({
      next: (res) => {
        console.log('User Deleted');
        alert('User deleted Succesfully');
        this.onUserTypeChange(user.UserTypeID);
      },
      error: (err) => {
        console.log(err);
        alert('User Was NOT deleted, Please Try Again')
      }
    })
  }
}
