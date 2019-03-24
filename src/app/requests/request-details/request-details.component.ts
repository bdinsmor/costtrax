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
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/ngx-bootstrap-datepicker';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';

import { appAnimations } from '../../core/animations';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { BreadcrumbService } from '../../core/breadcrumbs/breadcrumbs.service';
import { EquipmentService } from '../../equipment/equipment.service';
import { ProjectsService } from '../../projects/projects.service';
import { Equipment, Item, ItemList, Project, Request } from '../../shared/model';
import { RequestDeleteDialogComponent } from '../dialogs/request-delete-dialog.component';
import { RequestRecapitulationDialogComponent } from '../dialogs/request-recapitulation-dialog.component';
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
  project: Project;
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
          this.accountSynced =
            message.advantageId && message.advantageId !== '';
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
          this.projectsService
            .getProject(r.projectId)
            .subscribe((p: Project) => {
              this.project = p;
              r.project = p;
              this.request = r;
              this.request.calculateTotals();
              this.editMode = false;
              this.notesFormGroup = this.formBuilder.group({
                notes: new FormControl(r.notes),
                dateRange: new FormControl(r.dateRange, Validators.required)
              });

              this.notesFormGroup.valueChanges
                .pipe(auditTime(750))
                .subscribe((formData: any) => {
                  this.save(formData.notes, formData.dateRange);
                });
              this.titleService.setTitle('Request ' + r.oneUp + ': ' + p.name);
              this.breadcrumbService.addProject(p.id, p.name);
              this.breadcrumbService.addRequest(r.id, r.oneUp);
              this.checkPermissions();
              this.buildItemTypes();
              this.changeDetector.detectChanges();
            });
        },
        err => {}
      );
    } else {
      this.request = new Request({});
      this.breadcrumbService.addHome();
      this.request.status = 'DRAFT';
      this.notesFormGroup = new FormGroup({
        notes: new FormControl('')
      });
      this.projectChoices = this.projectsService.getProjectsForRequests();
      this.projectsService
        .getProjectsForRequests()
        .subscribe((projects: Project[]) => {
          if (
            this.route.snapshot.queryParams.projectId &&
            this.route.snapshot.queryParams.projectId !== ''
          ) {
            this.projectsService
              .getProject(this.route.snapshot.queryParams.projectId)
              .subscribe((p: Project) => {
                this.project = p;
                this.request.project = p;
                this.breadcrumbService.addProject(p.id, p.name);
                this.breadcrumbService.addNewRequest();
                this.checkPermissions();
                this.buildItemTypes();
                this.requestFormGroup = new FormGroup({
                  selectedProjectControl: new FormControl(
                    this.findSelectedProject(projects, p)
                  )
                });

                this.requestsService
                  .grabRequestId(p.id)
                  .subscribe((data: any) => {
                    this.request.id = data.id;
                  });
                this.changeDetector.detectChanges();
              });
          } else {
            this.breadcrumbService.addNewRequest();
            this.changeDetector.detectChanges();
          }
        });

      this.editMode = true;
    }
  }

  getScrollPosition(event) {
    return window.scrollY ? window.scrollY : window.pageYOffset;
  }

  ngOnDestroy(): void {}

  findSelectedProject(projects: Project[], project: Project) {
    for (let i = 0; i < projects.length; i++) {
      if (project.id === projects[i].id) {
        return projects[i];
      }
    }
    return '';
  }
  checkPermissions() {
    let scrollAdded = false;
    this.canManageRequest = false;
    this.canSubmitRequest = false;
    this.canManageProject = false;
    if (!this.project) {
      return;
    }
    for (let i = 0; i < this.project.roles.length; i++) {
      const role = this.project.roles[i];
      if (role === 'RequestManage') {
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
      if (role === 'RequestSubmit') {
        this.canSubmitRequest = true;
      }
      if (role === 'ProjectAdmin') {
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

  getRequestId() {
    this.requestsService
      .grabRequestId(this.project.id)
      .subscribe((data: any) => {
        this.request.id = data.id;
      });
  }

  notesChanged() {}

  exportRecapitulation() {
    this.requestsService
      .export(this.project.id, this.project.name, [this.request.id])
      .subscribe((response: any) => {});
  }

  viewRecapitulation() {
    const dialogRef = this.dialog.open(RequestRecapitulationDialogComponent, {
      width: '95vw',
      data: { project: this.project, request: this.request }
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
      this.requestsService.update(this.request).subscribe(
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
    console.log('items: ' + JSON.stringify(this.request.itemsByType, null, 2));
  }
  /*
  submitRequest() {
    const dialogRef = this.dialog.open(RequestSubmitDialogComponent, {
      width: '40vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.requestsService
          .submitRequest(
            this.request.id,
            this.notesFormGroup.value.notes,
            result.signature
          )
          .subscribe(
            (response: any) => {
              this.openSnackBar('Request Submitted', 'ok', 'OK');
              if (this.project) {
                this.router.navigate(['../projects', this.project.id]);
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

  */

  save(notesValue, dateRange) {
    if (
      this.request.id &&
      this.request.id !== '' &&
      (this.notesFormGroup && !this.notesFormGroup.hasError('notValid'))
    ) {
      this.request.notes = notesValue;
      this.request.startDate = new Date(dateRange[0]);
      this.request.endDate = new Date(dateRange[1]);
      this.requestsService.update(this.request).subscribe((response: any) => {
        if (this.request.status !== 'PENDING') {
          this.equipmentService.sendDateChangeNotification();
        }
      });
    } else {
    }
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
      item.make.toLocaleLowerCase() === term
    );
  }
  removeLineItem() {
    this.request.calculateTotals();
  }

  onProjectChange(event: any) {
    this.project = this.requestFormGroup.get('selectedProjectControl')
      .value as Project;

    if (!this.project) {
      this.request.itemsByType = [];
      this.request.items = [];
      this.buildItemTypes();
      this.changeDetector.detectChanges();
      return;
    }
    this.checkPermissions();
    this.request = new Request({});

    this.request.status = 'DRAFT';

    this.requestsService
      .grabRequestId(this.project.id)
      .subscribe((data: any) => {
        this.request.id = data.id;
        this.request.itemsByType = [];
        this.request.items = [];
        this.buildItemTypes();
        this.changeDetector.detectChanges();
      });
  }

  buildItemTypes() {
    this.itemTypes = [];
    if (!this.project) {
      return;
    }
    if (this.project.adjustments.labor.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        { value: 'labor', label: 'Labor', sortOrder: 0 }
      ];
    }
    if (this.project.adjustments.equipment.active.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        {
          value: 'equipment.active',
          label: 'Equipment|Active',
          sortOrder: 1
        }
      ];
    }
    if (this.project.adjustments.equipment.standby.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        {
          value: 'equipment.standby',
          label: 'Equipment|Standby',
          sortOrder: 2
        }
      ];
    }
    if (this.project.adjustments.equipment.rental.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        {
          value: 'equipment.rental',
          label: 'Equipment|Rental',
          sortOrder: 3
        }
      ];
    }

    if (this.project.adjustments.material.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        { value: 'material', label: 'Material', sortOrder: 4 }
      ];
    }
    if (this.project.adjustments.other.enabled) {
      this.itemTypes = [
        ...this.itemTypes,
        { value: 'other', label: 'Other', sortOrder: 6 }
      ];
    }
    if (this.project.adjustments.subcontractor.enabled) {
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
        this.projectsService
          .getProject(this.request.projectId)
          .subscribe((p: Project) => {
            this.project = p;
            r.project = p;
            this.request = r;
            this.request.calculateTotals();
            this.checkPermissions();
            this.buildItemTypes();
            this.changeDetector.detectChanges();
          });
      },
      err => {}
    );
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  itemsChanged(event: any) {
    this.request.calculateTotals();
  }

  approveRequest() {
    const dialogRef = this.dialog.open(RequestApproveDialogComponent, {
      data: {
        approveAll: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.requestsService.approve(this.request.id).subscribe(
          (response: any) => {
            this.openSnackBar(' Request Approved', 'ok', 'OK');
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

  approveAll(event: any) {
    this.selectedItems = [];

    this.selectedItemType = event.itemType;
    for (let i = 0; i < this.request.itemsByType.length; i++) {
      const lit: ItemList = this.request.itemsByType[i];

      if (lit.type === event.itemType) {
        this.selectedItems = lit.items;
        break;
      }
    }
    if (this.selectedItems && this.selectedItems.length > 0) {
      const dialogRef = this.dialog.open(RequestApproveDialogComponent, {
        data: {
          approveAll: true
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.success) {
          this.requestsService
            .approveLineItemsAsIs(this.selectedItems)
            .then((response: any) => {
              this.openSnackBar(
                this.selectedItems.length + ' Line Items Approved',
                'ok',
                'OK'
              );
              this.refreshRequest();
            })
            .catch((error: any) => {
              this.openSnackBar('Line Items Were NOT approved', 'error', 'OK');
            });
          this.changeDetector.detectChanges();
        }
      });
    }
  }
}
