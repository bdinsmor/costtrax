import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Activity, LogEntry } from '@app/shared/model';
import { appAnimations } from '@app/core/animations';
import { LogEntryService } from '@app/home/activity.service';
import { RequestsService } from '../requests/requests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  logEntries$: Observable<LogEntry[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  constructor(private logEntryService: LogEntryService) {}

  ngOnInit() {
    this.getLatestActivity();
  }

  removeEntry(log: LogEntry): void {
    this.logEntryService.delete(log);
  }

  viewRequest(log: LogEntry): void {}

  getLatestActivity(): void {
    this.logEntryService.getAll();
    this.logEntries$ = this.logEntryService.entities$;
    this.count$ = this.logEntryService.count$;
    this.loading$ = this.logEntryService.loading$;
  }
}
