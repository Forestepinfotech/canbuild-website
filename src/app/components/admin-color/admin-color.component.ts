import { AdminColor } from './../../Services/admin/color';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-color',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-color.component.html',
  styleUrl: './admin-color.component.css'
})
export class AdminColorComponent implements OnInit {

  editing: boolean = false;
  ColorList: any
  token: string = "";
  companyId: string = "";
  userId: string = "";
  editColor: any;
  constructor(private AdminColor: AdminColor) { }
  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';
      this.token = token;
      this.companyId = companyID;
      this.userId = userid;


      this.AdminColor.GetColor(companyID, token, '-1')
        .subscribe({
          next: (value) => {
            console.log(value);
            this.ColorList = value.Result;
          },
          error: (res) => {
            console.log(res)
          }

        })
    }
  }
  deleteColor(newColor: any) {
    this.AdminColor.CreateColor(this.token, {
      ColorID: newColor.ColorID,
      ColorName: newColor.ColorNameng,
      Color_Hex: newColor.Color_Hex,
      ColorDetail: "",
      CompanyID: Number(this.companyId),
      UserID: Number(this.userId)
    })
      .subscribe({
        next: (res) => {
          console.log('created')
          location.reload()
        },
        error: (err) => {
          alert("ERROR" + err)
        }

      })
  }



  editColorClick(color: any) {
    this.editColor = color;
    this.editing = true;
    console.log(this.editing)
  }
  cancelEdit() {
    this.editing = false;
  }
  saveEdit(newColor: any) {
    console.log(newColor)
    this.AdminColor.CreateColor(this.token, {
      ColorID: newColor.ColorID,
      ColorName: newColor.ColorName,
      Color_Hex: newColor.Color_Hex,
      ColorDetail: newColor.ColorDetail,
      CompanyID: Number(this.companyId),
      UserID: Number(this.userId)
    })
      .subscribe({
        next: (res) => {
          console.log('created')
          location.reload()
        },
        error: (err) => {
          alert("ERROR" + err)
        }

      })
  }
}
