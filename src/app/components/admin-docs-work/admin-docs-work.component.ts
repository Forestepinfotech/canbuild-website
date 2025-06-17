import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AdminJobDocs } from '../../Services/admin/jobdocs';
import { AdminUser } from '../../Services/admin/User';
import { ToastService } from '../../Services/toast.service';
import { AdminWork } from '../../Services/admin/work';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkDocumentsComponentOnInit } from "../work-documents/work-documents.component";
import { ProjectDocumentsComponent } from "../project-documents/project-documents.component";
import { AdminDocsFilesComponent } from "../admin-docs-files/admin-docs-files.component";
import { AdminDocsFilsJobComponent } from "../admin-docs-fils-job/admin-docs-fils-job.component";

@Component({
  selector: 'app-admin-docs-work',
  imports: [CommonModule, FormsModule, AdminDocsFilesComponent, AdminDocsFilsJobComponent],
  templateUrl: './admin-docs-work.component.html',
  styleUrl: './admin-docs-work.component.css'
})
export class AdminDocsWorkComponent implements OnInit {







  private adminJob: AdminJobDocs = inject(AdminJobDocs);
  private adminwork: AdminWork = inject(AdminWork)
  private toaster: ToastService = inject(ToastService)
  selectedType: any;
  typeList: any;
  token: string = "";
  companyId: string = "";
  userId: string = ""
  docs: any;
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
    this.docs = 'changing'
    this.token = token;
    this.companyId = companyID;
    this.userId = userid;

    this.adminwork.GetWork(token, this.companyId, -1, -1, this.job.JobID,)
      .subscribe({
        next: (res) => {
          if (res.Status) {
            this.workList = res.Result
            this.docs = 'success'
          } else {
            this.toaster.error('Error ', res.Message)
            this.docs = 'errorWork'
          }

        },
        error: (err) => {
          this.toaster.error('Error ' + err)
        }
      })
    this.adminwork.GetDocId(this.token)
      .subscribe({
        next: (data) => {
          if (data.Status) {
            this.typeList = data.Result;

          } else {
            this.toaster.error('Error Loading Docs, Please try Again')
            this.docs = 'errorList'
          }
        },
        error: (err) => {
          this.toaster.error('Error ' + err)
        }
      });
  }

  noWorkClick(work: any) {
    this.selectedWork = work;
    this.selectedWorkId = work.WorkID;
    this.workDoc = true;
    this.jobDoc = false
  }

  noJobClick(type: any) {
    console.log(type)
    this.selectedType = type;
    this.workDoc = false;
    setTimeout(() => {
      this.jobDoc = true;
    });

  }
  viewJobDetails(work: any) {
    console.log('Viewing job details for:', this.job);
    this.jobDoc = true
    this.workDoc = false
  }

  assignWork(work: any) {
    console.log('Assigning work for:', work);

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
