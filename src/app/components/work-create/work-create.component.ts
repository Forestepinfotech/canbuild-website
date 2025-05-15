import { AdminWork } from './../../Services/admin/work';
import { AdminDashboard } from './../../Services/admin/dashboard';
import { AdminUser } from './../../Services/admin/User';
import { AdminProject } from './../../Services/admin/projects';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';
import { WorkModel } from '../../Model/Work.Model';

@Component({
  selector: 'app-work-create',
  imports: [CommonModule, FormsModule, FlatpickrDirective],
  providers: [provideFlatpickrDefaults()],
  templateUrl: './work-create.component.html',
  styleUrl: './work-create.component.css'
})
export class WorkCreateComponent implements OnInit {
  constructor(
    private AdminProject: AdminProject, private AdminUser: AdminUser, private AdminDashboard: AdminDashboard, private AdminWork: AdminWork
  ) {

  }
  token: string = "";
  companyId: string = "";
  userId: string = ""
  selectedProject: number = 0;
  projects: any;
  selectedUser: number = 0;
  users: any;
  workSubject: any;
  workNote: any;
  color: any;
  selectedColor: number = 0;
  priority: any;
  setPriority: number = 0;
  rangeValue: { from: Date; to: Date } = {
    from: new Date(),
    to: (new Date() as any)['fp_incr'](10),
  };
  isRadius: boolean = false;
  radius: number = 0;
  formError: string = ''

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';
      this.token = token;
      this.companyId = companyID;
      this.userId = userid;

      this.AdminProject.GetJob(this.token, this.companyId, -1, -1, -1, -1)
        .subscribe({
          next: (data) => {
            console.log('Dashboard data:', data);
            this.projects = data.Result;
            console.log(this.projects)
          },
          error: (err) => {
            console.error('Error fetching dashboard data:', err);
          }
        });
      this.AdminUser.GetUsers(
        companyID,
        token,
        '-1',
        -1,
        504,
        1,
        100
      ).subscribe(response => {
        this.users = response.Result;
        console.log("useres", this.users)
      });

      this.AdminDashboard.GetColorNotes(companyID, token, '-1')
        .subscribe({
          next: (data) => {
            console.log('color:', data);
            this.color = data.Result;
          },
          error: (err) => {
            console.error('Error fetching dashboard data:', err);
          }
        });

      this.AdminWork.GetPriorityWork(token, -1)
        .subscribe({
          next: (res) => {
            console.log('priority work', res.Result)
            this.priority = res.Result;
          }
        })
    }
  }

  validateForm(): boolean {
    // Check required fields
    if (!this.workSubject || this.workSubject.trim() === '') {
      this.formError = 'Work name is required';
      return false;
    }

    if (!this.workNote || this.workNote.trim() === '') {
      this.formError = 'Work Note is required';
      return false;
    }

    if (!this.selectedProject || this.selectedProject === 0) {
      this.formError = 'Project selection is required';
      return false;
    }

    if (!this.selectedUser || this.selectedUser === 0) {
      this.formError = 'User selection is required';
      return false;
    }

    if (!this.selectedColor || this.selectedColor === 0) {
      this.formError = 'Color selection is required';
      return false;
    }

    if (!this.setPriority || this.setPriority === 0) {
      this.formError = 'Priority selection is required';
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
  createWork() {
    if (!this.validateForm()) {
      return; // validateForm sets the error message
    }
    console.log(this.selectedColor)
    const selectedColorDetail = this.color.find(
      (i: any) => i.ColorID == this.selectedColor
    );
    const selectedPriorirtyDetail = this.priority.find(
      (i: any) => i.PriorityID == this.setPriority
    );
    const formatTime = (date: Date) =>
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const selectedJobDetail = this.projects.find(
      (i: any) => i.JobID == this.selectedProject
    );
    const selectedUserDetail = this.users.find(
      (i: any) => i.UserID == this.selectedUser
    );


    const payload: WorkModel = {
      WorkSubject: this.workSubject,
      WorkDetail: this.workNote,
      isHourly: false,
      StartTime: formatTime(this.rangeValue.from),
      EndTime: formatTime(this.rangeValue.to),
      WorkTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isRadius: this.isRadius,
      Radius: this.radius.toString(),

      ColorID: this.selectedColor,
      ColorName: selectedColorDetail.ColorName,
      Color_Hex: selectedColorDetail.Color_Hex,

      PriorityID: this.setPriority,
      PriorityName: selectedPriorirtyDetail.PriorityName,
      PriorityLevel: selectedPriorirtyDetail.PriorityLevel,

      UserID: selectedUserDetail.UserID,
      UserName: selectedUserDetail.UserName,
      UserType: selectedUserDetail.UserType,
      UserTypeID: selectedUserDetail.UserTypeID,

      CompanyID: Number(this.companyId),
      CompanyName: '',

      StartDate: new Date(this.rangeValue.from).toLocaleDateString(),
      EndDate: new Date(this.rangeValue.to).toLocaleDateString(),
      CreatedBy: Number(this.userId),

      StatusID: selectedJobDetail.StatusID,
      StatusName: selectedJobDetail.StatusName,
      ProjectStartingDate: selectedJobDetail.ProjectStartingDate,
      ProjectEndingDate: selectedJobDetail.ProjectEndingDate,
      JobID: this.selectedProject,
      JobName: selectedJobDetail.JobName,
      JobAddress: selectedJobDetail.JobAddress,
      isActive: selectedJobDetail.isActive,
      WorkingDays: selectedJobDetail.WorkingDays,
      ProjectDateRange: selectedJobDetail.ProjectDateRange,
      ColorDetail: selectedColorDetail.ColorDetail,
    }
    console.log(payload)
    this.AdminWork.CreateWork(this.token, payload).subscribe({
      next: (res) => {
        console.log(res)
        alert("Work Created Successfully")
        location.reload()
      },
      error: (err) => {
        console.log(err)
        alert("Work NOT Created Successfully, Please try again")
      }
    })


  }
}
