import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { Account, User } from '../../shared/model';
import { AccountService } from '../accounts.service';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {
  isLoading = false;
  error: string;
  accountForm: FormGroup;
  accountUsers: User[];
  account: Account;
  @Output()
  cancel = new EventEmitter();
  @Output()
  save = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    public dialogRef: MatDialogRef<any>
  ) {}

  ngOnInit() {
    this.account = new Account({});
    this.createForm();
  }

  createAccount() {
    this.account.accountName = this.accountForm.value.accountName;
    this.account.organization = this.account.accountName;
    this.accountService.create(this.account).subscribe((res: any) => {
      if (res) {
        this.dialogRef.close({ success: true });
      } else {
        this.dialogRef.close();
      }
    });
  }

  cancelAccount() {
    this.dialogRef.close();
  }

  createForm() {
    this.accountForm = this.formBuilder.group({
      accountName: ['', Validators.required]
    });
  }
}
