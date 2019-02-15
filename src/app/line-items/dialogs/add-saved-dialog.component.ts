import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

import { LaborService } from '../../labor/labor.service';
import { Employee, Equipment } from '../../shared/model';
import { EquipmentService } from './../../equipment/equipment.service';

@Component({
  selector: 'app-add-saved-dialog',
  templateUrl: './add-saved-dialog.component.html',
  styleUrls: ['./add-saved-dialog.component.scss']
})
export class AddSavedDialogComponent implements OnInit, OnDestroy {
  type: string;
  projectId: string;
  models: Observable<Equipment[]>;
  employees: Observable<Employee[]>;
  selected = [];
  constructor(
    private laborService: LaborService,
    private equipmentService: EquipmentService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.type = this.data.type;
    this.projectId = this.data.projectId;

    if (this.type !== 'labor') {
      this.models = this.equipmentService.getRequestorModels(this.projectId);
    } else {
      this.employees = this.laborService.getRequestorEmployees(this.projectId);
    }
  }

  ngOnDestroy() {}

  trackByFn(index: number, item: any) {
    return index;
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm(configuration: any) {
    this.dialogRef.close({
      success: true,
      selected: this.selected
    });
  }
}
