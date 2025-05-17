import { AdminSpecifications } from './../../Services/admin/specification';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-requirements',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-requirements.component.html',
  styleUrl: './admin-requirements.component.css'
})
export class AdminRequirementsComponent implements OnInit {

  editing: boolean = false;
  SpecificList: any
  token: string = "";
  companyId: string = "";
  userId: string = "";
  editSpec: any;
  createSpec: any;
  constructor(private AdminSpecifications: AdminSpecifications, private toastr: ToastrService) { }
  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';
      this.token = token;
      this.companyId = companyID;
      this.userId = userid;


      this.AdminSpecifications.GetSpecification(token, '-1', -1, -1)
        .subscribe({
          next: (value) => {
            if (value.Status) {
              this.SpecificList = value.Result;
            } else {
              this.toastr.error('Error ', value.Message)
            }
          },
          error: (res) => {
            this.toastr.error('Error' + res)
          }

        })
    }
  }
  deleteSpecific(id: any) {
    if (!confirm('Are you sure you want to delete this requirement?')) {
      return
    }
    this.AdminSpecifications.DeleteSpecification(this.token, id)
      .subscribe({
        next: (res) => {
          if (res.Status) {
            this.toastr.success('Deleted')
            location.reload()
          }
          else {
            this.toastr.error('Error ', res.Message)
          }
        },
        error: (err) => {
          this.toastr.error("ERROR" + err)
        }

      })
  }
  createNewSpec() {
    this.AdminSpecifications.CreateSpecification(this.token, {
      Specification: this.createSpec,
      JobDetail: '',
      SpecificationID: 0,
      isDone: 0,
      Done: '',
      CompanyID: 0,
      UserID: 0,
      isActive: 0,
      WorkID: 0,
      WorkSubject: ''
    })
      .subscribe({
        next: (res) => {
          if (res.Status) {
            this.toastr.success('Requirement Created')
            location.reload()
          } else {
            this.toastr.error('Error ', res.Message)
          }
        },
        error: (err) => {

          this.toastr.error("ERROR" + err)
        }
      })
  }
  editSpecific(specific: any) {
    this.editSpec = specific;
    this.editing = true;
    console.log(this.editing)
  }
  cancelEdit() {
    this.editing = false;
  }
  saveEdit(newSpecific: any) {

    this.AdminSpecifications.UpdateSpecification(this.token, newSpecific)
      .subscribe({
        next: (res) => {
          if (res.Status) {
            this.toastr.success('Requirement Updated')
            location.reload()
          } else {
            this.toastr.error('Error ', res.Message)
          }
        },
        error: (err) => {

          this.toastr.error("ERROR" + err)
        }
      })
  }
}
