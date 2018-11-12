import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-request-submit-dialog',
  templateUrl: './request-submit-dialog.component.html',
  styleUrls: ['./request-submit-dialog.component.scss']
})
export class RequestSubmitDialogComponent implements OnInit {
  signatureFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.signatureFormGroup = new FormGroup({
      signature: new FormControl('')
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({
      success: true,
      signature: this.signatureFormGroup.value.signature
    });
  }
}
