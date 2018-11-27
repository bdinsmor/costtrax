import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Project, Request } from 'src/app/shared/model';

@Component({
  selector: 'app-request-recapitulation-dialog',
  templateUrl: './request-recapitulation-dialog.component.html',
  styleUrls: ['./request-recapitulation-dialog.component.scss']
})
export class RequestRecapitulationDialogComponent implements OnInit {
  request: Request;
  project: Project;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    // console.log('data: ' + JSON.stringify(this.data, null, 2));
    this.request = this.data.request;
    this.project = this.data.project;
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({ success: true });
  }
}
