import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatIconRegistry, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { auditTime } from 'rxjs/operators';

import { Employee } from '../shared/model';
import { appAnimations } from './../core/animations';
import { LaborDeleteDialogComponent } from './labor-delete-dialog.component';
import { LaborService } from './labor.service';

@Component({
  selector: 'app-labor',
  templateUrl: './labor.component.html',
  styleUrls: ['./labor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: appAnimations
})
export class LaborComponent implements OnInit {
  @Input() items: Employee[];
  @Input() projectId: string;
  @Output() changes = new EventEmitter<any>();
  submitRequests: boolean;
  selectedItem: Employee;
  selectedIndex = -1;
  _confirmDeleteModal = false;
  autoSaveEnabled = false;
  laborForm: FormGroup;

  private config: MatSnackBarConfig;
  duration = 3000;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private laborService: LaborService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'duplicate',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../assets/icons/content-duplicate-18.svg'
      )
    );
  }

  ngOnInit() {
    this.buildForm();
    if (!this.items && this.projectId) {
      this.laborService.getRequestorEmployees(this.projectId).subscribe(
        (models: Employee[]) => {
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

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  buildForm() {
    this.laborForm = new FormGroup({
      autoSave: new FormControl(this.autoSaveEnabled)
    });
    this.laborForm.valueChanges
      .pipe(
        auditTime(750),
        untilDestroyed(this)
      )
      .subscribe((formData: any) => {
        this.autoSave(formData.autoSave);
      });
  }

  autoSave(autoSaveValue) {
    //   this.laborService.updateAutoSave(autoSaveValue);
  }

  employeeChanged(item: Employee) {}

  trackByFn(index: number, item: any) {
    return index; // or item.id
  }

  addEmployee() {
    this.items = [...this.items, new Employee({})];
  }

  saveChanges(index: number, item: Employee) {
    if (item.id && item.id !== '') {
      item.status = 'complete';
      this.laborService.updateRequestorEmployee(this.projectId, item).subscribe(
        (response: any) => {
          item.id = response.id;
          item.status = 'complete';
          this.items[index] = new Employee(item);
          this.changeDetector.detectChanges();
          this.openSnackBar('Employee Updated!', 'ok', 'OK');
          this.changes.emit();
        },
        (error: any) => {
          this.openSnackBar('Employee Did Not Save', 'error', 'OK');
        }
      );
    } else {
      item.status = 'complete';
      this.laborService.saveRequestorEmployee(this.projectId, item).subscribe(
        (response: any) => {
          item.id = response.id;
          item.status = 'complete';
          this.items[index] = new Employee(item);
          this.changeDetector.detectChanges();
          this.openSnackBar('Employee Saved!', 'ok', 'OK');
          this.changes.emit();
        },
        (error: any) => {
          this.openSnackBar('Employee Did Not Save', 'error', 'OK');
        }
      );
    }
  }

  editItem(index: number, item: Employee) {
    item.status = 'draft';
  }

  remove(index: number, item: Employee) {
    this.selectedIndex = index;
    this.selectedItem = item;
    if (
      (!this.selectedItem.id || this.selectedItem.id === '') &&
      this.selectedItem.isDraft()
    ) {
      this.items.splice(this.selectedIndex, 1);
      return;
    }
    if (this.selectedItem.id) {
      const dialogRef = this.dialog.open(LaborDeleteDialogComponent, {});

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.success) {
          this.laborService
            .deleteRequestorEmployee(this.projectId, this.selectedItem.id)
            .subscribe(
              (response: any) => {
                this._confirmDeleteModal = false;
                this.items.splice(this.selectedIndex, 1);
                this.changeDetector.detectChanges();
                this.openSnackBar('Employee Removed!', 'ok', 'OK');
                this.changes.emit();
              },
              (error: any) => {
                this.openSnackBar('Employee NOT removed', 'error', 'OK');
              }
            );
          this.changeDetector.detectChanges();
        }
      });
    }
  }

  copy(index: number, item: Employee) {
    const e: Employee = new Employee(item);
    e.status = 'draft';
    e.id = null;
    this.items = [...this.items, e];
  }
}
