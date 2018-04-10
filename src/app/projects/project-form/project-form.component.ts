import { AuthenticationService } from './../../core/authentication/authentication.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Inject, ViewEncapsulation, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {
  MatSnackBar,
  MatInput,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MAT_DIALOG_DATA
} from '@angular/material';

import { Request, Project, Company, Contractor } from '@app/shared/model';
import { Observable } from 'rxjs/Observable';
import { ProjectsService } from '../projects.service';
import { ContractorsService } from '@app/contractors/contractors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from '@app/companies/companies.service';
import { map } from 'rxjs/operator/map';
import { startWith } from 'rxjs/operator/startWith';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectFormComponent implements OnInit {
  items: any;
  projectFormGroup: FormGroup;
  action: string;
  project: Project;
  companies$: Observable<Company[]>;
  contractors$: Observable<Contractor[]>;
  @ViewChild('chipInput', { read: MatAutocompleteTrigger })
  private autoCompleteTrigger: MatAutocompleteTrigger;
  // Set up reactive formcontrol
  autoCompleteChipList: FormControl = new FormControl();
  // Set up values to use with Chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  selectedItems: string[] = [];
  filteredItems: Observable<any[]>;
  invitedContractors = new FormControl();
  addItems: FormControl;
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  options: Contractor[];

  // Define filteredOptins Array and Chips Array
  filteredOptions: any = [];
  chips: any = [];
  newProject: Boolean = false;
  onAdd = new EventEmitter();

  constructor(
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private companiesService: CompaniesService,
    private contractorsService: ContractorsService,
    private authService: AuthenticationService,
    private projectsService: ProjectsService,
    private formBuilder: FormBuilder
  ) {
    this.contractors$ = this.contractorsService.getData();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectsService.findById(id).subscribe(r => {
        if (r) {
          this.project = r;
          this.projectFormGroup = this.createProjectFormGroup();
        }
      });
    } else {
      this.newProject = true;
      this.project = new Project({
        owner: this.authService.credentials.email,
        laborCostsEnabled: false,
        materialCostsEnabled: true,
        equipmentCostsEnabled: true
      });

      this.projectFormGroup = this.createProjectFormGroup();
    }

    this.contractors$ = this.contractorsService.getData();

    // Subscribe to listen for changes to AutoComplete input and run filter
    this.autoCompleteChipList.valueChanges.subscribe(val => {
      this.filterOptions(val);
    });
  }

  toggleCheckbox(type: string, event: any) {
    switch (type) {
      case 'equipment': {
        this.project.equipmentCostsEnabled = event.checked;
        break;
      }
      case 'labor': {
        this.project.laborCostsEnabled = event.checked;
        break;
      }
      case 'material': {
        this.project.materialCostsEnabled = event.checked;
        break;
      }
      case 'other': {
        this.project.otherCostsEnabled = event.checked;
        break;
      }
      case 'subcontractor': {
        this.project.subcontractorCostsEnabled = event.checked;
        break;
      }
    }
  }

  inputFocus() {
    setTimeout(() => {
      if (!this.autoCompleteTrigger.panelOpen) {
        this.autoCompleteTrigger.openPanel();
      }
    }, 10);
  }

  saveNew() {
    this.onAdd.emit(this.projectFormGroup.value);
  }

  filterOptions(text: string) {
    // Set filteredOptions array to filtered options
    this.filteredOptions = this.options.filter(
      obj => obj.name.toLowerCase().indexOf(text.toString().toLowerCase()) === 0
    );
  }

  addChip(event: MatAutocompleteSelectedEvent, input: any): void {
    // Define selection constant
    const selection = event.option.value;
    // Add chip for selected option
    this.chips.push(selection);
    // Remove selected option from available options and set filteredOptions
    this.options = this.options.filter(obj => obj.name !== selection.name);
    this.filteredOptions = this.options;
    // Reset the autocomplete input text value
    if (input) {
      input.value = '';
    }
  }

  removeChip(chip: any): void {
    // Find key of object in array
    const index = this.chips.indexOf(chip);
    // If key exists
    if (index >= 0) {
      // Remove key from chips array
      this.chips.splice(index, 1);
      // Add key to options array
      this.options.push(chip);
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  createProjectFormGroup() {
    return this.formBuilder.group({
      invitedContractors: new FormControl(this.project.invitedContractors),
      projectInstructions: new FormControl(this.project.details),
      equipmentCostsCheckbox: new FormControl(this.project.equipmentCostsEnabled),
      laborCostsCheckbox: new FormControl(this.project.laborCostsEnabled),
      materialCostsCheckbox: new FormControl(this.project.materialCostsEnabled),
      otherCostsCheckbox: new FormControl(this.project.otherCostsEnabled),
      subcontractorCostsCheckbox: new FormControl(this.project.subcontractorCostsEnabled)
    });
  }
}
