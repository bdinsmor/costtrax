import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Inject, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar, MatInput, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material';

import { Request, Project, Company } from '@app/shared/model';
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
  addItems: FormControl;
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  options: Company[];

  // Define filteredOptins Array and Chips Array
  filteredOptions: any = [];
  chips: any = [];

  constructor(
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private companiesService: CompaniesService,
    private projectsService: ProjectsService,
    private formBuilder: FormBuilder
  ) {
    this.companies$ = this.companiesService.entities$;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectsService.clearCache();
      this.projectsService.getByKey(id);
      this.projectsService.errors$.subscribe(errors => {
        this.openSnackBar(errors.payload.error.message, '');
      });
      this.projectsService.filteredEntities$.subscribe(r => {
        if (r && r.length === 1) {
          this.project = r[0];
          this.openSnackBar('Loaded Project', '');
          this.projectFormGroup = this.createProjectFormGroup();
        }
      });
    } else {
      this.project = new Project({});
    }

    this.companiesService.getAll();

    this.companiesService.entities$.subscribe(c => {
      this.options = c;
      this.filteredOptions = c;
    });

    // Subscribe to listen for changes to AutoComplete input and run filter
    this.autoCompleteChipList.valueChanges.subscribe(val => {
      this.filterOptions(val);
    });
  }

  inputFocus() {
    setTimeout(() => {
      if (!this.autoCompleteTrigger.panelOpen) {
        this.autoCompleteTrigger.openPanel();
      }
    }, 10);
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
      startDate: new FormControl(new Date()),
      endDate: new FormControl(new Date()),
      equipmentCostsCheckbox: new FormControl(false),
      laborCostsCheckbox: new FormControl(false),
      materialCostsCheckbox: new FormControl(false),
      otherCostsCheckbox: new FormControl(false),
      subcontractorCostsCheckbox: new FormControl(false)
    });
  }
}
