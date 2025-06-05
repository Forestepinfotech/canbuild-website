import { JobDetail } from './../../Model/project.Model';
import { CommonModule } from '@angular/common';
import { AdminUser } from './../../Services/admin/User';
import { AdminProject } from './../../Services/admin/projects';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { response } from 'express';
@Component({
  selector: 'app-project-create',
  imports: [CommonModule, FormsModule, FlatpickrDirective],
  providers: [provideFlatpickrDefaults()],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.css',
})
export class ProjectCreateComponent implements OnInit {
  constructor(
    private AdminProject: AdminProject,
    private AdminUser: AdminUser
    , private toastr: ToastrService
  ) { }
  token: string = "";
  companyId: string = "";
  userId: string = ""

  user: any;
  selectedUserID: number = 0;
  jobName: string = '';
  jobAddress: string = '';
  jobCity: string = '';
  jobPostalCode: string = '';
  rangeValue: { from: Date; to: Date } = {
    from: new Date(),
    to: (new Date() as any)['fp_incr'](10),
  };
  formError: string = "";
  ErrorMessage: string = '';

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';
      this.token = token;
      this.companyId = companyID;
      this.userId = userid;
      // ...existing code...
      this.AdminUser.GetUsers(companyID, token, '-1', 1, 507, 1, 100)
        .subscribe((response) => {
          if (response.Status) {
            console.log("here")
            this.user = response.Result
            console.log("USER IS " + this.user)
          } else {
            this.toastr.error('Error Getting Users')
            this.ErrorMessage = response.Message;
            this.user = "error";
          }
        },
          (error) => {
            this.toastr.error('Error Getting Users');
            this.ErrorMessage = error?.message || 'Unknown error';
          }
        );

      // ...existing code...
    }
  }

  validateForm(): boolean {
    // Reset error message
    this.formError = '';

    // Check required fields
    if (!this.jobName || this.jobName.trim() === '') {
      this.formError = 'Job name is required';
      return false;
    }

    if (!this.jobAddress || this.jobAddress.trim() === '') {
      this.formError = 'Job address is required';
      return false;
    }

    if (!this.jobCity || this.jobCity.trim() === '') {
      this.formError = 'Job city is required';
      return false;
    }

    // if (!this.jobPostalCode || this.jobPostalCode.trim() === '') {
    //   this.formError = 'Job postal code is required';
    //   return false;
    // }

    if (!this.selectedUserID || this.selectedUserID === 0) {
      this.formError = 'Manager selection is required';
      return false;
    }

    // Add postal code validation for Canadian format (A1A 1A1)
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (this.jobPostalCode != "" && !postalCodeRegex.test(this.jobPostalCode)) {
      this.formError = 'Please enter a valid Canadian postal code';
      return false;
    }

    // Check date range
    if (!this.rangeValue.from || !this.rangeValue.to) {
      this.formError = 'Project date range is required';
      return false;
    }

    if (this.rangeValue.from > this.rangeValue.to) {
      this.formError = 'End date must be after start date';
      return false;
    }

    // All validations passed
    return true;
  }

  resetForm() {
    this.jobName = '';
    this.jobAddress = '';
    this.jobCity = '';
    this.jobPostalCode = '';
    this.selectedUserID = 0;
    this.rangeValue = {
      from: new Date(),
      to: (new Date() as any)['fp_incr'](10),
    };
    this.formError = '';
  }
  createJob() {
    if (!this.validateForm()) {
      return;
    }

    console.log(this.user[0].UserID);
    console.log(this.selectedUserID);
    const selectedUser = this.user.find(
      (i: any) => i.UserID == this.selectedUserID
    );
    console.log(selectedUser)
    const payoad: JobDetail = {
      JobName: this.jobName,
      CompanyName: "Forestep",
      CompanyEmail: "company@example.com",
      CompanyContact: "1234567890",
      isActive: 1,
      ManagerID: selectedUser?.UserID || '',
      ManagerName: selectedUser?.UserName || '',
      ContactNo: selectedUser?.ContactNo || '',
      EmailID: selectedUser?.EmailID || '',
      CompanyID: Number(this.companyId),
      WorkingDays: "Mon-Fri",
      JobAddress: this.jobAddress,
      JobCity: this.jobCity,
      JobPostalCode: this.jobPostalCode || "",
      ProjectStartingDate: new Date(this.rangeValue.from).toISOString(),
      ProjectEndingDate: new Date(this.rangeValue.to).toISOString(),
      CreatedName: selectedUser.UserName + ' ' + selectedUser.UserFullName,
      UserID: Number(this.userId),
      CreatedOn: new Date().toISOString(),
      StatusID: 1,
      StatusName: "Pending",
      ProjectDateRange: `${this.rangeValue.from} - ${this.rangeValue.to}`
    };
    console.log(payoad)
    this.AdminProject.CreateJob(this.token, payoad)
      .subscribe((response) => {
        if (response.Status) {
          this.toastr.success('Project Created Successfully')
          this.resetForm();
        } else {
          this.toastr.error('Error ', response.Message)
        }
      })
  }

}
