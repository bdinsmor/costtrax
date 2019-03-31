import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Request } from 'src/app/shared/model';

@Component({
  selector: 'app-request-recapitulation-dialog',
  templateUrl: './request-recapitulation-dialog.component.html',
  styleUrls: ['./request-recapitulation-dialog.component.scss']
})
export class RequestRecapitulationDialogComponent implements OnInit {
  request: Request;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    // console.log('data: ' + JSON.stringify(this.data, null, 2));
    this.request = this.data.request;
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({ success: true });
  }
}
