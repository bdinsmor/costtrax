import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-account-user-delete-dialog',
  templateUrl: './account-user-delete-dialog.component.html',
  styleUrls: ['./account-user-delete-dialog.component.scss']
})
export class AccountUserDeleteDialogComponent implements OnInit {
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
