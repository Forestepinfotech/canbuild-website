
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { AdminJobDocs } from '../../Services/admin/jobdocs';
import { response } from 'express';
import { AdminProject } from '../../Services/admin/projects';
import { AdminUser } from '../../Services/admin/User';
import { ToastService } from '../../Services/toast.service';
import { ToastrService } from 'ngx-toastr';


type DocumentEntry = {
  JobID: number;
  DocumentTypeID: number;
  DocumentType: string;
  PermissionTo: number;
  JobDocument: string;
  JobDocumentID: number;
  UserID: number;
  UserType: string;
};

@Component({
  selector: 'app-project-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [AdminJobDocs],
  templateUrl: './project-documents.component.html',
  styleUrl: './project-documents.component.css'
})
export class ProjectDocumentsComponent implements OnInit {
  @Input() job: any = {};
  @Output() cancel = new EventEmitter<void>();

  // Use inject function to get the service
  private adminJob: AdminJobDocs = inject(AdminJobDocs);
  private adminuser: AdminUser = inject(AdminUser)
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
  documents: DocumentEntry[] = [];
  selectedFile: File | null = null;
  newDoc: {
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
      file: null
    };
  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';

      this.token = token;
      this.companyId = companyID;
      this.userId = userid;
      this.loadDocs();

    }
  }


  getJobDocumentID(
    filters: {
      UserType: string;
      DocumentTypeID: number;
      JobDocument: string;
      PermissionTo: number;
    }
  ): number | null {
    const match = this.documents.find(
      doc =>
        doc.UserType === filters.UserType &&
        doc.DocumentTypeID === filters.DocumentTypeID &&
        doc.JobDocument === filters.JobDocument &&
        doc.PermissionTo === filters.PermissionTo
    );
    return match ? match.JobDocumentID : null;
  }
  loadDocs() {
    this.adminJob.GetJobDocs(this.token, -1, this.job.JobID, this.selectedType)
      .subscribe((res) => {
        if (res.Status) {
          this.docs = res.Result;
        } else {
          this.toaster.error('Error ', res.Message)
        }

      });
    this.adminJob.GetJobDocsID(this.token, -1, this.job.JobID, -1)
      .subscribe({
        next: (data) => {
          this.documents = data.Result;
        },
        error: (err) => {
          this.toaster.error('Error ', err)
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

  toggleEmployeeActive(doc: any, $event: Event) {
    console.log($event)
    console.log(doc)

    const checkbox = $event.target as HTMLInputElement;


    const isChecked = checkbox.checked;
    console.log(isChecked === false)
    const jobDocId = this.getJobDocumentID({
      UserType: "Employee",
      DocumentTypeID: doc.DocumentTypeID,
      JobDocument: doc.JobDocument,
      PermissionTo: 506
    });

    if (isChecked === false) {
      if (jobDocId !== null) {
        console.log(jobDocId)
        this.updateJobDoc(doc.JobID, 0, jobDocId);
      }
    }
    else {
      console.log("here")
      const jobDetail = {
        JobID: doc.JobID,
        DocumentTypeID: doc.DocumentTypeID,
        DocumentType: doc.DocumentType,
        PermissionTo: 506,
        JobDocument: doc.JobDocument,
        UserID: 506,
        UserType: "Employee"
      };
      this.adminJob.CreateJobDoc(this.token, jobDetail).subscribe({
        next: (response) => {
          if (response.Status) {

            this.loadDocs();
          } else {
            this.toaster.error('Error ', response.Message)
          }
        },
        error: (err) => {
          console.error('Error creating job document:', err);
        }
      });
    }
    $event.preventDefault();
  }

  toggleCustomerActive(doc: any, $event: Event) {
    // Implement customer active toggle
    $event.preventDefault();
    const checkbox = $event.target as HTMLInputElement;


    const isChecked = checkbox.checked;
    console.log(isChecked)
    const jobDocId = this.getJobDocumentID({
      UserType: "Customer",
      DocumentTypeID: doc.DocumentTypeID,
      JobDocument: doc.JobDocument,
      PermissionTo: 505
    });

    if (!isChecked) {
      if (jobDocId !== null) {
        console.log(jobDocId)
        this.updateJobDoc(doc.JobID, 0, jobDocId);
      }
    }
    else {
      const jobDetail = {
        JobID: doc.JobID,
        DocumentTypeID: doc.DocumentTypeID,
        DocumentType: doc.DocumentType,
        PermissionTo: 505,
        JobDocument: doc.JobDocument,
        UserID: 505,
        UserType: "Customer"
      };
      this.adminJob.CreateJobDoc(this.token, jobDetail).subscribe({
        next: (response) => {
          if (response.Status) {
            this.toaster.success('Permission Updated')
            this.loadDocs();
          } else {
            this.toaster.error('Error ', response.Message)
          }
        },
        error: (err) => {
          this.toaster.error('Error ', err)
        }
      });

    }
  }

  toggleVendorActive(doc: any, $event: Event) {
    // Implement vendor active toggle
    $event.preventDefault();

    const checkbox = $event.target as HTMLInputElement;


    const isChecked = checkbox.checked;
    console.log(isChecked)
    const jobDocId = this.getJobDocumentID({
      UserType: "Vendor",
      DocumentTypeID: doc.DocumentTypeID,
      JobDocument: doc.JobDocument,
      PermissionTo: 504
    });
    console.log(jobDocId)

    if (!isChecked) {
      if (jobDocId !== null) {
        console.log(jobDocId)
        this.updateJobDoc(doc.JobID, 0, jobDocId);
      }
    }
    else {
      const jobDetail = {
        JobID: doc.JobID,
        DocumentTypeID: doc.DocumentTypeID,
        DocumentType: doc.DocumentType,
        PermissionTo: 504,
        JobDocument: doc.JobDocument,
        UserID: 504,
        UserType: "Vendor"
      };
      this.adminJob.CreateJobDoc(this.token, jobDetail).subscribe({
        next: (response) => {
          if (response.Status) {
            this.toaster.success('Permission Created')
            this.loadDocs();
          } else {
            this.toaster.error('Error ', response.Message)
          }
        },
        error: (err) => {
          this.toaster.error('Error ', err)
        }
      });

    }
  }

  toggleManagerActive(doc: any, $event: Event) {
    // Implement manager active toggle
    $event.preventDefault();
    const checkbox = $event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    console.log(isChecked)
    const jobDocId = this.getJobDocumentID({
      UserType: "Manager",
      DocumentTypeID: doc.DocumentTypeID,
      JobDocument: doc.JobDocument,
      PermissionTo: 503
    });
    console.log(jobDocId)

    if (!isChecked) {
      if (jobDocId !== null) {
        console.log(jobDocId)
        this.updateJobDoc(doc.JobID, 0, jobDocId);
      }
    }
    else {
      const jobDetail = {
        JobID: doc.JobID,
        DocumentTypeID: doc.DocumentTypeID,
        DocumentType: doc.DocumentType,
        PermissionTo: 503,
        JobDocument: doc.JobDocument,
        UserID: 503,
        UserType: "Manager"
      };
      this.adminJob.CreateJobDoc(this.token, jobDetail).subscribe({
        next: (response) => {
          if (response.Status) {
            this.toaster.success('Permission Created')
            this.loadDocs();
          } else {
            this.toaster.error('Error ', response.Message)
          }
        },
        error: (err) => {
          this.toaster.error('Error ', err)
        }
      });

    }
  }


  updateJobDoc(jobId: number, perissionTo: number, jobDocId: number) {
    const jobDetail = {
      JobID: jobId,
      DocumentTypeID: this.selectedType,
      PermissionTo: perissionTo, // Set appropriate value
      JobDocumentID: jobDocId, // Set appropriate value
    };
    this.adminJob.UpdateJobDocPermission(this.token, jobDetail)
      .subscribe({
        next: (res) => {
          if (res.Status) {
            this.toaster.success("Permission updated");
          } else {
            this.toaster.error(res.Message);
          }
        },
        error: (err) => {
          this.toaster.error('Error ', err);
          console.error(err);
        }
      });
  }
  deleteDoc(doc: any) {
    if (!confirm(`Are you sure you want to delete this doc?`)) {
      return;
    }
    this.adminJob.DeleteJobDoc(this.token, doc.JobDocument)
      .subscribe({
        next: (res) => {
          if (res.Status) {
            this.toaster.success('Document deleted');
            this.docs = this.docs.filter((d: any) => d.DocumentID !== doc.DocumentID);
          } else {
            this.toaster.error(res.Message || 'Failed to delete document');
          }
        },
        error: (err) => {
          this.toaster.error('Error deleting document');
          console.error(err);
        }
      });
  }

  downloadDoc(doc: any) {
    this.toaster.error('Error ', 'Cant fetch docs at the moment')


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

        this.adminuser.UploadFile(this.token, payload).subscribe({
          next: (res) => {
            if (res.Status) {
              this.toaster.success(res.Message || "File uploaded successfully");
            } else {
              this.toaster.error(res.Message || "File upload failed");
            }
          },
          error: (err) => {
            this.toaster.error('Error uploading file');
            console.error(err);
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
    if (this.newDoc.Manager) formData.append('PermissionTo[]', '503');
    if (this.newDoc.Vendor) formData.append('PermissionTo[]', '504');
    if (this.newDoc.Customer) formData.append('PermissionTo[]', '505');
    if (this.newDoc.Employee) formData.append('PermissionTo[]', '506');
    console.log(formData)

    const selectedRoles = [];

    if (this.newDoc.Manager) {
      selectedRoles.push({ id: 503, type: 'Manager' });
    }
    if (this.newDoc.Vendor) {
      selectedRoles.push({ id: 504, type: 'Vendor' });
    }
    if (this.newDoc.Customer) {
      selectedRoles.push({ id: 505, type: 'Customer' });
    }
    if (this.newDoc.Employee) {
      selectedRoles.push({ id: 506, type: 'Employee' });
    }

    // You need to construct a jobDetail object here with the required properties
    const documentTypeName = this.typeList.find(t => t.id === this.newDoc.DocumentTypeID)?.name || '';

    selectedRoles.forEach(role => {
      const jobDetail = {
        JobID: this.job.JobID,
        DocumentTypeID: this.newDoc.DocumentTypeID,
        DocumentType: documentTypeName,
        PermissionTo: role.id,
        JobDocument: this.selectedFile ? 'Web' + documentTypeName + this.selectedFile.name : '',
        UserID: role.id,
        UserType: role.type
      };

      this.adminJob.CreateJobDoc(this.token, jobDetail).subscribe((response) => {
        if (response.Status) {
          this.toaster.success(`Document Added for ${role.type}`)
        } else {
          this.toaster.error(`Document NOT Added for ${role.type}`)
        }
      });
    })
    // Reset the form fields after submission
    this.newDoc = {
      DocumentTypeID: 201,
      Manager: false,
      Vendor: false,
      Customer: false,
      Employee: false,
      file: null
    };
    this.selectedFile = null;

  }
}