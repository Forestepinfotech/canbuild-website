import { AdminSpecifications } from './../../Services/admin/specification';
import { AdminWork } from './../../Services/admin/work';
import { Component, OnInit } from '@angular/core';
import { WorkModel } from '../../Model/Work.Model'; // Ensure WorkModel is a class or interface
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkEditComponent } from "../work-edit/work-edit.component";
import { UnaryOperator } from '@angular/compiler';

@Component({
  selector: 'app-work-manage',
  imports: [CommonModule, FormsModule, WorkEditComponent],
  templateUrl: './work-manage.component.html',
  styleUrl: './work-manage.component.css'
})
export class WorkManageComponent implements OnInit {
  selectedWork: any;
  cancelEdit() {
    throw new Error('Method not implemented.');
  }
  saveJob($event: Event) {
    throw new Error('Method not implemented.');
  }
  constructor(private AdminWork: AdminWork, private AdminSpecifications: AdminSpecifications) { }
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
  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {

      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';

      this.token = token;
      this.companyId = companyID;
      this.userId = userid;
      this.AdminWork.GetWork(token, this.companyId, -1, -1, -1,)
        .subscribe({
          next: (res) => {
            this.workList = res.Result
          },
          error: (err) => {
            console.log(err)
          }
        })

      this.AdminSpecifications.GetSpecification(token, '-1', -1, -1)
        .subscribe({
          next: (value) => {
            console.log(value);
            this.specificList = value.Result;
          },
          error: (res) => {
            console.log(res)
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
        console.log('User updated successfully:', response);

        alert(response.Message)

      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });

  }
  onStatusToggle(specific: any, work: any, selected: boolean): void {
    console.log(specific)
  }

  onStatusSelect(id: number, work: any) {
    this.AdminWork.UpdateWorkCompleteStatus(this.token, this.userId, id, work.WorkID).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        const selectedStatus = this.status.find((s: any) => s.statusId === id);
        if (selectedStatus) {
          work.StatusID = selectedStatus.statusId;
          work.StatusName = selectedStatus.statusName;
        }

        alert(response.Message)
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }
  onEdit(work: any) {
    this.selectedWork = { ...work };
    this.editing = true;
  }
  onDelete(work: any) {
    this.AdminWork.DeleteWork(this.token, work)
      .subscribe({
        next: (res) => {
          console.log('deeted')
          alert('Work Deleted')
        },
        error(err) {
          console.log(err)
        },
      })
  }

  onCancel() {
    this.editing = false;
  }
  onSave(updatedWork: any) {
    console.log(updatedWork)
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
          this.editing = false
          console.log(res)
        },
        error: (err) => {
          console.log(err)
        }
      })
  }
}
