import { Component, OnInit, ViewEncapsulation, TemplateRef, ViewChild } from '@angular/core';

import { MatDialog, MatDialogRef, MatPaginator } from '@angular/material';
import { finalize } from 'rxjs/operators';

import { Observable } from 'rxjs/Observable';
import { Activity, LogEntry } from '@app/shared/model';
import { appAnimations } from '@app/core/animations';
import { LogEntryService } from '@app/home/home.service';
import { RequestsService } from '../requests/requests.service';
import { RequestFormWizardComponent } from '@app/requests/request-form/request-form-wizard.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  dialogRef: any;
  logEntries$: Observable<LogEntry[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  constructor(public dialog: MatDialog, private logEntryService: LogEntryService) {}

  ngOnInit() {
    this.getLatestActivity();
  }

  removeEntry(log: LogEntry): void {
    this.logEntryService.delete(log);
  }

  viewRequest(log: LogEntry): void {}

  createRequest(newProject: boolean) {
    this.dialogRef = this.dialog.open(RequestFormWizardComponent, {
      width: '90vw',
      data: {
        action: newProject
      }
    });

    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }
    });
  }

  getLatestActivity(): void {
    this.logEntryService.getAll();
    this.logEntries$ = this.logEntryService.entities$;
    this.count$ = this.logEntryService.count$;
    this.loading$ = this.logEntryService.loading$;
  }
}
