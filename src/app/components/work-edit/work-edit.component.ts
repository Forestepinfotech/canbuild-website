import { AdminDashboard } from './../../Services/admin/dashboard';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';
import { AdminWork } from './../../Services/admin/work';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-work-edit',
  imports: [CommonModule, FormsModule, FlatpickrDirective],
  providers: [provideFlatpickrDefaults()],
  templateUrl: './work-edit.component.html',
  styleUrl: './work-edit.component.css',
  standalone: true,
})
export class WorkEditComponent implements OnInit {
  constructor(private AdminDashboard: AdminDashboard, private AdminWork: AdminWork, private toastr: ToastrService) { }

  // rangeValue: { from: Date; to: Date } = { from: new Date(), to: new Date() };

  @Input() work: any = {};
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  color: any;
  priority: any;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      console.log(this.work)
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';
      const start = this.work?.StartDate ? new Date(this.work.StartDate) : new Date();
      const end = this.work?.EndDate ? new Date(this.work.EndDate) : new Date();
      // this.rangeValue = { from: start, to: end };
      this.work.UserID = userid;
      if (typeof this.work.StartTime === 'string') {
        this.work.StartTime = new Date(`1970-01-01T${this.work.StartTime}`);
      }
      if (typeof this.work.EndTime === 'string') {
        this.work.EndTime = new Date(`1970-01-01T${this.work.EndTime}`);
      }


      this.AdminDashboard.GetColorNotes(companyID, token, '-1')
        .subscribe({
          next: (data) => {
            console.log('color:', data);
            this.color = data.Result;
          },
          error: (err) => {
            console.error('Error fetching dashboard data:', err);
          }

        });
      this.AdminWork.GetPriorityWork(token, -1)
        .subscribe({
          next: (res) => {
            if (res.Status) {
              this.priority = res.Result;

            } else {
              this.toastr.error('Error ', res.Message)
            }
          },
          error: (err) => {
            this.toastr.error('Error' + err)
          }
        })


    }
  }
  onSave() {

    const selectedColorDetail = this.color.find(
      (i: any) => i.ColorID == this.work.ColorID
    );
    const selectedPriorirtyDetail = this.priority.find(
      (i: any) => i.PriorityID == this.work.PriorityID
    );
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    this.work.ColorID = this.work.ColorID,
      this.work.ColorName = selectedColorDetail.ColorName,
      this.work.Color_Hex = selectedColorDetail.Color_Hex,
      this.work.ColorDetail = selectedColorDetail.ColorDetail,
      this.work.StartDate = new Date(this.work.StartDate ?? new Date()).toLocaleDateString(),
      this.work.EndDate = new Date(this.work.EndDate ?? new Date()).toLocaleDateString(),

    this.work.PriorityName = selectedPriorirtyDetail.PriorityName
    this.work.PriorityLevel = selectedPriorirtyDetail.PriorityLevel;
    this.work.StartTime = formatTime(this.work.StartTime)
    this.work.EndTime = formatTime(this.work.EndTime)

    //console.log(this.work)
    this.save.emit(this.work);
  }

  onCancel() {
    this.cancel.emit();
  }
}
