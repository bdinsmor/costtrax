import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { QuoteService } from './quote.service';
import { ProjectDetailsDialogComponent } from '@app/project-details/project-dialog.component';
import { Activity } from '@app/core/in-memory-data.service';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string;
  isLoading: boolean;
  activities: Activity[];
  constructor(public dialog: MatDialog, private messagesService: MessagesService) {}

  ngOnInit() {
    this.isLoading = true;
    this.loadActivities();
  }

  loadActivities(): void {
    this.messagesService.getActivities().subscribe(activities => (this.activities = activities));
  }

  // break out into new project module
  showInfo(activity: Activity): void {
    const dialogRef = this.dialog.open(ProjectDetailsDialogComponent, {
      width: '85%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Save off project JSON');
    });
  }
}
