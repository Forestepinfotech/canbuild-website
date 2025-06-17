import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { AdminJobDocs } from '../../Services/admin/jobdocs';
import { response } from 'express';
import { AdminProject } from '../../Services/admin/projects';
import { AdminUser } from '../../Services/admin/User';
import { ToastService } from '../../Services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { AdminWork } from '../../Services/admin/work';

type DocumentEntry = {
  JobID: number;
  DocumentTypeID: number;
  DocumentType: string;
  PermissionTo: number;
  JobDocument: string;
  JobDocumentID: number;
  UserID: number;
  UserType: string;
  DocumentDetail: string
};

@Component({
  selector: 'app-admin-docs-files',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-docs-files.component.html',
  styleUrls: ['./admin-docs-files.component.css']
})
export class AdminDocsFilesComponent {
  noJobClick(type: any) {
    this.selectedType = type
    this.workFile = true
  }



  @Input() job: any = {};
  @Output() cancel = new EventEmitter<void>();

  // Use inject function to get the service
  private adminJob: AdminJobDocs = inject(AdminJobDocs);
  private adminuser: AdminUser = inject(AdminUser)
  private adminwork: AdminWork = inject(AdminWork)
  private toaster: ToastService = inject(ToastService)
  typeList: any = [
  ];
  selectedType: number = 201;
  docs: any;
  token: string = "";
  companyId: string = "";
  userId: string = "";
  documents: DocumentEntry[] = [];
  selectedFile: File | null = null;
  newDoc: {
    DocumentDetail: string;
    DocumentTypeID: number,
    Manager: boolean,
    Vendor: boolean,
    Customer: boolean,
    Employee: boolean,
    file: File | null
  } = {
      DocumentTypeID: 201,
      Manager: false,
      Vendor: false,
      Customer: false,
      Employee: false,
      file: null,
      DocumentDetail: ''
    };
  workFile: boolean = false;
  @Input() work: any = {};



  selectedWorkType: number = 201;
  Workdocs: any;
  // documents: any = [];

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;  // Optional, if backend sends total count
  totalItems: number = 0;  // Optional, if backend sends total count
  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';

      this.token = token;
      this.companyId = companyID;
      this.userId = userid;
      this.loadDocs();


      this.adminwork.GetDocId(this.token)
        .subscribe({
          next: (data) => {
            if (data.Status) {
              this.typeList = data.Result;

            } else {
              this.toaster.error('Error Loading Docs, Please try Again')

            }
          },
          error: (err) => {
            this.toaster.error('Error ' + err)
          }
        });
    }
  }

  goBackWork() {
    this.workFile = false
  }

  loadDocs(page: number = 1, size: number = 10) {
    this.currentPage = page;
    this.docs = "changing"
    this.adminwork.GetWorkDoc(this.token, "-1", this.work.WorkID, this.work.UserID, this.work.JobID, this.work.JobName, page, size, -1)
      .subscribe({
        next: (data) => {
          if (data.Status) {
            this.docs = data.Result;

          } else {
            this.toaster.error('Error Loading Docs, Please try Again')
            this.docs = ''
          }
        },
        error: (err) => {
          this.toaster.error('Error ' + err)
        }
      });

  }

  onTypeChange() {
    // Load documents for the selected type
    this.loadDocs();
  }

  onCancel() {
    this.cancel.emit();
  }

  downloadDoc(doc: any) {

    if (doc.DocumentName) {

      window.open(`http://triad.forestepinstitute.com/Images/JobDoc/${doc?.DocumentName}`, '_blank');
    }
    else {
      this.toaster.error('Error ', 'This Document Can not be viewed at this time')
    }
  }


  approveDoc(doc: any): void {
    doc.status = 'approved';
    this.adminwork.UpdateWorkDoc(this.token, {
      DocumentID: doc.DocumentID,
      isActive: 1
    })
      .subscribe((response) => {
        if (response.Status) {
          this.toaster.success('Document Approved!')
          this.loadDocs()
        }
        else {
          this.toaster.error('Error approving Docs, Please try Again')
        }
      })
  }

  rejectDoc(doc: any): void {
    doc.status = 'rejected';
    this.adminwork.UpdateWorkDoc(this.token, {
      DocumentID: doc.DocumentID,
      isActive: 0
    })
      .subscribe((response) => {
        if (response.Status) {
          this.toaster.success('Document Declined')
          this.loadDocs()
        }
        else {
          this.toaster.error('Error rejecting Docs, Please try Again')
        }
      })
  }
}