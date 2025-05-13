import { AdminDashboard } from './../../Services/admin/dashboard';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';

@Component({
  selector: 'app-work-edit',
  imports: [CommonModule, FormsModule, FlatpickrDirective],
  providers: [provideFlatpickrDefaults()],
  templateUrl: './work-edit.component.html',
  styleUrl: './work-edit.component.css',
  standalone: true,
})
export class WorkEditComponent implements OnInit {
  constructor(private AdminDashboard: AdminDashboard) { }
  rangeValue: { from: Date; to: Date } = { from: new Date(), to: new Date() };

  @Input() work: any = {};
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  color: any;
  priority: any;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const companyID = localStorage.getItem('CompanyID') || '';
      const token = localStorage.getItem('Token') || '';
      const userid = localStorage.getItem('UserID') || ' ';
      const start = this.work?.StartDate ? new Date(this.work.StartDate) : new Date();
      const end = this.work?.EndDate ? new Date(this.work.EndDate) : new Date();
      this.rangeValue = { from: start, to: end };

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
    }
  }
  onSave() {
    console.log("d")
    const selectedColorDetail = this.color.find(
      (i: any) => i.ColorID == this.work.ColorID
    );
    this.work.ColorID = this.work.ColorID,
      this.work.ColorName = selectedColorDetail.ColorName,
      this.work.Color_Hex = selectedColorDetail.Color_Hex,
      this.work.ColorDetail = selectedColorDetail.ColorDetail,
      this.work.StartDate = new Date(this.rangeValue.from).toLocaleDateString();
    this.work.EndDate = new Date(this.rangeValue.to).toLocaleDateString();
    this.work.StartTime = this.rangeValue.from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    this.work.EndTime = this.rangeValue.to.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    console.log(this.work.StartDate)
    this.save.emit(this.work);
  }

  onCancel() {
    this.cancel.emit();
  }
}
