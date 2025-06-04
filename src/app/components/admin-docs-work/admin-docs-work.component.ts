import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AdminJobDocs } from '../../Services/admin/jobdocs';
import { AdminUser } from '../../Services/admin/User';
import { ToastService } from '../../Services/toast.service';
import { AdminWork } from '../../Services/admin/work';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkDocumentsComponentOnInit } from "../work-documents/work-documents.component";
import { ProjectDocumentsComponent } from "../project-documents/project-documents.component";

@Component({
  selector: 'app-admin-docs-work',
  imports: [CommonModule, FormsModule, WorkDocumentsComponentOnInit, ProjectDocumentsComponent],
  templateUrl: './admin-docs-work.component.html',
  styleUrl: './admin-docs-work.component.css'
})
export class AdminDocsWorkComponent implements OnInit {





  private adminJob: AdminJobDocs = inject(AdminJobDocs);
  private adminwork: AdminWork = inject(AdminWork)
  private toaster: ToastService = inject(ToastService)

  token: string = "";
  companyId: string = "";
  userId: string = ""

  workList: any;
  selectedWorkId: number | null = null;

  workDoc: boolean = false;
  jobDoc: boolean = false;

  selectedWork: any;

  @Input() job: any = {};
  @Output() cancel = new EventEmitter<void>();
  ngOnInit(): void {
    const companyID = localStorage.getItem('CompanyID') || '';
    const token = localStorage.getItem('Token') || '';
    const userid = localStorage.getItem('UserID') || ' ';

    this.token = token;
    this.companyId = companyID;
    this.userId = userid;

    this.adminwork.GetWork(token, this.companyId, -1, -1, this.job.JobID,)
      .subscribe({
        next: (res) => {
          if (res.Status) {
            this.workList = res.Result
          } else {
            this.toaster.error('Error ', res.Message)
          }
        },
        error: (err) => {
          this.toaster.error('Error ' + err)
        }
      })
  }

  noWorkClick(work: any) {
    this.selectedWork = work;
    this.selectedWorkId = work.WorkID;
  }

  viewJobDetails(work: any) {
    console.log('Viewing job details for:', this.job);
    this.jobDoc = true
    this.workDoc = false
  }

  assignWork(work: any) {
    console.log('Assigning work for:', work);
    this.workDoc = true;
    this.jobDoc = false
    console.log(this.workDoc)
  }

  onCancel() {
    this.workDoc = false;
    this.jobDoc = false;
  }
  onCancelWork() {
    this.cancel.emit();
  }
}
