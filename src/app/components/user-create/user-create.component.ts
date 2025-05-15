import { AdminUser } from './../../Services/admin/User';
import { AdminDashboard } from './../../Services/admin/dashboard';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserManageComponent } from '../user-manage/user-manage.component';

@Component({

  selector: 'app-user-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit {
  token: string = "";
  companyId: string = "";
  userId: string = ""
  submitted = false;
  userTypes: { UserTypeID: number; UserType: string }[] = [];
  employeeTypes: any;
  selectedUserTypeID: number = 0;
  selectedRole: string = '';
  gstOrWcb: string = '';
  firstName: string = '';
  lastName: string = '';
  phone: string = "";
  email: string = '';
  address: string = '';
  city: string = '';
  postalCode: string = '';
  province: string = '';
  selectedFile: File | null = null;
  formError: string = '';
  constructor(
    private AdminUser: AdminUser, private AdminDashboard: AdminDashboard) { }
  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {

      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';
      this.token = token;
      this.companyId = companyID;
      this.userId = userid;

      if (companyID != null || token != null) {
        this.AdminUser.GetUserTypes(token, '-1')
          .subscribe({
            next: (data) => {
              console.log('Dashboard data:', data);
              this.userTypes = data.Result;
              console.log(this.userTypes)
            },
            error: (err) => {
              console.error('Error fetching dashboard data:', err);
            }
          });

        this.AdminDashboard.GetColorNotes(companyID, token, '-1')
          .subscribe({
            next: (data) => {
              console.log(data)
              this.employeeTypes = data.Result;
            },
            error: (err) => {
              console.log(Error, err)
            }
          })
      }



    }
  }
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  uploadFiles(FileName: string) {
    if (this.selectedFile) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // remove data prefix

        const payload = {
          FileBytes: base64,
          FileName: FileName,
          FilePath: 'UserDoc'
        };

        this.AdminUser.UploadFile(this.token, payload).subscribe((response) => {
          if (response.Status) {
            console.log(response.Message)
          } else {
            alert("File was not uploaded successfully, pleae try again later")
            console.log(response.Message);
          }

        });

        if (this.selectedFile) {
          reader.readAsDataURL(this.selectedFile); // converts file to base64
        }
        location.reload();
      }
    }
  }
  validateForm(): boolean {
    // Reset error message
    this.formError = '';

    // Check required fields
    if (!this.firstName || this.firstName.trim() === '') {
      this.formError = 'First name is required';
      return false;
    }

    if (!this.lastName || this.lastName.trim() === '') {
      this.formError = 'Last name is required';
      return false;
    }

    if (!this.email || this.email.trim() === '') {
      this.formError = 'Email is required';
      return false;
    }

    if (!this.phone) {
      this.formError = 'Phone number is required';
      return false;
    }

    if (!this.selectedUserTypeID || this.selectedUserTypeID === 0) {
      this.formError = 'User type is required';
      return false;
    }

    if (this.selectedUserTypeID === 506 && (!this.selectedRole || this.selectedRole === '')) {
      this.formError = 'Role is required';
      return false;
    }

    if (!this.address || this.address.trim() === '') {
      this.formError = 'Address is required';
      return false;
    }

    if (!this.city || this.city.trim() === '') {
      this.formError = 'City is required';
      return false;
    }

    if (!this.postalCode || this.postalCode.trim() === '') {
      this.formError = 'Postal code is required';
      return false;
    }

    if (!this.province || this.province.trim() === '') {
      this.formError = 'Province is required';
      return false;
    }

    // if (!this.selectedFile) {
    //   this.formError = 'User image is required';
    //   return false;
    // }

    // Add email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.formError = 'Please enter a valid email address';
      return false;
    }

    // Add phone validation (simple check for now)
    // const phoneRegex = /^\d{10,15}$/;
    // if (!phoneRegex.test(this.phone.replace(/[^0-9]/g, ''))) {
    //   this.formError = 'Please enter a valid phone number';
    //   return false;
    // }

    // Add postal code validation for Canadian format (A1A 1A1)
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!postalCodeRegex.test(this.postalCode)) {
      this.formError = 'Please enter a valid Canadian postal code';
      return false;
    }

    // All validations passed
    return true;
  }
  onSubmit() {
    this.submitted = true;

    // // You can handle form submission logic here
    // if (userForm.invalid) {
    //   return;
    // }
    if (!this.validateForm()) {
      return; // validateForm sets the error message
    }
    // const fileName = this.selectedFile!.name;
    // const fileExtension = fileName.split('.').pop();
    // const userImage = 'Web' + this.firstName + '.' + fileExtension;
    // console.log(userImage);
    this.AdminUser.CreateUser(this.token, {
      UserName: this.firstName,
      UserFullName: this.lastName,
      UserType: this.userTypes.find((i) => i.UserTypeID === this.selectedUserTypeID)?.UserType || '',
      HashPassKey: "",
      EmailID: this.email,
      UserImage: "dummys",
      ContactNo: this.phone,
      CreatedBy: 0,
      CreatedOn: new Date().toISOString(),
      isActive: 1,
      CompanyID: Number(this.companyId),
      // get the company name
      CompanyName: "Milestone",
      UserTypeID: this.selectedUserTypeID,
      // prood ID
      ProofTypeID: 2331,
      Proof: "Not Available",
      SecurityNumber: "Not Available",
      ProofType: "GST No/WCB No.",
      TradeID: Number(this.selectedRole),
      TradeType: "GST No/WCB No.",
      // address type
      AddressType: 1,
      Address: this.address,
      City: this.city,
      PostalCode: this.postalCode,
      State: this.province,
      Country: "CA"

    }).subscribe({
      next: (res: any) => {
        console.log('User created:', res)
        alert("User Created!")
        location.reload()
        // this.uploadFiles(userImage)

      },
      error: (err: any) => alert('Error:' + err)
    });
  }


}
