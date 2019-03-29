import { state } from '@angular/animations';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { EquipmentService } from 'src/app/equipment/equipment.service';

import { Equipment, Item } from './../../shared/model';

@Component({
  selector: 'app-add-model-dialog',
  templateUrl: './add-model-dialog.component.html',
  styleUrls: ['./add-model-dialog.component.scss']
})
export class AddModelDialogComponent implements OnInit, OnDestroy {
  configurations: any;
  item: Item;
  selected = [];
  showConfigurations = false;
  projectState: string;
  modelResults$: Observable<any>;
  manufacturerResults$: Observable<any>;
  loading = false;
  modelForm: FormGroup;
  state: string;
  zipcode: number;
  requestStartDate: string;
  operatingAdjustment: number;
  ownershipAdjustment: number;
  standbyFactor: number;
  requestId: string;
  manufacturerLoading = false;
  manufacturerInput$ = new Subject<string>();
  modelLoading = false;
  modelInput$ = new Subject<string>();
  savedAssets = false;
  equipment: Equipment;
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
    if (this.savedAssets) {
      this.equipment = new Equipment({});
      this.modelForm = new FormGroup({
        model: new FormControl(this.equipment.modelId, Validators.required),
        manufacturer: new FormControl(
          this.equipment.manufacturerId,
          Validators.required
        ),
        year: new FormControl(this.equipment.year, Validators.required)
      });
      this.modelForm.get('model').valueChanges.subscribe(val => {
        this.equipment.manufacturerId = this.modelForm.value.manufacturer;
        this.equipment.years = val.years;
        this.equipment.sizeClassId = val.sizeClassId;
        this.equipment.sizeClassName = val.sizeClassName;
        this.equipment.subtypeName = val.subtypeName;
        this.equipment.subSize = val.subSize;
        this.equipment.year = val.year;
        this.equipment.subtypeId = val.subtypeId;
        this.equipment.classificationId = val.classificationId;
        this.equipment.classificationName = val.classificationName;
        this.equipment.display = val.display;

        this.equipment.description = val.description;
        this.equipment.subtypeName = val.subtypeName;
        this.equipment.subtypeId = val.subtypeId;
        this.equipment.categoryId = val.categoryId;
        this.equipment.categoryName = val.categoryName;
        this.equipment.manufacturerName = val.manufacturerName;
        this.equipment.model = val.model;
        this.equipment.modelId = val.modelId;
        this.equipment.dateIntroduced = val.dateIntroduced;
        this.equipment.dateDiscontinued = val.dateDiscontinued;
      });
      this.modelForm.get('year').valueChanges.subscribe(val => {
        this.equipment.year = val;
        this.yearSelectionChanged();
      });
    } else {
      this.item = new Item({ type: this.data.itemType });
      this.modelForm = new FormGroup({
        model: new FormControl(this.item.details.modelId, Validators.required),
        manufacturer: new FormControl(
          this.item.details.manufacturerId,
          Validators.required
        ),
        year: new FormControl(this.item.details.year, Validators.required)
      });
      this.modelForm.get('model').valueChanges.subscribe(val => {
        if (!val) {
          return;
        }
        this.item.details.manufacturerId = this.modelForm.value.manufacturer;
        this.item.details.years = val.years;
        this.item.details.sizeClassId = val.sizeClassId;
        this.item.details.sizeClassName = val.sizeClassName;
        this.item.details.subtypeName = val.subtypeName;
        this.item.details.subSize = val.subSize;
        this.item.details.year = val.year;
        this.item.details.subtypeId = val.subtypeId;
        this.item.details.classificationId = val.classificationId;
        this.item.details.classificationName = val.classificationName;
        this.item.details.display = val.display;

        this.item.details.description = val.description;
        this.item.details.subtypeName = val.subtypeName;
        this.item.details.subtypeId = val.subtypeId;
        this.item.details.categoryId = val.categoryId;
        this.item.details.categoryName = val.categoryName;
        this.item.details.manufacturerName = val.manufacturerName;
        this.item.details.model = val.model;
        this.item.details.modelId = val.modelId;
        this.item.details.dateIntroduced = val.dateIntroduced;
        this.item.details.dateDiscontinued = val.dateDiscontinued;
      });
      this.modelForm.get('year').valueChanges.subscribe(val => {
        if (!val) {
          this.configurations = null;
          return;
        }
        this.item.details.year = val;
        this.yearSelectionChanged();
      });
    }

    this.configurations = this.data.configurations;

    this.manufacturerSearch();
    this.modelSearch();
  }

  onMakeClear() {
    this.makeRemove(null);
  }

  onModelClear() {
    this.modelRemove(null);
  }

  onYearClear() {
    this.yearRemove(null);
  }

  makeRemove(event) {
    this.modelForm.reset();
    this.configurations = null;
  }

  modelRemove(event) {
    this.modelForm.get('year').patchValue(null);
    this.configurations = null;
  }

  yearRemove(event) {
    this.modelForm.get('year').patchValue(null);
    this.configurations = null;
  }

  yearDisabled() {
    return (
      !this.modelForm.value.model ||
      this.modelForm.value.model === '' ||
      !this.modelForm.value.manufactuer ||
      this.modelForm.value.manufactuer === ''
    );
  }

  modelDisabled() {
    return (
      !this.modelForm.value.manufactuer ||
      this.modelForm.value.manufactuer === ''
    );
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm(configuration: any) {
    if (!this.savedAssets) {
      if (!configuration.rates) {
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
            this.item.buildSpecs();
            this.dialogRef.close({
              success: true,
              item: this.item
            });
          });
      } else {
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
        this.item.buildSpecs();
        this.dialogRef.close({
          success: true,
          item: this.item
        });
      }
    } else {
      Object.assign(this.equipment, configuration);
      if (this.configurations) {
        this.equipment.specsColumns = this.configurations.columns;
      } else {
        this.equipment.specsColumns = configuration.columns;
      }

      // this.equipment.configurations = this.configurations;
      this.dialogRef.close({
        success: true,
        item: this.equipment
      });
    }
  }

  manufacturerChanged() {
    this.modelForm.reset();
    this.configurations = null;
    this.selected = [];
    this.loading = false;
  }

  yearSelectionChanged() {
    if (!this.savedAssets) {
      this.equipmentService
        .getConfiguration(
          this.item.details.modelId,
          this.item.details.year,
          this.state,
          this.requestStartDate
        )
        .subscribe((configurations: any) => {
          this.item.details.nodata = false;

          if (configurations && configurations.count > 1) {
            this.configurations = configurations;
            return;
          } else if (configurations && configurations.count === 1) {
            const sc = configurations.results[0];
            //  this.item.details.configurations = configurations;
            this.equipmentService
              .getRateDataForConfig(
                sc.modelId,
                sc.configurationSequence,
                this.item.details.year,
                this.state,
                this.requestStartDate,
                this.operatingAdjustment,
                this.ownershipAdjustment,
                this.standbyFactor
              )
              .subscribe((data: any) => {
                sc.rates = data;

                this.confirm(sc);
              });
          } else {
            this.item.details.nodata = true;
            this.item.details.rate = 0;
            this.item.beingEdited = true;
          }
        });
    } else {
      this.equipmentService
        .getConfiguration(
          this.equipment.modelId,
          this.equipment.year,
          this.state,
          null
        )
        .subscribe((configurations: any) => {
          this.configurations = configurations;
          if (configurations && configurations.count > 1) {
            this.configurations = configurations;
            return;
          } else if (configurations && configurations.count === 1) {
            const sc = configurations.results[0];
            //  this.equipment.configurations = configurations;
            this.confirm(sc);
          }
        });
    }
  }

  manufacturerSearch() {
    this.manufacturerResults$ = concat(
      of([]), // default items
      this.manufacturerInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.manufacturerLoading = true)),
        switchMap((term: string) =>
          this.equipmentService.getMakes(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.manufacturerLoading = false))
          )
        )
      )
    );
  }

  modelSearch() {
    this.modelResults$ = concat(
      of([]), // default items
      this.modelInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.modelLoading = true)),
        switchMap((term: string) =>
          this.equipmentService
            .getModels(term, this.modelForm.value.manufacturer)
            .pipe(
              catchError(() => of([])), // empty list on error
              tap(() => (this.modelLoading = false))
            )
        )
      )
    );
  }

  trackByFn(index: number, item: any) {
    return index; // or this.item.id
  }
}
