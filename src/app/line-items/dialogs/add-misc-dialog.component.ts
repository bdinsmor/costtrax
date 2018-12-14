import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { concat, Observable, of, Subject } from 'rxjs';
import { EquipmentService } from 'src/app/equipment/equipment.service';

import { Equipment } from './../../shared/model';

@Component({
  selector: 'app-add-misc-dialog',
  templateUrl: './add-misc-dialog.component.html',
  styleUrls: ['./add-misc-dialog.component.scss']
})
export class AddMiscDialogComponent implements OnInit {
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

  subtypeSelected() {
    this.selected = [];
    this.equipmentService

      .getConfigurationUsingSubtypeId(this.miscEquipment.subtypeId)
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

  onSubtypeChange() {}

  trackByFn(index: number, item: any) {
    return index; // or item.id
  }
}
