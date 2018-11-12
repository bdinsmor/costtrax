import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-configuration-dialog',
  templateUrl: './configuration-dialog.component.html',
  styleUrls: ['./configuration-dialog.component.scss']
})
export class ConfigurationDialogComponent implements OnInit {
  configurations: any[];
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.configurations = this.data.configurations;
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm(configuration: any) {
    this.dialogRef.close({
      success: true,
      configuration: configuration
    });
  }
}
