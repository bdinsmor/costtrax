import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Item } from 'src/app/shared/model';

@Component({
  selector: 'app-line-item-mail-dialog',
  templateUrl: './mail-dialog.component.html',
  styleUrls: ['./mail-dialog.component.scss']
})
export class LineItemMailDialogComponent implements OnInit {
  selectedItem: Item;
  mailFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.selectedItem = this.data.selectedItem;
    this.createMailForm();
  }

  createMailForm() {
    let text = '';
    text = '';
    this.mailFormGroup = new FormGroup({
      emailAddress: new FormControl('', Validators.required),
      body: new FormControl(text, Validators.required)
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({ success: true, form: this.mailFormGroup.value });
  }
}
