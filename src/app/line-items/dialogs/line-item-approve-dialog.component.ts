import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Item } from 'src/app/shared/model';

@Component({
  selector: 'app-line-item-approve-dialog',
  templateUrl: './line-item-approve-dialog.component.html',
  styleUrls: ['./line-item-approve-dialog.component.scss']
})
export class LineItemApproveDialogComponent implements OnInit {
  selectedItem: Item;
  modalType: string;
  modalSubmitLabel: string;
  modalTitle: string;
  changeFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.selectedItem = this.data.selectedItem;
    this.modalType = this.data.modalType;
    this.modalSubmitLabel = this.data.modalSubmitLabel;
    this.modalTitle = this.data.modalTitle;
    this.createApprovalForm();
  }

  createApprovalForm() {
    this.changeFormGroup = new FormGroup({
      reasonControl: new FormControl('', Validators.required),
      ammountControl: new FormControl(
        this.selectedItem.details.amount,
        Validators.required
      )
    });
  }

  get amountChanged() {
    return +this.selectedItem.finalAmount - +this.selectedItem.amount;
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    if (this.modalType === 'ApprovedWithChange') {
      const changes = {
        finalAmount: this.selectedItem.finalAmount,
        changeReason: this.changeFormGroup.value.reasonControl
      };
      this.dialogRef.close({ success: true, changes: changes });
    } else {
      this.dialogRef.close({ success: true });
    }
  }
}
