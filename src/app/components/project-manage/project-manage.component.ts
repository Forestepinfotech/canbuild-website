import { JobNameFilterPipe } from './jobfilter.pipe';
import { AdminProject } from './../../Services/admin/projects';
import { CommonModule } from '@angular/common';
import { Component, CSP_NONCE, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectEditComponent } from "../project-edit/project-edit.component";
import { ProjectDocumentsComponent } from "../project-documents/project-documents.component";
import { ToastrService } from 'ngx-toastr';
import { response } from 'express';

@Component({
  selector: 'app-project-manage',
  imports: [CommonModule, FormsModule, ProjectEditComponent, ProjectDocumentsComponent, JobNameFilterPipe],
  templateUrl: './project-manage.component.html',
  styleUrl: './project-manage.component.css'
})
export class ProjectManageComponent implements OnInit {
  jobSearch: string = '';

  selectedJob: any;
  jobList: any;
  editing: boolean = false;
  docs: boolean = false;
  token: string = "";
  companyId: string = "";
  userId: string = ""
  status: { statusName: string; statusId: number }[] = [{ statusName: 'pending', statusId: 1009 }, { statusName: 'Completed', statusId: 1008 }, { statusName: 'In Progress', statusId: 1012 }];
  selectedStatus: number = 1009;
  constructor(
    private AdminProject: AdminProject,
    private toastr: ToastrService
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
      .subscribe((response) => {
        if (response.Status) {
          this.jobList = response.Result;

        } else {
          this.toastr.error('Error ', response.Message)
          this.jobList = 'error'
        }
      });
  }

  toggleActive(job: any, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    job.isActive = checkbox.checked ? 1 : 0;
    const token = localStorage.getItem('Token') || '';
    this.AdminProject.UpdateJobStatus(token, this.userId, job.isActive, job.JobID).subscribe((response) => {
      if (response.Status) {
        this.toastr.success('Project Updated Successfully')
      }
      else {
        this.toastr.error('Error ', response.Message)
      }
    });

  }
  onStatusSelect(status: number, jobId: number) {
    this.AdminProject.UpdateJobWorkStatus(this.token, this.userId, status, jobId).subscribe((response) => {
      if (response.Status) {
        this.toastr.success('Project Status Updated Successfully')
        this.onUserTypeChange(this.selectedStatus);
      } else {
        this.toastr.error('Error ', response.Message)
      }
    });
  }
  doc(user: any) {
    this.selectedJob = user;
    this.editing = false; // <-- add this
    this.docs = true;
  }

  editJob(job: any) {
    this.selectedJob = job;
    this.docs = false; // <-- add this
    this.editing = true;
  }
  cancelEdit() {
    this.editing = false;
    this.docs = false;
  }

  deleteJob(job: any) {
    if (!confirm(`Are you sure you want to delete project: ${job.JobName}?`)) {
      return;
    }
    this.AdminProject.DeleteJob(this.token, this.userId, job.JobID)
      .subscribe((response) => {
        if (response.Status) {
          this.toastr.success('Project Deleted Successfully')
          this.onUserTypeChange(this.selectedStatus);
        }
        else {
          this.toastr.error('Error ', response.Message)
        }
      })
  }
  saveJob(updatedJob: any) {
    console.log(updatedJob)
    console.log(updatedJob.ProjectEndingDate)
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
      UserID: Number(this.userId),
      CreatedOn: updatedJob.CreatedOn,
      StatusID: updatedJob.StatusID,
      StatusName: updatedJob.StatusName
    })
      .subscribe((res) => {
        if (res.Status) {
          this.toastr.success('Successfully Updated the Project')

          this.editing = false
          this.onUserTypeChange(1009);
        }
        else {
          this.toastr.error('Error ', res.Message)
        }
      })
  }


}
