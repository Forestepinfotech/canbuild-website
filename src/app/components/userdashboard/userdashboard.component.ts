import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminWork } from './../../Services/admin/work';
@Component({
  selector: 'app-userdashboard',
  imports: [CommonModule],
  templateUrl: './userdashboard.component.html',
  styleUrl: './userdashboard.component.css',
})
export class UserdashboardComponent implements OnInit {
  timelineData: TimelineItem[] = [];
  workList: any;
  token: string = '';
  companyId: string = '';
  userId: string = '';
constructor(private AdminWork: AdminWork,  private toastr: ToastrService) { }
  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';
      this.token = token;
      this.companyId = companyID;
      this.userId = userid;

      this.AdminWork.GetWorkByID(
        token,
        this.companyId,
        -1,
        -1,
        8863,
        -1
      ).subscribe({
        next: (res) => {
          if (res.Status) {
            this.workList = res.Result;
          } else {
            this.toastr.error('Error ', res.Message);
          }
        },
        error: (err) => {
          this.toastr.error('Error ' + err);
        },
      });
    }

    this.timelineData = [
      {
        icon: 'zmdi zmdi-label',
        time: '2019-11-04 03:45AM',
        dateLabel: 'Today',
        name: 'Art Ramadani',
        action: 'posted a status update',
        description: `Tolerably earnestly middleton extremely distrusts she boy now not. Add and offered
        prepare how cordial two promise. Greatly who affixed suppose but enquire compact prepare
        all put. Added forth chief trees but rooms think may.`,
        color: '#fcba03',
      },
      {
        icon: 'zmdi zmdi-label',
        time: '2019-11-04 03:45AM',
        dateLabel: 'Today',
        name: 'Art Ramadani',
        action: 'posted a status update',
        description: `Tolerably earnestly middleton extremely distrusts she boy now not. Add and offered
        prepare how cordial two promise. Greatly who affixed suppose but enquire compact prepare
        all put. Added forth chief trees but rooms think may.`,
        color: '#fc0335',
      },
      {
        icon: 'zmdi zmdi-label',
        time: '2019-11-04 03:45AM',
        dateLabel: 'Today',
        name: 'Art Ramadani',
        action: 'posted a status update',
        description: `Tolerably earnestly middleton extremely distrusts she boy now not. Add and offered
        prepare how cordial two promise. Greatly who affixed suppose but enquire compact prepare
        all put. Added forth chief trees but rooms think may.`,
        color: '#0b03fc',
      },
      // Add more timeline items as needed
    ];
  }
}
export interface TimelineItem {
  icon: string;
  time: string;
  dateLabel: string;
  name: string;
  action: string;
  description: string;
  color:string;
}