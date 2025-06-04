import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';

@Component({
  selector: 'app-project-edit',
  imports: [FormsModule, FlatpickrDirective, CommonModule],
  templateUrl: './project-edit.component.html',
  providers: [provideFlatpickrDefaults()],
  styleUrl: './project-edit.component.css'
})
export class ProjectEditComponent {
  @Input() job: any = {};
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  rangeValue: { from: Date; to: Date } = {
    from: new Date(),
    to: (new Date() as any)['fp_incr'](10),
  };

  ngOnChanges() {
    if (this.job?.ProjectStartingDate && this.job?.ProjectEndingDate) {
      this.rangeValue = {
        from: new Date(this.job.ProjectStartingDate),
        to: new Date(this.job.ProjectEndingDate)
      };
    }
  }

  onSave() {
    this.job.ProjectStartingDate = this.rangeValue.from;
    this.job.ProjectEndingDate = this.rangeValue.to;
    this.job.ProjectDateRange = `${this.rangeValue.from} - ${this.rangeValue.to}`
    this.save.emit(this.job);
  }

  onCancel() {
    this.cancel.emit();
  }
}
