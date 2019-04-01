import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/ngx-bootstrap-datepicker';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { appAnimations } from '../../core/animations';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { BreadcrumbService } from '../../core/breadcrumbs/breadcrumbs.service';
import { EquipmentService } from '../../equipment/equipment.service';
import { ProjectsService } from '../../projects/projects.service';
import {
  Equipment,
  Item,
  ItemList,
  Project,
  Request
} from '../../shared/model';
import { RequestDeleteDialogComponent } from '../dialogs/request-delete-dialog.component';
import { RequestRecapitulationDialogComponent } from '../dialogs/request-recapitulation-dialog.component';
import { RequestRejectDialogComponent } from '../dialogs/request-reject-dialog.component';
import { RequestReworkDialogComponent } from '../dialogs/request-rework-dialog.component';
import { RequestSubmitDialogComponent } from '../dialogs/request-submit-dialog.component';
import { RequestsService } from '../requests.service';
import { RequestApproveDialogComponent } from './../dialogs/request-approve-dialog.component';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: appAnimations
})
export class RequestDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
  private config: MatSnackBarConfig;
  shrinkToolbar = false;
  duration = 3000;
  requestFormGroup: FormGroup;
  signatureFormGroup: FormGroup;
  lineItemFormGroup: FormGroup;
  notesFormGroup: FormGroup;
  accountSynced = false;
  request: Request;
  lineItems: Map<String, Item[]>;
  selectedItems: Item[];
  selectedItemType: string;

  canManageRequest = false;
  canSubmitRequest = false;
  canManageProject = false;
  editMode = false;
  printingInvoice = false;
  projectChoices: Observable<Project[]>;
  projectChoice: string;
  itemTypes: any[];
  machineChoices: Equipment[];
  machineChoice: string;

  colorTheme = 'theme-dark-blue';

  bsConfig: Partial<BsDatepickerConfig>;

  SHRINK_TOP_SCROLL_POSITION = 250;
  constructor(
    private titleService: Title,
    public dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService,
    private projectsService: ProjectsService,
    private equipmentService: EquipmentService,
    private authenticationService: AuthenticationService,
    private breadcrumbService: BreadcrumbService,
    private _location: Location,
    private scrollDispatcher: ScrollDispatcher,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {}

  ngAfterContentInit(): void {}

  ngOnInit() {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    this.requestFormGroup = new FormGroup({
      selectedProjectControl: new FormControl(''),
      notes: new FormControl('')
    });

    this.authenticationService
      .getCreds()
      .pipe(untilDestroyed(this))
      .subscribe(message => {
        if (message) {
          this.accountSynced = message.eqwVerified;
        } else {
          this.accountSynced = false;
        }
        this.changeDetector.detectChanges();
      });

    this.signatureFormGroup = new FormGroup({
      signature: new FormControl('')
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestsService.getRequest(id).subscribe(
        (r: Request) => {
          this.request = r;
          this.notesFormGroup = this.formBuilder.group({
            notes: new FormControl(r.notes),
            dateRange: new FormControl(r.dateRange, Validators.required)
          });
          this.titleService.setTitle(
            'Request ' + r.oneUp + ': ' + r.projectName
          );
          this.breadcrumbService.addProject(r.projectId, r.projectName);
          this.breadcrumbService.addRequest(r.id, r.oneUp);
          this.checkPermissions();
          this.buildItemTypes();
          this.changeDetector.detectChanges();
        },
        err => {}
      );
    }
  }

  getScrollPosition(event) {
    return window.scrollY ? window.scrollY : window.pageYOffset;
  }

  ngOnDestroy(): void {}

  approveAll(event) {}

  checkPermissions() {
    let scrollAdded = false;
    this.canManageRequest = false;
    this.canSubmitRequest = false;
    this.canManageProject = false;
    if (!this.request.projectRoles) {
      return;
    }
    for (let i = 0; i < this.request.projectRoles.length; i++) {
      const role = this.request.projectRoles[i];
      if (role === 'ProjectApprover') {
        this.canManageRequest = true;
        if (!scrollAdded && this.request.isComplete()) {
          scrollAdded = true;
          this.scrollDispatcher
            .scrolled()
            .pipe(map((event: CdkScrollable) => this.getScrollPosition(event)))
            .subscribe(scrollTop =>
              this.ngZone.run(() => {
                if (this.shrinkToolbar) {
                  this.SHRINK_TOP_SCROLL_POSITION = 50;
                } else {
                  this.SHRINK_TOP_SCROLL_POSITION = 250;
                }
                this.shrinkToolbar =
                  scrollTop > this.SHRINK_TOP_SCROLL_POSITION ? true : false;

                this.changeDetector.detectChanges();
              })
            );
        }
      }
      if (role === 'ProjectRequestor') {
        this.canSubmitRequest = true;
      }
      if (role === 'ProjectManager') {
        this.canManageProject = true;
        if (!scrollAdded && this.request.isComplete()) {
          scrollAdded = true;
          this.scrollDispatcher
            .scrolled()
            .pipe(map((event: CdkScrollable) => this.getScrollPosition(event)))
            .subscribe(scrollTop =>
              this.ngZone.run(() => {
                if (this.shrinkToolbar) {
                  this.SHRINK_TOP_SCROLL_POSITION = 50;
                } else {
                  this.SHRINK_TOP_SCROLL_POSITION = 250;
                }
                this.shrinkToolbar =
                  scrollTop > this.SHRINK_TOP_SCROLL_POSITION ? true : false;
                this.changeDetector.detectChanges();
              })
            );
        }
      }
    }
  }

  notesChanged() {}

  exportRecapitulation() {
    this.requestsService
      .export(this.request.projectId, this.request.projectName, [
        this.request.id
      ])
      .subscribe((response: any) => {});
  }

  viewRecapitulation() {
    const dialogRef = this.dialog.open(RequestRecapitulationDialogComponent, {
      width: '95vw',
      data: { request: this.request }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  cancelRequest() {
    const dialogRef = this.dialog.open(RequestDeleteDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        if (this.request.id && this.request.id !== '') {
          this.requestsService
            .deleteRequest(this.request.id)
            .subscribe((response: any) => {
              this.openSnackBar('Request Deleted!', 'OK', 'OK');
              this._location.back();
            });
        } else {
          this.router.navigate(['/home']);
        }
      }
    });
  }

  deleteRequest() {
    this.cancelRequest();
  }

  saveRequest() {
    if (
      this.request.id &&
      this.request.id !== '' &&
      (this.notesFormGroup && !this.notesFormGroup.hasError('notValid'))
    ) {
      this.request.notes = this.notesFormGroup.value.notes;
      this.request.startDate = new Date(this.notesFormGroup.value.dateRange[0]);
      this.request.endDate = new Date(this.notesFormGroup.value.dateRange[1]);

      const data = {
        meta: {
          notes: this.notesFormGroup.value.notes
        },
        lineItems: this.request.buildLineItemsToSave()
      };

      this.requestsService.update(this.request.id, data).subscribe(
        (response: any) => {
          this.openSnackBar('Request Saved', 'ok', 'OK');
        },
        (error: any) => {
          this.openSnackBar('Request Did Not Save', 'error', 'OK');
        }
      );
    }
  }

  submitRequest() {
    const dialogRef = this.dialog.open(RequestSubmitDialogComponent, {
      width: '40vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.requestsService
          .submitRequest(this.request.id, result.signature)
          .subscribe(
            (response: any) => {
              this.openSnackBar('Request Submitted', 'ok', 'OK');
              if (this.request.projectId) {
                this.router.navigate(['../projects', this.request.projectId]);
              } else {
                this.router.navigate(['../home']);
              }
            },
            (error: any) => {
              this.openSnackBar('Request Did Not Submit', 'error', 'OK');
            }
          );
      }
    });
  }

  compareByValue(c1: Project, c2: Project): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  customSearchFn(term: string, item: Equipment) {
    term = term.toLocaleLowerCase();
    return (
      item.description.toLocaleLowerCase().indexOf(term) > -1 ||
      item.vin.toLocaleLowerCase() === term ||
      item.model.toLocaleLowerCase() === term ||
      item.manufacturerName.toLocaleLowerCase() === term
    );
  }
  removeLineItem() {}

  buildItemTypes() {
    this.itemTypes = [];
    if (!this.request.adjustments) {
      return;
    }
    if (this.request.adjustments.labor.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        { value: 'labor', label: 'Labor', sortOrder: 0 }
      ];
    }
    if (this.request.adjustments.equipmentActive.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        {
          value: 'equipmentActive',
          label: 'Equipment|Active',
          sortOrder: 1
        }
      ];
    }
    if (this.request.adjustments.equipmentStandby.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        {
          value: 'equipmentStandby',
          label: 'Equipment|Standby',
          sortOrder: 2
        }
      ];
    }
    if (this.request.adjustments.equipmentRental.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        {
          value: 'equipmentRental',
          label: 'Equipment|Rental',
          sortOrder: 3
        }
      ];
    }

    if (this.request.adjustments.material.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        { value: 'material', label: 'Material', sortOrder: 4 }
      ];
    }
    if (this.request.adjustments.other.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        { value: 'other', label: 'Other', sortOrder: 6 }
      ];
    }
    if (this.request.adjustments.subcontractor.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        { value: 'subcontractor', label: 'Subcontractor', sortOrder: 5 }
      ];
    }

    const itemTypeList: ItemList[] = [];
    for (let i = 0; i < this.itemTypes.length; i++) {
      const t = this.itemTypes[i];
      const items: Item[] = this.request.getItemsForType(t.value);
      if (
        this.canSubmitRequest ||
        ((this.canManageProject || this.canManageRequest) &&
          items &&
          items.length > 0)
      ) {
        const il = new ItemList(t.value, items);
        itemTypeList.push(il);
      }
    }
    this.request.itemsByType = itemTypeList;
    this.changeDetector.detectChanges();
  }

  refreshRequest() {
    this.requestsService.getRequest(this.request.id).subscribe(
      (r: Request) => {
        this.request = r;
        this.checkPermissions();
        this.buildItemTypes();
        this.changeDetector.detectChanges();
      },
      err => {}
    );
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  itemsChanged(event: any) {}

  reworkRequest() {
    const dialogRef = this.dialog.open(RequestReworkDialogComponent, {
      width: '50vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.requestsService.rework(this.request.id).subscribe(
          (response: any) => {
            this.openSnackBar('Request Returned to Draft', 'ok', 'OK');
            this.router.navigate(['../projects', this.request.projectId]);
          },
          err => {
            this.openSnackBar(
              'An error occurred trying to re-work request',
              'ok',
              'OK'
            );
          }
        );
        this.changeDetector.detectChanges();
      }
    });
  }
  rejectRequest() {
    const dialogRef = this.dialog.open(RequestRejectDialogComponent, {
      width: '50vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.requestsService.reject(this.request.id).subscribe(
          (response: any) => {
            this.openSnackBar('Request Rejected', 'ok', 'OK');
            this.refreshRequest();
          },
          err => {
            this.openSnackBar(
              'An error occurred trying to reject request',
              'ok',
              'OK'
            );
          }
        );
        this.changeDetector.detectChanges();
      }
    });
  }

  approveRequest() {
    const dialogRef = this.dialog.open(RequestApproveDialogComponent, {
      data: {
        approveAll: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const data = {
        meta: {
          notes: this.notesFormGroup.value.notes
        },
        lineItems: this.request.buildLineItemsToApprove()
      };
      if (result && result.success) {
        this.requestsService.approve(this.request.id, data).subscribe(
          (response: any) => {
            this.openSnackBar('Request Approved', 'ok', 'OK');
            this.refreshRequest();
          },
          err => {
            this.openSnackBar(
              'An error occurred trying to approve request',
              'ok',
              'OK'
            );
          }
        );
        this.changeDetector.detectChanges();
      }
    });
  }
}
