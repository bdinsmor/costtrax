import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { Activity, Message } from '@app/core/in-memory-data.service';
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
  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    console.log('inside home');
  }
}
