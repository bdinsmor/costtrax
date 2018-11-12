import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-request-approve-dialog',
  templateUrl: './request-approve-dialog.component.html',
  styleUrls: ['./request-approve-dialog.component.scss']
})
export class RequestApproveDialogComponent implements OnInit {
  approveAll = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.approveAll = this.data.approveAll;
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({ success: true });
  }
}
