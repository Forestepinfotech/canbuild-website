import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AdminProject } from './../../Services/admin/projects';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AdminDocsWorkComponent } from "../admin-docs-work/admin-docs-work.component";
@Component({
  selector: 'app-admin-docs',
  imports: [CommonModule, FormsModule, AdminDocsWorkComponent],
  templateUrl: './admin-docs.component.html',
  styleUrl: './admin-docs.component.css'
})
export class AdminDocsComponent implements OnInit {

  jobList: any;
  working: boolean = false;
  docs: boolean = false;
  selectedJob: any;

  token: string = "";
  companyId: string = "";
  userId: string = ""

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
      this.jobList = 'changing'
      this.AdminProject.GetJob(this.token, this.companyId, -1, -1, -1, -1)
        .subscribe((response) => {
          if (response.Status) {
            this.jobList = response.Result;

          } else {
            this.toastr.error('Error ', response.Message)
          }
        });

    }
  }
  noJobClick(job: any) {
    console.log(job)
    this.selectedJob = job
    this.working = true
  }

  goBackWork() {
    this.working = false
  }
}