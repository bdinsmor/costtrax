import { Component, Inject, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Request, Project } from '@app/shared/model';
import { ProjectsService } from '@app/projects/projects.service';
import { Observable } from 'rxjs/Observable';
import { RequestsService } from '../requests.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequestFormComponent implements OnInit {
  dialogTitle: string;
  requestForm: FormGroup;
  projectFormGroup: FormGroup;
  costFormGroup: FormGroup;
  costDetailsFormGroup: FormGroup;
  signatureFormGroup: FormGroup;
  action: string;
  @Input() request: Request;
  projects: Observable<Project[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private formBuilder: FormBuilder
  ) {
    if (!this.request) {
      this.request = new Request({});
    }
    this.projectFormGroup = this.createProjectFormGroup();
    this.costFormGroup = this.createCostFormGroup();
    this.costDetailsFormGroup = this.createCostDetailsFormGroup();
    this.signatureFormGroup = this.createSignatureFormGroup();
    this.projects = this.projectsService.entities$;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    console.log('id: ' + id);
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
