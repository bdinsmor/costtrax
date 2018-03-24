import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Request, Project } from '@app/shared/model';
import { ProjectsService } from '@app/projects/projects.service';
import { Observable } from 'rxjs/Observable';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-request-form-dialog',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequestFormDialogComponent {
  dialogTitle: string;
  requestForm: FormGroup;
  projectFormGroup: FormGroup;
  costFormGroup: FormGroup;
  costDetailsFormGroup: FormGroup;
  signatureFormGroup: FormGroup;
  action: string;
  request: Request;
  projects: Observable<Project[]>;
  constructor(
    public dialogRef: MatDialogRef<RequestFormDialogComponent>,
    private projectsService: ProjectsService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
    this.action = data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Request';
      this.request = data.request;
    } else {
      this.dialogTitle = 'New Request';
      this.request = new Request({});
    }

    this.projectFormGroup = this.createProjectFormGroup();
    this.costFormGroup = this.createCostFormGroup();
    this.costDetailsFormGroup = this.createCostDetailsFormGroup();
    this.signatureFormGroup = this.createSignatureFormGroup();
    this.projects = this.projectsService.entities$;
  }

  get projectType() {
    return this.projectFormGroup.get('projectType');
  }

  createProjectFormGroup() {
    return this.formBuilder.group({ projectType: new FormControl('1') });
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
