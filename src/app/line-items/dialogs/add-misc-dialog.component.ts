import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { concat, Observable, of } from 'rxjs';
import { EquipmentService } from 'src/app/equipment/equipment.service';

import { Equipment, Item } from './../../shared/model';

@Component({
  selector: 'app-add-misc-dialog',
  templateUrl: './add-misc-dialog.component.html',
  styleUrls: ['./add-misc-dialog.component.scss']
})
export class AddMiscDialogComponent implements OnInit, OnDestroy {
  configurations: any;
  miscCategoryId: string;
  miscSubtypeId: string;
  miscSizeClass: any;
  miscModelId: string;
  miscModel: string;
  miscEquipment: Equipment;
  selected = [];
  showConfigurations = false;
  projectState: string;
  categoryResults$: Observable<any>;
  subtypeResults$: Observable<any>;
  loading = false;
  savedAssets = false;
  item: Item;

  constructor(
    private equipmentService: EquipmentService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.savedAssets = this.data.savedAssets;
    if (!this.savedAssets) {
      this.item = new Item({ type: this.data.type });
    } else {
      this.miscEquipment = new Equipment({});
    }

    this.configurations = this.data.configurations;
    this.projectState = this.data.state;
    this.categorySearch();
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm(configuration: any) {
    if (!this.savedAssets) {
      this.item.details.manufacturerName = configuration.manufacturerName;
      this.item.details.manufacturerId = configuration.manufacturerId;
      this.item.details.model = configuration.modelName;
      this.item.details.modelId = configuration.modelId;
      this.item.details.year = configuration.year;
      this.item.details.sizeClassName = configuration.sizeClassName;
      this.item.details.sizeClassId = configuration.sizeClassId;
      this.item.details.subSize =
        configuration.subtypeName + ' ' + configuration.sizeClassName;
      this.item.details.selectedConfiguration = configuration;
      this.item.details.configurations = this.configurations;
      this.item.misc = true;

      this.dialogRef.close({
        success: true,
        item: this.item
      });
    } else {
      this.miscEquipment.manufacturerName = configuration.manufacturerName;
      this.miscEquipment.manufacturerId = configuration.manufacturerId;
      this.miscEquipment.model = configuration.modelName;
      this.miscEquipment.modelId = configuration.modelId;
      this.miscEquipment.year = configuration.year;
      this.miscEquipment.sizeClassName = configuration.sizeClassName;
      this.miscEquipment.sizeClassId = configuration.sizeClassId;
      this.miscEquipment.subSize =
        configuration.subtypeName + ' ' + configuration.sizeClassName;
      this.miscEquipment.selectedConfiguration = configuration;
      this.miscEquipment.configurations = this.configurations;
      this.miscEquipment.misc = true;

      this.dialogRef.close({
        success: true,
        item: this.miscEquipment
      });
    }
  }

  categoryChanged() {
    this.miscEquipment = null;
    this.configurations = null;
    this.selected = [];
    this.subtypeSearch();
    this.loading = false;
  }

  subtypeSelected() {
    this.selected = [];
    this.loading = true;

    this.equipmentService

      .getConfigurationUsingSubtypeId(
        this.miscEquipment.subtypeId,
        this.projectState
      )
      .pipe(untilDestroyed(this))
      .subscribe(
        (configurations: any) => {
          this.configurations = configurations;

          if (configurations && configurations.count === 1) {
            this.selected = configurations.results[0];
            this.confirm(this.selected);
            return;
          } else {
            this.showConfigurations = true;
            this.loading = false;
          }
        },
        (err: Error) => {
          this.loading = false;
        }
      );
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
