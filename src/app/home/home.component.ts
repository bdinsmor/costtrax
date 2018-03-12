
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { QuoteService } from './quote.service';
import { ProjectDetailsDialogComponent } from '@app/project-details/project-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string;
  isLoading: boolean;
  activities: Activity[];
  constructor(public dialog: MatDialog, private quoteService: QuoteService) {}

  ngOnInit() {
    this.isLoading = true;
    this.activities = ELEMENT_DATA;
    this.quoteService
      .getRandomQuote({
        category: 'dev'
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });
  }


 // break out into new project module
  showInfo(activity: Activity): void {
        const dialogRef = this.dialog.open(ProjectDetailsDialogComponent, {

            width: '85%',
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('Save off project JSON');
        });
    }



}



export interface Activity {
  action: string;
  requestNo: string;
  projectName: string;
  date: Date;
}

const ELEMENT_DATA: Activity[] = [
  {
    action: 'has approved',
    requestNo: '3234814',
    projectName: 'GA 400 Expansion Project',
    date: new Date()
  },
  { action: 'requested more info', requestNo: '323814', projectName: 'GA 400 Expansion Project', date: new Date() },
  { action: 'has approved', requestNo: '323814', projectName: 'GA 400 Expansion Project', date: new Date() }
];


