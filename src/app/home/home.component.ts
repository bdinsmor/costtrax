import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { QuoteService } from './quote.service';
import { ProjectDetailsDialogComponent } from '@app/project-details/project-dialog.component';
import { Activity, Message } from '@app/core/in-memory-data.service';
import { MessagesService } from '../messages/messages.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string;
  messages$: Observable<Message[]>;
  loading$: Observable<boolean>;
  constructor(public dialog: MatDialog, private messagesService: MessagesService) {
    this.messages$ = messagesService.entities$;
    this.loading$ = messagesService.loading$;
  }

  ngOnInit() {
    this.loadActivities();
  }

  loadActivities(): void {
    this.messagesService.getAll();
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
