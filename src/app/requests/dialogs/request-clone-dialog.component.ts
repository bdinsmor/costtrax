import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-request-clone-dialog',
  templateUrl: './request-clone-dialog.component.html',
  styleUrls: ['./request-clone-dialog.component.scss']
})
export class RequestCloneDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({ success: true });
  }
}
