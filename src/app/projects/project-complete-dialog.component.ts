import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-project-complete-dialog',
  templateUrl: './project-complete-dialog.component.html',
  styleUrls: ['./project-complete-dialog.component.scss']
})
export class ProjectCompleteDialogComponent implements OnInit {
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
