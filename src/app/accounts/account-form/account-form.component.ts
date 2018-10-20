import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Account } from '../../shared/model';

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
  @Output()
  cancel = new EventEmitter();
  @Output()
  save = new EventEmitter();
  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {}

  createAccount() {
    const account: Account = new Account(this.accountForm.value);
    this.save.emit(account);
  }

  createForm() {
    this.accountForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      accountName: ['', Validators.required]
    });
  }
}
