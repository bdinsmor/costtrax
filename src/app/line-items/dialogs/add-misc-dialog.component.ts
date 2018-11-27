import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { concat, Observable, of, Subject } from 'rxjs';
import { EquipmentService } from 'src/app/equipment/equipment.service';

import { EmployeeFirstNameFilter, EmployeeLastNameFilter, EmployeeTradeFilter, Equipment } from './../../shared/model';

@Component({
  selector: 'app-add-misc-dialog',
  templateUrl: './add-misc-dialog.component.html',
  styleUrls: ['./add-misc-dialog.component.scss']
})
export class AddMiscDialogComponent implements OnInit {
  lastNameFilter = new EmployeeLastNameFilter();
  firstNameFilter = new EmployeeFirstNameFilter();
  tradeFilter = new EmployeeTradeFilter();
  configurations: any[];
  miscCategoryId: string;
  miscSubtypeId: string;
  miscSizeClass: any;
  miscModelId: string;
  miscModel: string;
  miscEquipment: Equipment;
  selected = [];
  showConfigurations = false;

  categoryResults$: Observable<any>;
  subtypeResults$: Observable<any>;
  sizeResults$: Observable<any>;
  modelResults$: Observable<any>;
  modelInput$ = new Subject<string>();
  modelLoading = false;

  constructor(
    private equipmentService: EquipmentService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.configurations = this.data.configurations;
    this.categorySearch();
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm(configuration: any) {
    this.dialogRef.close({
      success: true,
      configuration: configuration,
      configurations: this.configurations,
      equipment: this.miscEquipment
    });
  }

  categoryChanged() {
    this.miscModel = null;
    this.miscSizeClass = null;
    this.miscModel = null;
    this.miscSubtypeId = null;
    this.configurations = null;
    this.selected = [];
    this.subtypeSearch();
  }

  subtypeChanged() {
    this.miscSizeClass = null;
    this.miscModel = null;
    this.miscModel = null;
    this.configurations = null;
    this.selected = [];
    this.sizeSearch();
  }

  sizeChanged() {
    this.configurations = null;
    this.selected = [];
    this.modelSelected();
  }

  categorySearch() {
    this.categoryResults$ = concat(
      of([]), // default items
      this.equipmentService.getCategories()
    );
  }

  subtypeSearch() {
    this.subtypeResults$ = concat(
      of([]), // default items
      this.equipmentService.getSubtypes(this.miscCategoryId)
    );
  }

  sizeSearch() {
    this.sizeResults$ = concat(
      of([]), // default items
      this.equipmentService.getSizes(this.miscSubtypeId)
    );
  }

  onSubtypeChange() {}

  trackByFn(index: number, item: any) {
    return index; // or item.id
  }

  modelSelected() {
    if (this.miscModelId) {
      this.equipmentService.getModelDetails(this.miscModelId).subscribe(
        (response: any) => {
          this.miscEquipment = response;
          this.miscModel = this.miscEquipment.model;
          this.equipmentService
            .getConfiguration(response.modelId)
            .subscribe((configurations: any) => {
              this.configurations = configurations;
              if (configurations && configurations.values.length === 1) {
                this.selected = configurations.values[0];
                this.confirm(this.selected);
                return;
              } else {
                this.showConfigurations = true;
              }
            });
        },
        (error: any) => {
          console.error('Caught error trying to load misc choice: ' + error);
        }
      );
    }
  }
}
