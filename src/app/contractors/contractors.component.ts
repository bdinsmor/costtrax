import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { appAnimations } from '@app/core/animations';

import { ContractorFormComponent } from './contractor-form/contractor-form.component';
import { ContractorsService } from './contractors.service';
import { Contractor, Company } from '@app/shared/model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-contractors',
  templateUrl: './contractors.component.html',
  styleUrls: ['./contractors.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class ContractorsComponent implements OnInit, OnDestroy {
  searchInput: FormControl;
  contractors$: Observable<Contractor[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  dialogRef: any;

  constructor(private contractorsService: ContractorsService, public dialog: MatDialog) {
    this.searchInput = new FormControl('');
  }

  createContractor() {
    this.dialogRef = this.dialog.open(ContractorFormComponent, {
      width: '90vw'
    });
    const sub = this.dialogRef.componentInstance.onAdd.subscribe((data: any) => {
      console.log(data);
    });

    this.dialogRef.afterClosed().subscribe((response: any) => {
      if (!response) {
        return;
      } else {
        console.log('response from popup: ' + JSON.stringify(response, null, 2));
      }
    });
  }

  ngOnInit() {
    this.searchInput.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(searchText => {
        // console.log('searchText: ' + searchText);
        const query = 'name=' + searchText;
        // update service to say filter changed
      });
  }

  ngOnDestroy() {}
}
