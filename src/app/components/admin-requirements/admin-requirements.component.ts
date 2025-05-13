import { AdminSpecifications } from './../../Services/admin/specification';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  constructor(private AdminSpecifications: AdminSpecifications) { }
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
            console.log(value);
            this.SpecificList = value.Result;
          },
          error: (res) => {
            console.log(res)
          }

        })
    }
  }
  deleteSpecific(id: any) {
    this.AdminSpecifications.DeleteSpecification(this.token, id)
      .subscribe({
        next: (res) => {
          console.log('deleted')
          location.reload()
        },
        error: (err) => {
          alert("ERROR" + err)
        }

      })
  }
  createNewSpec() {
    console.log(this.createSpec)
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
          console.log(res);
          location.reload()
        },
        error: (err) => {
          console.log(err),
            alert("ERROR" + err)
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
    console.log(newSpecific)
    this.AdminSpecifications.UpdateSpecification(this.token, newSpecific)
      .subscribe({
        next: (res) => {
          console.log('updated')
          location.reload()
        },
        error: (err) => {
          alert("ERROR" + err)
        }

      })
  }
}
