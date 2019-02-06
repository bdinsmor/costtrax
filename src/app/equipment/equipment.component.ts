import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';
import { auditTime } from 'rxjs/operators';

import { AuthenticationService } from '../core/authentication/authentication.service';
import { AddMiscDialogComponent } from '../line-items/dialogs/add-misc-dialog.component';
import { ConfigurationDialogComponent } from '../line-items/dialogs/configuration-dialog.component';
import { Equipment } from '../shared/model';
import { appAnimations } from './../core/animations';
import { EquipmentDeleteDialogComponent } from './equipment-delete-dialog.component';
import { EquipmentService } from './equipment.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
  animations: appAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EquipmentComponent implements OnInit, OnDestroy {
  @Input() items: Equipment[];
  @Input() projectId: string;
  @Input() state: string;
  @Input() adjustments: any;
  @Output() changes = new EventEmitter<any>();

  accountSynced = false;

  submitRequests: boolean;
  autoSaveEnabled = false;
  equipmentForm: FormGroup;

  selectedItem: Equipment;
  miscEquipment: Equipment;
  selectedIndex = -1;

  miscCategoryId: string;
  miscSubtypeId: string;
  miscSizeClassId: string;
  miscModelId: string;

  standbyFactor = 0.5;

  _miscModelModal = false;
  showConfigurations = false;
  modelInput$ = new Subject<string>();
  modelLoading = false;
  configurations: any;
  selected: any[];
  private config: MatSnackBarConfig;
  duration = 3000;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private equipmentService: EquipmentService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.buildForm();
    this.authenticationService
      .getCreds()
      .pipe(untilDestroyed(this))
      .subscribe(message => {
        if (message) {
          this.accountSynced =
            message.advantageId && message.advantageId !== '';
        } else {
          this.accountSynced = false;
        }
        this.changeDetector.detectChanges();
      });
    if (!this.items && this.projectId) {
      this.equipmentService.getRequestorModels(this.projectId).subscribe(
        (models: Equipment[]) => {
          this.items = models;
          this.changeDetector.detectChanges();
        },
        (error: any) => {
          console.error(
            'Could not load requestor\'s saved models for this project' + error
          );
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.modelInput$) {
      this.modelInput$.unsubscribe();
    }
  }

  openSnackBar(message: string, type: string = 'ok', action: string = 'ok') {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  buildForm() {
    this.equipmentForm = new FormGroup({
      autoSave: new FormControl(this.autoSaveEnabled)
    });
    this.equipmentForm.valueChanges
      .pipe(
        auditTime(750),
        untilDestroyed(this)
      )
      .subscribe((formData: any) => {
        this.autoSave(formData.autoSave);
      });
  }

  autoSave(autoSaveValue) {
    //   this.equipmentService.updateAutoSave(autoSaveValue);
  }

  modelChanged(item: Equipment) {}

  modelSelected() {
    if (this.miscModelId) {
      this.equipmentService.getModelDetails(this.miscModelId).subscribe(
        (response: any) => {
          this.miscEquipment = response;
          this.equipmentService
            .getConfiguration(response.modelId)
            .subscribe((configurations: any) => {
              this.configurations = configurations;
              if (configurations && configurations.values.length === 1) {
                this.selected = configurations.values[0];
              } else {
                this.showConfigurations = true;
              }
              this.changeDetector.detectChanges();
            });
        },
        (error: any) => {
          console.error('Caught error trying to load misc choice: ' + error);
        }
      );
    }
  }

  makeSelectionChanged(event: any) {
    const item: Equipment = this.items[event.index];
    if (item && event.item) {
      if (event.item) {
        item.makeId = event.item.makeId;
        this.items[event.index] = new Equipment(item);
      } else {
        this.items[event.index] = new Equipment({});
        this.items[event.index].sizeClassName = '';
        this.items[event.index].year = null;
        this.items[event.index].years = null;
        this.items[event.index].modelId = null;
      }
    } else {
      this.items[event.index] = new Equipment({});
      this.items[event.index].sizeClassName = '';
      this.items[event.index].year = null;
      this.items[event.index].years = null;
      this.items[event.index].modelId = null;
    }
  }

  modelSelectionChanged(event: any) {
    const item: Equipment = this.items[event.index];
    const eventItem: Equipment = event.item;

    if (item && eventItem) {
      this.equipmentService
        .getConfiguration(eventItem.modelId)
        .subscribe((configurations: any) => {
          const updatedItem = new Equipment(eventItem);
          updatedItem.id = item.id;
          updatedItem.details.id = item.details.id;
          updatedItem.details.vin = item.details.vin;
          updatedItem.details.configurations = configurations;
          if (configurations && configurations.values.length === 1) {
            updatedItem.details.selectedConfiguration =
              configurations.values[0];
            updatedItem.calculateHourlyRates();
          } else if (configurations && configurations.values.length > 1) {
            this.selectedItem = updatedItem;
            this.selectedIndex = event.index;
          } else {
            updatedItem.resetSelectedConfiguration();
          }
          updatedItem.generateYears();

          this.items[event.index] = updatedItem;
          this.changeDetector.markForCheck();
        });
    } else {
      this.items[event.index].sizeClassName = '';
      this.items[event.index].year = '';
      this.items[event.index].years = null;
      this.items[event.index].modelId = null;
    }
  }

  cancelSelectConfiguration() {}

  confirmSelectConfiguration(sc: any) {
    this.items[this.selectedIndex].details.selectedConfiguration = sc;
    this.items[this.selectedIndex].calculateHourlyRates();
    this.changeDetector.markForCheck();
  }

  addMiscEquipment() {
    const dialogRef = this.dialog.open(AddMiscDialogComponent, {
      width: '80vw',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        if (result.configuration) {
          this.confirmAddMiscModel(
            result.equipment,
            result.configuration,
            result.configurations
          );
        }
      }
    });
  }

  cancelAddMiscModel() {
    this._miscModelModal = false;
  }

  confirmAddMiscModel(equipment: any, sc: any, configs: any) {
    const miscEquipment = new Equipment(equipment);
    miscEquipment.misc = true;
    miscEquipment.status = 'draft';

    if (configs) {
      miscEquipment.details.configurations = configs;
      miscEquipment.details.selectedConfiguration = sc;
      miscEquipment.setDetailsFromConfiguration();
    }

    this.items = [...this.items, miscEquipment];
    this.changeDetector.detectChanges();
    this.miscCategoryId = null;
  }

  yearSelectionChanged(item: Equipment, index: number) {
    if (!item.year || item.year === '') {
      item.details.fhwa = 0;
      item.resetSelectedConfiguration();
      return;
    }

    this.equipmentService
      .getConfiguration(item.modelId, item.year)
      .subscribe((configurations: any) => {
        if (configurations && configurations.values.length > 1) {
          this.selectedItem = item;
          this.selectedIndex = index;
          this.selectedItem.details.configurations = configurations;
          this.selectConfiguration(configurations);
        } else if (configurations && configurations.values.length === 1) {
          const sc = configurations.values[0];

          this.equipmentService
            .getRateDataForConfig(
              sc.configurationId,
              item.year,
              this.state,
              '',
              +(this.adjustments.equipment.active.operating / 100),
              +(this.adjustments.equipment.active.ownership / 100),
              this.standbyFactor
            )
            .subscribe((data: any) => {
              sc.rates = data;
              if (
                this.adjustments.equipment.active.regionalAdjustmentsEnabled
              ) {
                sc.rates.fhwa = +Number(
                  +sc.rates.monthlyOwnershipCostAdjustedRate +
                    +sc.rates.hourlyOperatingCostAdjusted
                ).toFixed(2);
                sc.rates.monthlyOwnershipCostFinal = +Number(
                  +sc.rates.monthlyOwnershipCostAdjusted
                ).toFixed(2);
                sc.rates.weeklyOwnershipCostFinal = +Number(
                  +sc.rates.weeklyOwnershipCostAdjusted
                ).toFixed(2);
                sc.rates.dailyOwnershipCostFinal = +Number(
                  +sc.rates.dailyOwnershipCostAdjusted
                ).toFixed(2);
                sc.rates.hourlyOperatingCostFinal = +Number(
                  +sc.rates.hourlyOperatingCostAdjusted
                ).toFixed(2);
                sc.rates.hourlyOwnershipCostFinal = +Number(
                  +sc.rates.hourlyOwnershipCostAdjusted
                ).toFixed(2);
              } else {
                sc.rates.fhwa = +Number(
                  +sc.rates.monthlyOwnershipCostUnadjustedRate +
                    +sc.rates.hourlyOperatingCostUnadjusted
                ).toFixed(2);
                sc.rates.monthlyOwnershipCostFinal = +Number(
                  +sc.rates.monthlyOwnershipCostUnadjusted
                ).toFixed(2);
                sc.rates.weeklyOwnershipCostFinal = +Number(
                  +sc.rates.monthlyOwnershipCostUnadjusted
                ).toFixed(2);
                sc.rates.dailyOwnershipCostFinal = +Number(
                  +sc.rates.dailyOwnershipCostUnadjusted
                ).toFixed(2);
                sc.rates.hourlyOperatingCostFinal = +Number(
                  +sc.rates.hourlyOperatingCostUnadjusted
                ).toFixed(2);
                sc.rates.hourlyOwnershipCostFinal = +Number(
                  +sc.rates.hourlyOwnershipCostUnadjusted
                ).toFixed(2);
              }
              sc.rates.method = sc.rates.fhwa;
              item.details.selectedConfiguration = sc;
              item.details.configurations = configurations;
              item.beingEdited = true;
              this.changeDetector.detectChanges();
            });
        }
      });
  }

  selectConfiguration(configurations: any[]) {
    const dialogRef = this.dialog.open(ConfigurationDialogComponent, {
      data: {
        configurations: configurations
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        if (result.configuration) {
          const sc = result.configuration;
          this.equipmentService
            .getRateDataForConfig(
              sc.configurationId,
              this.selectedItem.year,
              this.state,
              '',
              +(this.adjustments.equipment.active.operating / 100),
              +(this.adjustments.equipment.active.ownership / 100),
              this.standbyFactor
            )
            .subscribe((data: any) => {
              sc.rates = data;
              if (
                this.adjustments.equipment.active.regionalAdjustmentsEnabled
              ) {
                sc.rates.fhwa = +Number(
                  +sc.rates.monthlyOwnershipCostAdjustedRate +
                    +sc.rates.hourlyOperatingCostAdjusted
                ).toFixed(2);
                sc.rates.monthlyOwnershipCostFinal = +Number(
                  +sc.rates.monthlyOwnershipCostAdjusted
                ).toFixed(2);
                sc.rates.weeklyOwnershipCostFinal = +Number(
                  +sc.rates.weeklyOwnershipCostAdjusted
                ).toFixed(2);
                sc.rates.dailyOwnershipCostFinal = +Number(
                  +sc.rates.dailyOwnershipCostAdjusted
                ).toFixed(2);
                sc.rates.hourlyOperatingCostFinal = +Number(
                  +sc.rates.hourlyOperatingCostAdjusted
                ).toFixed(2);
                sc.rates.hourlyOwnershipCostFinal = +Number(
                  +sc.rates.hourlyOwnershipCostAdjusted
                ).toFixed(2);
              } else {
                sc.rates.fhwa = +Number(
                  +sc.rates.monthlyOwnershipCostUnadjustedRate +
                    +sc.rates.hourlyOperatingCostUnadjusted
                ).toFixed(2);
                sc.rates.monthlyOwnershipCostFinal = +Number(
                  +sc.rates.monthlyOwnershipCostUnadjusted
                ).toFixed(2);
                sc.rates.weeklyOwnershipCostFinal = +Number(
                  +sc.rates.weeklyOwnershipCostUnadjusted
                ).toFixed(2);
                sc.rates.dailyOwnershipCostFinal = +Number(
                  +sc.rates.dailyOwnershipCostUnadjusted
                ).toFixed(2);
                sc.rates.hourlyOperatingCostFinal = +Number(
                  +sc.rates.hourlyOperatingCostUnadjusted
                ).toFixed(2);
                sc.rates.hourlyOwnershipCostFinal = +Number(
                  +sc.rates.hourlyOwnershipCostUnadjusted
                ).toFixed(2);
              }
              sc.rates.method = sc.rates.fhwa;
              this.selectedItem.details.selectedConfiguration = sc;
              this.changeDetector.detectChanges();
            });
        } else {
          this.cancelSelectConfiguration();
        }
      } else {
        this.cancelSelectConfiguration();
      }
    });
  }

  trackByFn(index: number, item: any) {
    return index; // or item.id
  }

  addModel() {
    this.items = [...this.items, new Equipment({})];
  }
  addMisc() {
    this.items = [...this.items, new Equipment({})];
  }

  saveChanges(index: number, item: Equipment) {
    this.equipmentService.saveRequestorModel(this.projectId, item).subscribe(
      (response: any) => {
        if (response && response.id) {
          item.id = response.id;
        }

        item.status = 'complete';
        this.items[index] = new Equipment(item);
        this.changeDetector.detectChanges();
        this.openSnackBar('Model Saved!', 'ok', 'OK');
        this.changes.emit();
      },
      (error: any) => {
        this.openSnackBar('Model Did Not Save', 'error', 'OK');
      }
    );
  }

  editItem(index: number, item: Equipment) {
    item.beingEdited = true;
    if (!item.misc) {
      item.status = 'draft';
      item.revert = new Equipment(item);
    } else {
      this.miscCategoryId = String(item.categoryId);
      this.miscModelId = String(item.modelId);
      this.miscSizeClassId = String(item.sizeClassId);
      this.miscSubtypeId = String(item.subtypeId);
      this._miscModelModal = true;
    }
  }

  revertEdits(index: number, item: Equipment) {
    item = new Equipment(item.revert);
    item.status = 'complete';
    this.items[index] = item;
  }

  confirmRemoveModel() {
    if (!this.selectedItem) {
      return;
    }
    if (
      (!this.selectedItem.id || this.selectedItem.id === '') &&
      this.selectedItem.isDraft()
    ) {
      this.items.splice(this.selectedIndex, 1);

      return;
    }

    if (this.selectedItem.id) {
      const dialogRef = this.dialog.open(EquipmentDeleteDialogComponent, {});

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.success) {
          this.equipmentService
            .deleteRequestorModel(this.projectId, this.selectedItem.id)
            .subscribe(
              (response: any) => {
                this.items.splice(this.selectedIndex, 1);
                this.changeDetector.detectChanges();
                this.openSnackBar('Model Removed!', 'ok', 'OK');
                this.changes.emit();
              },
              (error: any) => {
                this.openSnackBar('Model NOT removed', 'error', 'OK');
              }
            );
          this.changeDetector.detectChanges();
        }
      });
    }
  }

  remove(index: number, item: Equipment) {
    this.selectedIndex = index;
    this.selectedItem = item;
    this.confirmRemoveModel();
  }

  copy(index: number, item: Equipment) {}
}
