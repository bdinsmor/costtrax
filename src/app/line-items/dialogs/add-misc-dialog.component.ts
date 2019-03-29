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
  state: string;
  zipcode: number;
  requestStartDate: string;
  operatingAdjustment: number;
  ownershipAdjustment: number;
  standbyFactor: number;
  requestId: string;

  constructor(
    private equipmentService: EquipmentService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.standbyFactor = this.data.adjustments.equipmentStandby.standbyFactor;
    if (this.data.itemType === 'equipmentActive') {
      this.operatingAdjustment = this.data.adjustments.equipmentActive.operatingPercent;
      this.ownershipAdjustment = this.data.adjustments.equipmentActive.ownershipPercent;
    } else if (this.data.itemType === 'equipmentStandby') {
      this.operatingAdjustment = this.data.adjustments.equipmentStandby.operatingPercent;
      this.ownershipAdjustment = this.data.adjustments.equipmentStandby.ownershipPercent;
    }
    this.zipcode = this.data.adjustments.rentalLocation.zipcode;
    this.state = this.data.adjustments.rentalLocation.stateCode;
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
      this.equipmentService
        .getRateDataForConfig(
          configuration.modelId,
          configuration.configurationSequence,
          this.item.details.year,
          this.state,
          this.requestStartDate,
          this.operatingAdjustment,
          this.ownershipAdjustment,
          this.standbyFactor
        )
        .subscribe((data: any) => {
          configuration.rates = data;
          Object.assign(this.item.details, configuration);
          if (this.item.type === 'equipmentActive') {
            this.item.details.rate = configuration.rates.fhwaRate;
          } else if (this.item.type === 'equipmentStandby') {
            this.item.details.rate = configuration.rates.standbyRate;
          }
          if (this.configurations) {
            this.item.details.specsColumns = this.configurations.columns;
          } else {
            this.item.details.specsColumns = configuration.columns;
          }
          this.item.details.model = configuration.modelName;
          this.item.details.subSize =
            configuration.subtypeName + ' ' + configuration.sizeClassName;
          this.item.misc = true;

          this.dialogRef.close({
            success: true,
            item: this.item
          });
        });
    } else {
      Object.assign(this.miscEquipment, configuration);
      if (this.configurations) {
        this.miscEquipment.specsColumns = this.configurations.columns;
      } else {
        this.miscEquipment.specsColumns = configuration.columns;
      }
      this.miscEquipment.model = configuration.modelName;
      this.miscEquipment.subSize =
        configuration.subtypeName + ' ' + configuration.sizeClassName;
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
