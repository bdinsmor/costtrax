import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Project } from 'src/app/shared/model';

@Component({
  selector: 'app-project-request-dialog',
  templateUrl: './project-request-dialog.component.html',
  styleUrls: ['./project-request-dialog.component.scss']
})
export class ProjectRequestDialogComponent implements OnInit {
  projects: Project[];
  projectForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.createProjectForm();
    this.projects = this.data.projects;
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    const selectedProjectId: string = this.projectForm.value
      .selectedProjectControl;
    if (selectedProjectId && selectedProjectId !== '') {
      this.dialogRef.close({ success: true, projectId: selectedProjectId });
    }
  }

  createProjectForm() {
    this.projectForm = new FormGroup({
      selectedProjectControl: new FormControl('', Validators.required)
    });
  }
}
