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
import { AuthService } from '../../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supervisordashboard',
  imports: [ScheduleModule],
  templateUrl: './supervisordashboard.component.html',
  styleUrl: './supervisordashboard.component.css',
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
  ],
})
export class SupervisordashboardComponent implements OnInit {
  public selectedDate: Date = new Date();
  public data: Object[] = [];
  public eventSettings: EventSettingsModel = {};
  public allowMultipleData: Boolean = true;
  public currentView: View = 'Month';
  public readonly = true;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('Token');
      const userid = localStorage.getItem('UserID');
      const companyid = localStorage.getItem('CompanyID');

      if (userid != null || token != null) {
        this.authService
          .GetScheduler(companyid ?? '-1', '-1', '-1', '-1', token ?? '-1')
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
            } else {
              console.log(response.Message);
            }
          });
      }
    }
  }
}
