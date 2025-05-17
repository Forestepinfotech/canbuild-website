import { AdminRequest } from './../../Services/admin/request';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-work-request',
  imports: [CommonModule, FormsModule],
  templateUrl: './work-request.component.html',
  styleUrl: './work-request.component.css'
})
export class WorkRequestComponent implements OnInit {
  constructor(private AdminRequest: AdminRequest, private toastr: ToastrService) { }
  request: any;
  token: string = "";
  companyId: string = "";
  userId: string = "";
  currentPage: number = 1;
  pageSize: number = 5;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('Token') || '';
      this.companyId = localStorage.getItem('CompanyID') || '';
      this.userId = localStorage.getItem('UserID') || '';

      this.loadRequests(this.currentPage);
    }
  }

  loadRequests(page: number) {
    this.AdminRequest.GetRequest(this.token, -1, -1, -1, page, this.pageSize)
      .subscribe({
        next: (res) => {
          if (res.Status) {
            this.request = res.Result;
          } else {
            this.toastr.error('Error ', res.Message)
          }
        },
        error: (err) => {
          this.toastr.error('Error ' + err)
        }
      });
  }

  nextPage() {
    this.currentPage++;
    this.loadRequests(this.currentPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRequests(this.currentPage);
    }
  }

  approveRequest(request: any) {
    const payload = {
      WorkSubject: request.WorkSubject || '',
      RequestID: request.RequestID,
      RequestNote: request.RequestNote || '',
      isApproval: 1,
      isActive: request.isActive || 1,
      isDeleted: request.isDeleted || 0,
      OldStartDateTime: request.OldStartDateTime || '',
      OldEndDateTime: request.OldEndDateTime || '',
      StartDate: request.StartDate || '',
      EndDate: request.EndDate || '',
      WorkID: request.WorkID || 0,
      UserID: request.UserID || 0,
      UserName: request.UserName || '',
      CreatedOn: request.CreatedOn || ''
    };
    this.AdminRequest.ApproveRequest(this.token, payload)
      .subscribe({
        next: (res) => {
          if (res.Status) {
            request.isApproval = 1;
            this.toastr.success('Request Approved')
          } else {
            this.toastr.error('Error approving request, Try Again Later')
          }
        },
        error: (err) => this.toastr.error('Error ' + err)
      });
  }

  rejectRequest(request: any) {
    const payload = {
      WorkSubject: request.WorkSubject || '',
      RequestID: request.RequestID,
      RequestNote: request.RequestNote || '',
      isApproval: -1,
      isActive: request.isActive || 1,
      isDeleted: request.isDeleted || 0,
      OldStartDateTime: request.OldStartDateTime || '',
      OldEndDateTime: request.OldEndDateTime || '',
      StartDate: request.StartDate || '',
      EndDate: request.EndDate || '',
      WorkID: request.WorkID || 0,
      UserID: request.UserID || 0,
      UserName: request.UserName || '',
      CreatedOn: request.CreatedOn || ''
    };
    this.AdminRequest.ApproveRequest(this.token, payload)
      .subscribe({
        next: (res) => {
          if (res.Status) {
            request.isApproval = 0;
            this.toastr.success('Request Rejected')
          } else {
            this.toastr.error('Error ', res.Message)
          }
        },
        error: (err) => this.toastr.error('Error ' + err)
      });
  }
}