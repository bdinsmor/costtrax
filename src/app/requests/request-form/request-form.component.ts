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
  selectedProject: Project;
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
    this.projectsService.getAll();
  }

  toggleCheckbox(type: string, event: any) {
    switch (type) {
      case 'equipment': {
        this.request.costs.equipmentCosts.enabled = event.checked;
        break;
      }
      case 'labor': {
        this.request.costs.laborCosts.enabled = event.checked;
        break;
      }
      case 'material': {
        this.request.costs.materialCosts.enabled = event.checked;
        break;
      }
      case 'other': {
        this.request.costs.otherCosts.enabled = event.checked;
        break;
      }
      case 'subcontractor': {
        this.request.costs.subcontractorCosts.enabled = event.checked;
        break;
      }
    }
  }

  get projectType() {
    return this.projectFormGroup.get('projectType');
  }

  createProjectFormGroup() {
    return this.formBuilder.group({ projectType: new FormControl('1'), projectSelect: new FormControl() });
  }
  createCostFormGroup() {
    return this.formBuilder.group({
      startDate: new FormControl(new Date()),
      endDate: new FormControl(new Date()),
      equipmentCostsCheckbox: new FormControl(this.request.costs.equipmentCosts.enabled),
      laborCostsCheckbox: new FormControl(this.request.costs.laborCosts.enabled),
      materialCostsCheckbox: new FormControl(this.request.costs.materialCosts.enabled),
      otherCostsCheckbox: new FormControl(this.request.costs.otherCosts.enabled),
      subcontractorCostsCheckbox: new FormControl(this.request.costs.subcontractorCosts.enabled)
    });
  }
  createCostDetailsFormGroup() {
    return this.formBuilder.group({});
  }
  createSignatureFormGroup() {
    return this.formBuilder.group({});
  }
}
