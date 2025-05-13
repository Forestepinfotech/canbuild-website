import { CommonModule } from '@angular/common';
import { AdminDashboard } from './../../Services/admin/dashboard';
import { Component, OnInit } from '@angular/core';
import {
  AgendaService,
  DayService,
  EventRenderedArgs,
  EventSettingsModel,
  MonthService,
  ScheduleModule,
  View,
  WeekService,
  WorkWeekService,
} from '@syncfusion/ej2-angular-schedule';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ScheduleModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
  ],
})
export class DashboardComponent implements OnInit {
  dashboardDataUsers: any;
  dashboardDataWork: any;
  public selectedDate: Date = new Date();
  public data: Object[] = [];
  public eventSettings: EventSettingsModel = {};
  public allowMultipleData: Boolean = true;
  public currentView: View = 'Month';
  public readonly = true;
  colorNotes: any;
  constructor(
    private AdminDashboard: AdminDashboard) { }
  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {

      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';


      if (companyID != null || token != null) {
        this.AdminDashboard.GetDashboardCardsUser(companyID, token)
          .subscribe({
            next: (data) => {
              console.log('Dashboard data:', data);
              this.dashboardDataUsers = data.Result;
            },
            error: (err) => {
              console.error('Error fetching dashboard data:', err);
            }
          });
      }
      if (companyID != null || token != null) {
        this.AdminDashboard.GetDashboardCardsWork(companyID, token,)
          .subscribe({
            next: (data) => {
              console.log('Dashboard data:', data);
              this.dashboardDataWork = data.Result;
            },
            error: (err) => {
              console.error('Error fetching dashboard data:', err);
            }
          });
      }
      if (companyID != null || token != null) {
        this.AdminDashboard.GetColorNotes(companyID, token, '-1')
          .subscribe({
            next: (data) => {
              console.log('Dashboard data:', data);
              this.colorNotes = data.Result;
            },
            error: (err) => {
              console.error('Error fetching dashboard data:', err);
            }
          });
      }

      if (userid != null || token != null) {
        this.AdminDashboard
          .GetScheduler(companyID ?? '-1', '-1', '-1', '-1', token ?? '-1')
          .subscribe((response) => {
            if (response.Status) {
              this.data = [];
              for (let item of response.Result) {
                this.data.push({
                  Id: item.WorkID,
                  Subject: `${item.JobName} - Assigned To - ${item.UserName}`,
                  Location: item.JobAddress,
                  StartTime: new Date(item.StartDate),
                  EndTime: new Date(item.EndDate),
                  BackgroundColor: item.Color_Hex,
                });
              }

              this.eventSettings = { dataSource: this.data };
              console.log(this.data);
            } else {
              console.log(response.Message);
            }
          });
      }
    }
  }
}
