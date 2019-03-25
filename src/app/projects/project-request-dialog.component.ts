import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import { Project } from 'src/app/shared/model';

@Component({
  selector: 'app-project-request-dialog',
  templateUrl: './project-request-dialog.component.html',
  styleUrls: ['./project-request-dialog.component.scss']
})
export class ProjectRequestDialogComponent implements OnInit {
  projects: Project[];
  projectId: string;
  projectForm: FormGroup;
  dateFormGroup: FormGroup;
  colorTheme = 'theme-dark-blue';
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    if (this.data.projects) {
    }
    this.projects = this.data.projects || [];
    this.projectId = this.data.projectId || '';

    this.createProjectForm();
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({
      success: true,
      projectId: this.projectForm.value.selectedProjectControl,
      dateRange: this.projectForm.value.dateRange
    });
  }

  createProjectForm() {
    if (!this.projectId || this.projectId === '') {
      this.projectForm = new FormGroup({
        selectedProjectControl: new FormControl(null, Validators.required),
        dateRange: new FormControl('', Validators.required)
      });
    } else {
      this.projectForm = new FormGroup({
        dateRange: new FormControl('', Validators.required)
      });
    }
  }
}
