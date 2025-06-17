import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AdminJobDocs } from '../../Services/admin/jobdocs';
import { AdminUser } from '../../Services/admin/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminWork } from '../../Services/admin/work';
import { ToastService } from '../../Services/toast.service';
import { time } from 'node:console';

@Component({
  selector: 'app-work-documents',
  imports: [CommonModule, FormsModule],
  templateUrl: './work-documents.component.html',
  styleUrl: './work-documents.component.css'
})
export class WorkDocumentsComponentOnInit {
  @Input() work: any = {};
  @Output() cancel = new EventEmitter<void>();

  // Use inject function to get the service
  private adminJob: AdminJobDocs = inject(AdminJobDocs);
  private adminuser: AdminUser = inject(AdminUser)
  private adminwork: AdminWork = inject(AdminWork)
  private toaster: ToastService = inject(ToastService)
  typeList: any = [];
  selectedType: number = 201;
  docs: any;
  token: string = "";
  companyId: string = "";
  userId: string = "";
  documents: any = [];
  selectedFile: File | null = null;
  newDoc: {
    DocumentTypeID: number,
    DocumentDetail: string,

  } = {
      DocumentTypeID: 201,
      DocumentDetail: "",

    };
  currentPage: number = 1;
  pageSize: number = 5;
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
      this.loadDocs(this.currentPage, this.pageSize);

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



  loadDocs(page: number = 1, size: number = 5) {
    this.currentPage = page;
    this.docs = "changing"
    this.adminwork.GetWorkDoc(this.token, "-1", this.work.WorkID, this.work.UserID, this.work.JobID, this.work.JobName, page, size, this.selectedType)
      .subscribe({
        next: (data) => {
          if (data.Status) {
            this.docs = data.Result;

          } else {
            this.docs = "none"
            this.toaster.error('Error Loading Docs, Please try Again')

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
    console.log("in child");
    this.cancel.emit();
  }

  deleteDoc(doc: any) {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }
    console.log('Deleting document:', doc.DocumentID);
    this.adminJob.DeleteJobDoc(this.token, doc.DocumentID)
      .subscribe({
        next: (response) => {
          if (response.Status) {
            this.docs = this.docs.filter((d: any) => d.DocumentID !== doc.DocumentID);
            this.toaster.success('Documnet Deleted Successfully')
          } else {
            this.toaster.error('Error Deleting Docs, Please try Again')
          }
        },
        error: (err) => {
          this.toaster.error('Error ' + err)
        }
      });
  }

  downloadDoc(doc: any) {
    // Replace this with the actual document URL or data string for the user
    if (doc.DocumentName) {
      // const link = document.createElement('a');
      // link.href = `http://triad.forestepinstitute.com/Images/JobDoc/${doc?.DocumentName}`;
      // link.download = `${doc?.DocumentName || 'UserDocument'}`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      window.open(`http://triad.forestepinstitute.com/Images/JobDoc/${doc?.DocumentName}`, '_blank');

    }
    else {
      this.toaster.error('Error ', 'This Document Can not be viewed at this time')
    }
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      console.log(this.selectedFile)
    }
  }

  uploadFiles(fileName: string) {
    if (!this.selectedFile) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      const base64 = result.split(',')[1]; // remove `data:image/png;base64,`

      const payload = {
        FileBytes: base64, // string
        FileName: fileName,
        FilePath: 'JobDoc'
      };

      console.log('Payload with raw bytes:', payload);
      this.adminuser.UploadFile(this.token, payload).subscribe((response) => {
        if (response.Status) {
          this.toaster.success('User File uploaded successfully')
          console.log("SUCCESS")
        } else {
          this.toaster.error('Error', response.Message);
        }
        console.log(response.Message)
      });
    };

    reader.readAsDataURL(this.selectedFile);

  }
  onSubmitNewDoc() {
    const formData = new FormData();
    formData.append('DocumentTypeID', this.newDoc.DocumentTypeID?.toString() || '');
    formData.append('DocumentDetail', this.newDoc.DocumentTypeID?.toString() || '');
    console.log(formData)


    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    // You need to construct a jobDetail object here with the required properties
    const documentTypeName = this.typeList.find((t: { DocumentTypeID: number; }) => t.DocumentTypeID === this.newDoc.DocumentTypeID)?.name || '';
    const workDocDetail = {
      JobID: this.work.JobID,
      JobName: this.work.JobName,
      WorkID: this.work.WorkID,
      WorkDetail: this.work.WorkDetail,
      DocumentTypeID: this.newDoc.DocumentTypeID,
      DocumentType: documentTypeName,
      DocumentName: this.selectedFile ? 'web' + timestamp + this.selectedFile.name : '',
      DocumentDetail: this.newDoc.DocumentDetail,
      isActive: -1,
      isDeleted: 0,
      UserID: this.work.UserID,
      UserName: this.work.UserName
    };
    this.adminwork.CreateWorkDoc(this.token, workDocDetail).subscribe((response) => {
      if (response.Status) {
        this.toaster.success('Successful in Creating a new Doc')
        this.uploadFiles(this.selectedFile ? 'web' + timestamp + this.selectedFile.name : '')
        this.newDoc.DocumentDetail = ''
        this.newDoc.DocumentTypeID = 201
        this.selectedFile = null
        this.loadDocs()
      } else {
        this.toaster.error('Error Creating Docs, Please try Again')
      }
    });

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
