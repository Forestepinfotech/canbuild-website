import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AdminJobDocs } from '../../Services/admin/jobdocs';
import { AdminUser } from '../../Services/admin/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminWork } from '../../Services/admin/work';
import { ToastService } from '../../Services/toast.service';

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
  typeList = [
    { id: 201, name: 'Image' },
    { id: 202, name: 'Inspection' },
    { id: 203, name: 'Permit' }
  ];
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

      console.log(this.work)
    }
  }



  loadDocs(page: number = 1, size: number = 5) {
    this.currentPage = page;
    this.docs = ""
    this.adminwork.GetWorkDoc(this.token, '-1', this.work.WorkID, this.work.UserID, this.work.JobID, this.work.JobName, page, size)
      .subscribe({
        next: (data) => {
          if (data.Status) {
            this.docs = data.Result;

          } else {
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
      return
    }
    this.adminJob.DeleteJobDoc(this.token, doc.JobDocument)
      .subscribe({
        next: (response) => {
          if (response.Status) {
            this.docs = this.docs.filter((d: any) => d.DocumentID !== doc.DocumentID);
            this.toaster.error('Documnet Deleted Successfully')
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
    alert("Can not fetch the doc at the moment!")
    // Implement document download
    // Example implementation:
    // const url = `http://triad.forestepinstitute.com/api/Job/DownloadDoc?documentid=${doc.DocumentID}&token=${this.token}`;
    // window.open(url, '_blank');
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      console.log(this.selectedFile)
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
          FilePath: 'JobDoc'
        };

        this.adminuser.UploadFile(this.token, payload).subscribe((response) => {
          if (response.Status) {

          } else {
            this.toaster.error("File was not uploaded successfully, pleae try again later")
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
  onSubmitNewDoc() {
    const formData = new FormData();
    formData.append('DocumentTypeID', this.newDoc.DocumentTypeID?.toString() || '');
    formData.append('DocumentDetail', this.newDoc.DocumentTypeID?.toString() || '');
    console.log(formData)



    // You need to construct a jobDetail object here with the required properties
    const documentTypeName = this.typeList.find(t => t.id === this.newDoc.DocumentTypeID)?.name || '';
    const workDocDetail = {
      JobID: this.work.JobID,
      JobName: this.work.JobName,
      WorkID: this.work.WorkID,
      WorkDetail: this.work.WorkDetail,
      DocumentTypeID: this.newDoc.DocumentTypeID,
      DocumentType: documentTypeName,
      DocumentName: this.selectedFile ? 'web' + this.selectedFile.name : '',
      DocumentDetail: this.newDoc.DocumentDetail,
      isActive: -1,
      isDeleted: 0,
      UserID: this.work.UserID,
      UserName: this.work.UserName
    };
    this.adminwork.CreateWorkDoc(this.token, workDocDetail).subscribe((response) => {
      if (response.Status) {
        this.toaster.error('Successful in Creating a new Doc')
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
