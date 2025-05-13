import { Component } from '@angular/core';
import { ScheduleModule, RecurrenceEditorModule, DayService, WeekService, WorkWeekService, MonthService, AgendaService} from '@syncfusion/ej2-angular-schedule';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    ScheduleModule,
    RecurrenceEditorModule,
    RouterOutlet
  ],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'CanBuild';
}
