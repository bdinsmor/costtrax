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
import { AddModelDialogComponent } from '../line-items/dialogs/add-model-dialog.component';
import { ProjectsService } from '../projects/projects.service';
import { Equipment, Project } from '../shared/model';
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
  project: Project;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private equipmentService: EquipmentService,
    private projectService: ProjectsService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.buildForm();
    this.authenticationService
      .getCreds()
      .pipe(untilDestroyed(this))
      .subscribe(message => {
        if (message) {
          this.accountSynced = message.eqwVerified;
          this.accountSynced = true;
        } else {
          this.accountSynced = false;
        }
        this.changeDetector.detectChanges();
      });
    if (!this.items && this.projectId) {
      this.projectService
        .getProject(this.projectId)
        .pipe(untilDestroyed(this))
        .subscribe((p: Project) => {
          this.project = p;
        });
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
      autoSave: new FormControl({ value: this.autoSaveEnabled, disabled: true })
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

  addModel() {
    const dialogRef = this.dialog.open(AddModelDialogComponent, {
      width: '80vw',
      data: {
        savedAssets: true,
        adjustments: this.project.adjustments
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        if (result.item) {
          this.confirmAddModel(result.item);
        }
      }
    });
  }

  addMiscEquipment() {
    const dialogRef = this.dialog.open(AddMiscDialogComponent, {
      width: '80vw',
      data: {
        savedAssets: true,
        projectId: this.projectId,
        adjustments: this.project.adjustments,
        projectState: this.project.adjustments.rentalLocation.stateCode
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        if (result.item) {
          this.confirmAddModel(result.item);
        }
      }
    });
  }

  confirmAddModel(item: Equipment) {
    // console.log('item to add: ' + JSON.stringify(item, null, 2));
    this.items = [...this.items, item];
    this.changeDetector.detectChanges();
  }

  trackByFn(index: number, item: any) {
    return index; // or item.id
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
    this.items[index] = item;
  }

  confirmRemoveModel() {
    if (!this.selectedItem) {
      return;
    }
    if (!this.selectedItem.id || this.selectedItem.id === '') {
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
