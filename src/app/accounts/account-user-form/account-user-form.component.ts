import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { User } from '../../shared/model';
import { AccountService } from '../accounts.service';

@Component({
  selector: 'app-account-user-form',
  templateUrl: './account-user-form.component.html',
  styleUrls: ['./account-user-form.component.scss']
})
export class AccountUserFormComponent implements OnInit {
  isLoading = false;
  error: string;
  passwordError: string;
  userForm: FormGroup;
  newUser: User = new User({ roles: ['AccountAdmin', 'AccountManager'] });

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    public dialogRef: MatDialogRef<any>
  ) {
    this.createForm();
  }

  ngOnInit() {}

  cancel() {
    this.dialogRef.close();
  }

  addUser() {
    this.newUser.email = this.userForm.value.email;
    this.dialogRef.close({ success: true, user: this.newUser });
  }
  createForm() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
}
