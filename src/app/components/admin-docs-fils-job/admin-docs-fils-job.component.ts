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
  selector: 'app-admin-docs-fils-job',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-docs-fils-job.component.html',
  styleUrl: './admin-docs-fils-job.component.css'
})


export class AdminDocsFilsJobComponent {

  @Input() job: any = {};
  @Input() type: any;
  @Input() work: any = {};
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




  selectedWorkType: number = 201;
  Workdocs: any;
  // documents: any = [];

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
      console.log(this.type)
      console.log(this.job)
      this.loadDocs();

    }
  }

  goBackWork() {
    this.workFile = false
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
    this.docs = "changing"
    this.adminJob.GetJobDocs(this.token, -1, this.job.JobID, this.type.DocumentTypeID)
      .subscribe((res) => {
        if (res.Status) {
          this.docs = res.Result;
        } else {
          this.toaster.error('Error ', res.Message)
          this.docs = ""
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
            this.docs = this.docs.filter((d: any) => {
              console.log(d.JobDocument);
              console.log(doc.JobDocument);
              return d.JobDocument !== doc.JobDocument;
            });
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
    // Replace this with the actual document URL or data string for the user
    if (doc.JobDocument) {
      // const link = document.createElement('a');
      // link.href = `http://triad.forestepinstitute.com/Images/JobDoc/${doc?.JobDocument}`;
      // link.download = `${doc?.JobDocument || 'UserDocument'}`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      window.open(`http://triad.forestepinstitute.com/Images/JobDoc/${doc?.JobDocument}`, '_blank');
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
        // You likely want to reload only after success
        // You likely want to reload only after success
        console.log(response.Message)
      });
    };

    reader.readAsDataURL(this.selectedFile);

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
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    // You need to construct a jobDetail object here with the required properties


    selectedRoles.forEach(role => {
      const jobDetail = {
        JobID: this.job.JobID,
        DocumentTypeID: this.type.DocumentTypeID,
        DocumentType: this.type.DocumentType,
        PermissionTo: role.id,
        JobDocument: this.selectedFile ? 'Web' + this.type.DocumentType + timestamp + this.selectedFile.name : '',
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
    this.uploadFiles(this.selectedFile ? 'Web' + this.type.DocumentType + timestamp + this.selectedFile.name : '')
    // Reset the form fields after submission
    this.newDoc = {
      DocumentTypeID: 201,
      Manager: false,
      Vendor: false,
      Customer: false,
      Employee: false,
      file: null,
      DocumentDetail: ''
    };
    this.selectedFile = null;
    this.loadDocs();
  }



  // onTypeChange() {
  //   // Load documents for the selected type
  //   this.loadDocs();
  // }

  // onCancel() {
  //   console.log("in child");
  //   this.cancel.emit();
  // }

  // deleteDoc(doc: any) {
  //   if (!confirm('Are you sure you want to delete this document?')) {
  //     return;
  //   }
  //   console.log('Deleting document:', doc.DocumentID);
  //   this.adminJob.DeleteJobDoc(this.token, doc.DocumentID)
  //     .subscribe({
  //       next: (response) => {
  //         if (response.Status) {
  //           this.docs = this.docs.filter((d: any) => d.DocumentID !== doc.DocumentID);
  //           this.toaster.success('Documnet Deleted Successfully')
  //         } else {
  //           this.toaster.error('Error Deleting Docs, Please try Again')
  //         }
  //       },
  //       error: (err) => {
  //         this.toaster.error('Error ' + err)
  //       }
  //     });
  // }



  onSubmitNewDocWork() {
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