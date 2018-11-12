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
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { concat, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { AuthenticationService } from '../core/authentication/authentication.service';
import { Equipment } from '../shared/model';
import { appAnimations } from './../core/animations';
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
  @Output() changes = new EventEmitter<any>();

  accountSynced = false;

  _configurationModal = false;
  _confirmDeleteModal = false;

  submitRequests: boolean;

  selectedItem: Equipment;
  miscEquipment: Equipment;
  selectedIndex = -1;

  miscCategoryId: string;
  miscSubtypeId: string;
  miscSizeClassId: string;
  miscModelId: string;

  _miscModelModal = false;
  showConfigurations = false;
  categoryResults$: Observable<any>;
  subtypeResults$: Observable<any>;
  sizeResults$: Observable<any>;
  modelResults$: Observable<any>;
  modelInput$ = new Subject<string>();
  modelLoading = false;
  configurations: any;
  selected: any[];
  private config: MatSnackBarConfig;
  duration = 3000;
  subscription: Subscription;

  constructor(
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private equipmentService: EquipmentService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.authenticationService
      .getCreds()
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
            'Could not load requestor\'s saved models for this project'
          );
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.modelInput$) {
      this.modelInput$.unsubscribe();
    }
  }

  openSnackBar(message: string, type: string = 'ok', action: string = 'ok') {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
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
      }
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
            this._configurationModal = true;
          } else {
            updatedItem.resetSelectedConfiguration();
          }

          this.items[event.index] = updatedItem;
          this.changeDetector.markForCheck();
        });
    }
  }

  cancelSelectConfiguration() {
    this._configurationModal = false;
  }

  confirmSelectConfiguration(sc: any) {
    this._configurationModal = false;
    this.items[this.selectedIndex].details.selectedConfiguration = sc;
    this.items[this.selectedIndex].calculateHourlyRates();
    this.changeDetector.markForCheck();
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
            .getModelsForSizeId(term, this.miscSizeClassId)
            .pipe(
              catchError(() => of([])), // empty list on error
              tap(() => (this.modelLoading = false))
            )
        )
      )
    );
  }

  categoryChanged() {
    this.miscModelId = null;
    this.miscSizeClassId = null;
    this.miscSubtypeId = null;
    this.configurations = null;
    this.selected = [];
    this.subtypeSearch();
    this.changeDetector.detectChanges();
  }

  subtypeChanged() {
    this.miscSizeClassId = null;
    this.miscModelId = null;
    this.configurations = null;
    this.selected = [];
    this.sizeSearch();
    this.changeDetector.detectChanges();
  }

  sizeChanged() {
    this.miscModelId = null;
    this.configurations = null;
    this.selected = [];
    this.modelSearch();
    this.changeDetector.detectChanges();
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

  addMiscEquipment() {
    this._miscModelModal = true;
    this.categorySearch();
    this.sizeSearch();
    this.modelSearch();
    this.subtypeSearch();
  }

  cancelAddMiscModel() {
    this._miscModelModal = false;
  }

  confirmAddMiscModel(sc: any) {
    this._miscModelModal = false;
    this.miscEquipment.misc = true;
    this.miscEquipment.status = 'draft';
    if (this.selected) {
      this.miscEquipment.details.configurations = this.configurations;
      this.miscEquipment.details.selectedConfiguration = sc;
    }
    this.items = [...this.items, this.miscEquipment];
    this.miscCategoryId = null;
    this.categoryChanged();
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
      this._confirmDeleteModal = false;
      return;
    }
    if (
      (!this.selectedItem.id || this.selectedItem.id === '') &&
      this.selectedItem.isDraft()
    ) {
      this.items.splice(this.selectedIndex, 1);
      this._confirmDeleteModal = false;
      return;
    }
    if (this.selectedItem.id) {
      this.equipmentService
        .deleteRequestorModel(this.projectId, this.selectedItem.id)
        .subscribe(
          (response: any) => {
            this._confirmDeleteModal = false;
            this.items.splice(this.selectedIndex, 1);
            this.changeDetector.detectChanges();
            this.openSnackBar('Model Removed!', 'OK', 'OK');
            this.changes.emit();
          },
          (error: any) => {
            this.openSnackBar('Model NOT removed', 'error', 'OK');
          }
        );
      return;
    }
  }

  cancelRemoveModel() {
    this._confirmDeleteModal = false;
  }

  remove(index: number, item: Equipment) {
    this.selectedIndex = index;
    this.selectedItem = item;
    this._confirmDeleteModal = true;
  }

  copy(index: number, item: Equipment) {}
}
