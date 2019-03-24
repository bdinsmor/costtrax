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
  passwordError: string;
  accountForm: FormGroup;
  accountUsers: User[];
  @Output()
  cancel = new EventEmitter();
  @Output()
  save = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    public dialogRef: MatDialogRef<any>
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createAccount() {
    const account: Account = new Account(this.accountForm.value);
    this.accountService.create(account).subscribe((res: any) => {
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
      email: ['', [Validators.required, Validators.email]],
      accountName: ['', Validators.required]
    });
  }
}
