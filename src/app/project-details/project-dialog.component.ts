
import { Component, Inject } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-project-dialog',
  templateUrl: 'project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']

})
export class ProjectDetailsDialogComponent {
firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ProjectDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
