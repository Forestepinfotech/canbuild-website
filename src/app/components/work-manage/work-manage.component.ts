import { AdminSpecifications } from './../../Services/admin/specification';
import { AdminWork } from './../../Services/admin/work';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WorkModel } from '../../Model/Work.Model'; // Ensure WorkModel is a class or interface
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkEditComponent } from "../work-edit/work-edit.component";

import { WorkrMultiFilterPipe } from './workfilter.pipe';
import { WorkDocumentsComponentOnInit } from "../work-documents/work-documents.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-work-manage',
  imports: [CommonModule, FormsModule, WorkEditComponent, WorkrMultiFilterPipe, WorkDocumentsComponentOnInit],
  templateUrl: './work-manage.component.html',
  styleUrl: './work-manage.component.css'
})
export class WorkManageComponent implements OnInit {
  selectedWork: any;
  workSearch: string = '';
  jobSearch: string = '';
  docs: boolean = false;



  constructor(private AdminWork: AdminWork, private AdminSpecifications: AdminSpecifications, private toastr: ToastrService) { }




  selectedJob: any;
  jobList: any;
  editing: boolean = false;
  token: string = "";
  companyId: string = "";
  userId: string = "";

  workList: any;
  status: { statusName: string; statusId: number }[] = [{ statusName: 'pending', statusId: 1009 }, { statusName: 'Completed', statusId: 1008 }, { statusName: 'In Progress', statusId: 1012 }];
  workStatus: any;

  selectedSpecific: any;
  specificList: any;
  @ViewChild('scrollTop') scrollTopRef!: ElementRef;
  @ViewChild('scrollBottom') scrollBottomRef!: ElementRef;



  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.workList = 'changing'
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';

      this.token = token;
      this.companyId = companyID;
      this.userId = userid;
      this.AdminWork.GetWork(token, this.companyId, -1, -1, -1,)
        .subscribe({
          next: (res) => {
            if (res.Status) {
              this.workList = res.Result
            } else {
              this.toastr.error('Error ', res.Message)
            }
          },
          error: (err) => {
            this.toastr.error('Error ' + err)
          }
        })

      this.AdminSpecifications.GetSpecification(token, '-1', -1, -1)
        .subscribe({
          next: (value) => {
            if (value.Status) {
              this.specificList = value.Result;
            } else {
              this.toastr.error('Error ', value.Message)
            }
          },
          error: (res) => {
            this.toastr.error('Error ' + res)
          }

        })



    }
  }

  toggleActive(work: any, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    work.isActive = checkbox.checked ? 1 : 0;
    const token = localStorage.getItem('Token') || '';
    this.AdminWork.UpdateWorkStatus(token, work.WorkID, work.isActive).subscribe({
      next: (response) => {
        if (response.Status) {
          this.toastr.success('User Updated Successfully')
        } else {
          this.toastr.error('Error ', response.Message)
        }

      },
      error: (err) => {
        this.toastr.error('Error ' + err)
      }
    });

  }
  onStatusToggle(specific: any, work: any, selected: boolean): void {
    if (selected) {
      console.log(specific, work, selected)
      const payload = {
        JobID: work.JobID,
        JobDetail: work.JobDetail,
        SpecificationID: specific.SpecificationID,
        Specification: specific.Specification,
        isDone: 1,
        Done: "No",
        CompanyID: Number(this.companyId),
        UserID: Number(this.userId),
        isActive: 1,
        WorkID: work.WorkID,
        WorkSubject: work.WorkSubject
      };
      this.AdminSpecifications.UpdateSpecification(this.token, payload).subscribe({
        next: (res) => {
          if (res.Status) {
            this.toastr.success('Updated the user status ')
          }
          else {
            this.toastr.error('Error ', res.Message)
          }
        },
        error: (err) => {
          this.toastr.error('Error ' + err)
        }
      });
    }
  }

  onStatusSelect(id: number, work: any) {
    this.AdminWork.UpdateWorkCompleteStatus(this.token, this.userId, id, work.WorkID).subscribe({
      next: (response) => {
        if (response.Status) {
          this.toastr.success('Successfully updated the user')
          const selectedStatus = this.status.find((s: any) => s.statusId === id);
          if (selectedStatus) {
            work.StatusID = selectedStatus.statusId;
            work.StatusName = selectedStatus.statusName;
          }
        } else {
          this.toastr.error('Error ', response.Message)
        }
      },
      error: (err) => {
        this.toastr.error('Error ' + err)
      }
    });
  }
  doc(user: any) {
    this.selectedWork = user;
    this.editing = false; // <-- add this
    this.docs = true;
  }

  onEdit(job: any) {
    this.selectedWork = job;
    this.docs = false; // <-- add this
    this.editing = true;
    console.log("here")
  }
  onCancel() {
    this.editing = false;
    this.docs = false;
  }
  onDelete(work: any) {
    if (!confirm(`Are you sure you want to delete project: ${work.WorkStatus}?`)) {
      return;
    }
    this.AdminWork.DeleteWork(this.token, work)
      .subscribe({
        next: (res) => {
          if (res.Status) {
            this.toastr.success('Work Deleted')
            location.reload()
          } else {
            this.toastr.error('Error ', res.Message)
          }
        },
        error: (err) => {
          this.toastr.error('Error ' + err)
        },
      })
  }


  onSave(updatedWork: any) {
    const payload: WorkModel = {
      WorkID: updatedWork.WorkID,
      WorkSubject: updatedWork.WorkSubject,
      WorkDetail: updatedWork.WorkDetail,
      isHourly: updatedWork.isHourly,
      StartTime: updatedWork.StartTime,
      EndTime: updatedWork.EndTime,
      WorkTimeZone: updatedWork.WorkTimeZone,
      isRadius: updatedWork.isRadius,
      Radius: updatedWork.Radius,

      ColorID: updatedWork.ColorID,
      ColorName: updatedWork.ColorName,
      Color_Hex: updatedWork.Color_Hex,

      PriorityID: updatedWork.PriorityID,
      PriorityName: updatedWork.PriorityName,
      PriorityLevel: updatedWork.PriorityLevel,

      UserID: updatedWork.UserID,
      UserName: updatedWork.UserName,
      UserType: 'manager',
      UserTypeID: updatedWork.UserTypeID,

      CompanyID: updatedWork.CompanyID,
      CompanyName: updatedWork.CompanyName,

      StartDate: updatedWork.StartDate,
      EndDate: updatedWork.EndDate,
      CreatedBy: updatedWork.CreatedBy,

      StatusID: updatedWork.StatusID,
      StatusName: updatedWork.StatusName,
      ProjectStartingDate: updatedWork.ProjectStartingDate,
      ProjectEndingDate: updatedWork.ProjectEndingDate,
      JobID: updatedWork.JobID,
      JobName: updatedWork.JobName,
      JobAddress: updatedWork.JobAddress,
      isActive: updatedWork.isActive,
      WorkingDays: updatedWork.WorkingDays,
      ProjectDateRange: updatedWork.ProjectDateRange,
      ColorDetail: updatedWork.ColorDetail,
    }
    this.AdminWork.UpdateWork(this.token, payload)
      .subscribe({
        next: (res) => {
          if (res.Status) {
            this.editing = false
            this.toastr.success('Work Saved Successfully')
          } else {
            this.toastr.error('Error ', res.Message)
          }
        },
        error: (err) => {
          this.toastr.error('Error ') + err
        }
      })
  }
}
