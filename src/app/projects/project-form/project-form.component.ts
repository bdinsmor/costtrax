import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Request, Project } from '@app/shared/model';
import { Observable } from 'rxjs/Observable';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-project-form-dialog',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectFormDialogComponent {
  dialogTitle: string;
  requestForm: FormGroup;
  projectFormGroup: FormGroup;
  costFormGroup: FormGroup;
  costDetailsFormGroup: FormGroup;
  signatureFormGroup: FormGroup;
  action: string;
  project: Project;
  projects: Observable<Project[]>;

  constructor(
    public dialogRef: MatDialogRef<ProjectFormDialogComponent>,
    private projectsService: ProjectsService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
    this.action = data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Project';
      this.project = data.project;
    } else {
      this.dialogTitle = 'New Project';
      this.project = new Project();
    }

    this.projectFormGroup = this.createProjectFormGroup();
    this.costFormGroup = this.createCostFormGroup();
    this.costDetailsFormGroup = this.createCostDetailsFormGroup();
    this.signatureFormGroup = this.createSignatureFormGroup();
  }

  createProjectFormGroup() {
    return this.formBuilder.group({});
  }
  createCostFormGroup() {
    return this.formBuilder.group({});
  }
  createCostDetailsFormGroup() {
    return this.formBuilder.group({});
  }
  createSignatureFormGroup() {
    return this.formBuilder.group({});
  }
}
