import { JobDetail } from './../../Model/project.Model';
import { AdminProject } from './../../Services/admin/projects';
import { CommonModule } from '@angular/common';
import { Component, CSP_NONCE, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectEditComponent } from "../project-edit/project-edit.component";

@Component({
  selector: 'app-project-manage',
  imports: [CommonModule, FormsModule, ProjectEditComponent],
  templateUrl: './project-manage.component.html',
  styleUrl: './project-manage.component.css'
})
export class ProjectManageComponent implements OnInit {
  selectedJob: any;
  jobList: any;
  editing: boolean = false;
  token: string = "";
  companyId: string = "";
  userId: string = ""
  status: { statusName: string; statusId: number }[] = [{ statusName: 'pending', statusId: 1009 }, { statusName: 'Completed', statusId: 1008 }, { statusName: 'In Progress', statusId: 1012 }];
  selectedStatus: number = 1009;
  constructor(
    private AdminProject: AdminProject
  ) { }
  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {

      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';

      this.token = token;
      this.companyId = companyID;
      this.userId = userid;
      this.onUserTypeChange(1009);

    }
  }
  onUserTypeChange(status: number) {
    this.jobList = 'changing'
    this.selectedStatus = status;
    this.AdminProject.GetJob(this.token, this.companyId, -1, status, -1, -1)
      .subscribe({
        next: (data) => {
          console.log('Dashboard data:', data);
          this.jobList = data.Result;
          console.log(this.jobList)
        },
        error: (err) => {
          console.error('Error fetching dashboard data:', err);
        }
      });
  }

  toggleActive(job: any, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    job.isActive = checkbox.checked ? 1 : 0;
    const token = localStorage.getItem('Token') || '';
    this.AdminProject.UpdateJobStatus(token, this.userId, job.isActive, job.JobID).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        alert(response.Message)

      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });

  }
  onStatusSelect(status: number, jobId: number) {
    console.log(jobId)
    this.AdminProject.UpdateJobWorkStatus(this.token, this.userId, status, jobId).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        alert(response.Message)
        this.onUserTypeChange(this.selectedStatus);

      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }
  doc(user: any) {
    alert("Error! Doc cant be shown at this moment.")
  }
  editJob(job: any) {
    this.selectedJob = job;
    console.log(this.selectedJob)
    this.editing = true;
  }
  cancelEdit() {
    this.editing = false;
  }
  deleteJob(job: any) {
    this.AdminProject.DeleteJob(this.token, this.userId, job.JobID)
      .subscribe({
        next: (res) => {
          alert(res.Message)
          this.onUserTypeChange(this.selectedStatus);
        },
        error: (err) => {
          alert("Try Again")
        }
      })
  }
  saveJob(updatedJob: any) {
    console.log(updatedJob)
    this.AdminProject.UpdateJob(this.token, {
      JobID: updatedJob.JobID,
      JobName: updatedJob.JobName,
      JobAddress: updatedJob.JobAddress,
      JobCity: updatedJob.JobCity,
      JobPostalCode: updatedJob.JobPostalCode,
      ProjectStartingDate: updatedJob.ProjectStartingDate,
      ProjectEndingDate: updatedJob.ProjectEndingDate,
      ProjectDateRange: updatedJob.ProjectDateRange,
      WorkingDays: 'Mon-Fri',
      CompanyName: updatedJob.CompanyName,
      CompanyEmail: updatedJob.CompanyEmail,
      CompanyContact: updatedJob.CompanyContact,
      isActive: updatedJob.isActive,
      ManagerID: updatedJob.ManagerID,
      ManagerName: updatedJob.ManagerName,
      ContactNo: updatedJob.ContactNo,
      EmailID: updatedJob.EmailID,
      CompanyID: updatedJob.CompanyID,
      CreatedName: updatedJob.CreatedName,
      UserID: updatedJob.UserID,
      CreatedOn: updatedJob.CreatedOn,
      StatusID: updatedJob.StatusID,
      StatusName: updatedJob.StatusName
    })
      .subscribe({
        next: (res) => {
          alert(res.Message)
          console.log(res)
          this.editing = false
        },
        error: (err) => {
          console.log(err)
        }
      })
  }


}
