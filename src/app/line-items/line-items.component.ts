import { Overlay } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatIconRegistry, MatSnackBar, MatSnackBarConfig, Sort } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ClrDatagridComparatorInterface } from '@clr/angular/data/datagrid';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, Subject } from 'rxjs';

import { ANIMATE_ON_ROUTE_ENTER } from '../core/animations';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { EquipmentService } from '../equipment/equipment.service';
import { RequestsService } from '../requests/requests.service';
import { Employee, Equipment, Item, ItemList, Project, Utils } from '../shared/model';
import { appAnimations } from './../core/animations';
import { AddMiscDialogComponent } from './dialogs/add-misc-dialog.component';
import { AddModelDialogComponent } from './dialogs/add-model-dialog.component';
import { AddSavedDialogComponent } from './dialogs/add-saved-dialog.component';
import { AttachmentsDialogComponent } from './dialogs/attachments-dialog.component';
import { LineItemApproveDialogComponent } from './dialogs/line-item-approve-dialog.component';
import { LineItemDeleteDialogComponent } from './dialogs/line-item-delete-dialog.component';

class ItemDateRangeComparator implements ClrDatagridComparatorInterface<Item> {
  compare(a: Item, b: Item) {
    const d1 = new Date(a.details.startDate);
    const d2 = new Date(b.details.startDate);

    // Check if the dates are equal
    const same = d1.getTime() === d2.getTime();
    if (same) {
      return 0;
    }

    // Check if the first is greater than second
    if (d1 > d2) {
      return 1;
    }

    // Check if the first is less than second
    if (d1 < d2) {
      return -1;
    }
  }
}

@Component({
  selector: 'app-line-items',
  templateUrl: './line-items.component.html',
  styleUrls: ['./line-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: appAnimations
})
export class LineItemsComponent implements OnInit, OnDestroy {
  /*
  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');
  formatterDollar = value => `$ ${value}`;
  parserDollar = value => value.replace('$ ', '');
*/

  constructor(
    public dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private requestsService: RequestsService,
    private equipmentService: EquipmentService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public overlay: Overlay,
    private renderer: Renderer2,
    private authenticationService: AuthenticationService
  ) {
    this.matIconRegistry.addSvgIcon(
      'costtrax-check',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../assets/icons/check.svg'
      )
    );
  }
  public dateRangeComparator = new ItemDateRangeComparator();
  dialogTitle: string;
  animateOnRouteEnter = ANIMATE_ON_ROUTE_ENTER;
  requestForm: FormGroup;
  projectFormGroup: FormGroup;
  costFormGroup: FormGroup;
  costDetailsFormGroup: FormGroup;
  signatureFormGroup: FormGroup;
  selectedItem: Item;
  selectedIndex: number;
  configurations: any;
  action: string;
  selected: any[];
  selectedConfig: any;
  savedModels$: Observable<Equipment[]>;
  categoryResults$: Observable<any>;
  subtypeResults$: Observable<any>;
  sizeResults$: Observable<any>;
  modelResults$: Observable<any>;
  dateRange: any;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;
  itemType: string;
  dateFormat = 'M/dd/yy';
  colorTheme = 'theme-dark-blue';

  bsConfig: Partial<BsDatepickerConfig>;
  @Input() itemList: ItemList;
  @Input() project: Project;
  @Input() requestId: string;
  @Input() requestDates: string[];
  @Input() draftMode: boolean;
  @Input() requestStartDate: string;
  @Input() printingInvoice = false;
  @Output() itemsChanged = new EventEmitter<any>();
  @Output() itemChanged = new EventEmitter<Item>();
  @Output() itemRemoved = new EventEmitter<Item>();
  @Output() itemEdited = new EventEmitter<any>();
  @Output() allApprove = new EventEmitter<any>();
  itemsLoading = false;
  beingEdited = false;
  machines$: Observable<Equipment[]>;
  machinesSearch$: Observable<Equipment[]>;
  machine: Equipment;
  selectedMachineControl: FormControl;
  machineChoices: Equipment[];
  machineChoice: string;
  item: Item; // selected item to edit or delete
  adjustments: any;
  submitRequests = false;
  manageRequests = false;
  manageProject = false;
  canEdit = false;
  private config: MatSnackBarConfig;
  duration = 3000;
  sortActive = 'type';
  sortDirection = 'desc';
  standbyFactor = 0.5;
  operatingAdjustment = 1;
  ownershipAdjustment = 1;

  hasPending = false;
  equipmentFormGroup: FormGroup;
  changeFormGroup: FormGroup;
  submittedAmount: number;
  updatedAmount: number;

  savedEmployees$: Observable<Employee[]>;
  savedEquipment: Equipment[];
  selectedEquipment: Equipment;

  miscEquipment: Equipment;
  miscCategoryId: string;
  miscSubtypeId: string;
  miscSizeClassId: string;
  miscModelId: string;

  modelInput$ = new Subject<string>();
  modelLoading = false;

  itemTypeDisplay: string;

  accountSynced = true;
  formatterDollar = (value: number) => `$ ${value}`;
  parserDollar = (value: string) => {
    // value.replace('$', '');
  }

  ngOnInit() {
    this.itemsLoading = true;
    this.bsConfig = Object.assign(
      {},
      { containerClass: this.colorTheme, dateInputFormat: 'YYYY-MM-DD' }
    );
    this.authenticationService
      .getCreds()
      .pipe(untilDestroyed(this))
      .subscribe(message => {
        if (message && message.eqwVerified) {
          this.accountSynced = message.eqwVerified;
        } else {
          this.accountSynced = true;
        }
        this.accountSynced = true;
        this.changeDetector.detectChanges();
      });

    this.savedEquipment = [];
    this.selected = [];
    this.manageRequests = false;
    this.manageProject = false;
    this.canEdit = false;
    this.checkPermissions();
    this.createEquipmentForm();
    if (!this.itemList || !this.itemList.items) {
      this.itemList = new ItemList('', []);
    } else {
      this.itemType = this.itemList.type;
    }
    this.changeDetector.detectChanges();
    this.checkPermissions();
    this.setDisplayType();
    this.getComps();

    if (
      this.project &&
      this.project.adjustments &&
      this.itemType === 'equipmentActive'
    ) {
      this.adjustments = this.project.adjustments.equipmentActive;
      this.ownershipAdjustment = +this.adjustments.ownership;
      this.operatingAdjustment = +this.adjustments.operating;
    } else if (
      this.project &&
      this.project.adjustments &&
      this.itemType === 'equipmentStandby'
    ) {
      this.adjustments = this.project.adjustments.equipmentStandby;
      this.ownershipAdjustment = +1;
      this.operatingAdjustment = +1;
    } else if (
      this.project &&
      this.project.adjustments &&
      this.itemType === 'equipmentRental'
    ) {
      this.adjustments = this.project.adjustments.equipmentRental;
      this.ownershipAdjustment = +1;
      this.operatingAdjustment = +1;
    } else if (
      this.project &&
      this.project.adjustments &&
      this.itemType === 'material'
    ) {
      this.adjustments = this.project.adjustments.material;
    } else if (
      this.project &&
      this.project.adjustments &&
      this.itemType === 'other'
    ) {
      this.adjustments = this.project.adjustments.other;
    } else if (
      this.project &&
      this.project.adjustments &&
      this.itemType === 'subcontractor'
    ) {
      this.adjustments = this.project.adjustments.subcontractor;
    } else if (
      this.project &&
      this.project.adjustments &&
      this.itemType === 'labor'
    ) {
      this.adjustments = this.project.adjustments.labor;
    }
    this.itemsLoading = false;
  }

  ngOnDestroy(): void {
    if (this.modelInput$) {
      this.modelInput$.unsubscribe();
    }
  }

  getComps() {
    if (this.itemType !== 'equipmentRental') {
      return;
    }
  }

  dateRangeChanged(item, event: any) {
    if (item && event && event.length > 0) {
      item.setDates(event);
      this.rentalChanged(item);
    }
  }

  approveAll() {
    this.allApprove.emit({ itemType: this.itemType });
  }

  addEquipment() {
    this.beingEdited = true;
  }

  addLineItems() {
    this.addRow();
  }

  addFromSaved() {
    this.renderer.addClass(document.body, 'modal-open');
    const dialogRef = this.dialog.open(AddSavedDialogComponent, {
      width: '75vw',
      data: {
        type: this.itemType,
        projectId: this.project.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.renderer.removeClass(document.body, 'modal-open');
      if (result && result.success) {
        if (result.selected) {
          this.selected = result.selected;
          if (this.itemType !== 'labor') {
            this.confirmAddSavedModels();
          } else {
            this.confirmAddSavedEmployees();
          }
        }
      }
    });
  }

  confirmAddModel(item: Item) {
    this.itemList.items = [...this.itemList.items, item];
    this.changeDetector.detectChanges();
  }

  confirmAddSavedModels() {
    if (!this.selected || this.selected.length === 0) {
      return;
    }
    let skipped = 0;
    const selectedEquipment = [];
    for (let i = 0; i < this.selected.length; i++) {
      // check to see if employee already added...

      const equipment: Equipment = new Equipment(this.selected[i]);
      if (this.hasEquipment(equipment)) {
        skipped++;
        continue;
      }

      selectedEquipment.push(equipment);
    }
    if (selectedEquipment.length === 0 && skipped > 0) {
      if (skipped > 0) {
        this.openSnackBar(
          'Skipped ' + skipped + ' Model(s) already added',
          'OK',
          'OK'
        );
      }
      return;
    }
    this.equipmentService
      .getRateDataforSelectedEquipment(
        selectedEquipment,
        this.project.adjustments.rentalLocation.stateCode,
        this.requestStartDate,
        this.operatingAdjustment,
        this.ownershipAdjustment,
        this.standbyFactor
      )
      .subscribe((updatedEquipment: any) => {
        if (
          this.itemType === 'equipmentActive' ||
          this.itemType === 'equipmentStandby' ||
          this.itemType === 'equipmentRental'
        ) {
          for (let z = 0; z < updatedEquipment.length; z++) {
            // const e: Equipment = new Equipment(updatedEquipment[z]);
            const sc = updatedEquipment[z];
            const newItem = new Item({
              status: 'Draft',
              beingEdited: true,
              requestId: this.requestId,
              type: this.itemType,
              fromSaved: true,
              details: sc
            });
            if (this.itemType === 'equipmentActive') {
              newItem.details.rate = sc.rates.fhwaRate;
            } else if (this.itemType === 'equipmentStandby') {
              newItem.details.rate = sc.rates.standbyRate;
            }

            this.itemList.items = [...this.itemList.items, newItem];
          }
          if (skipped > 0) {
            this.openSnackBar(
              'Skipped ' + skipped + ' Model(s) already added',
              'OK',
              'OK'
            );
          }

          this.changeDetector.detectChanges();
        }
      });
  }

  hasEquipment(equipment: Equipment) {
    for (let i = 0; i < this.itemList.items.length; i++) {
      const e: Item = this.itemList.items[i];
      if (
        e.details.modelId === equipment.modelId &&
        e.details.manufacturerName === equipment.manufacturerName &&
        e.details.year === equipment.year &&
        e.details.configurationSequence === equipment.configurationSequence
      ) {
        return true;
      }
    }
    return false;
  }

  hasEmployee(employee: Employee) {
    for (let i = 0; i < this.itemList.items.length; i++) {
      const e: Item = this.itemList.items[i];
      if (
        e.details.employee.firstName === employee.firstName &&
        e.details.employee.lastName === employee.lastName &&
        e.details.class === employee.class &&
        e.details.rate === employee.rate
      ) {
        return true;
      }
    }
    return false;
  }

  confirmAddSavedEmployees() {
    if (!this.selected || this.selected.length === 0) {
      return;
    }
    for (let i = 0; i < this.selected.length; i++) {
      const employee: Employee = new Employee(this.selected[i]);
      if (this.hasEmployee(employee)) {
        continue;
      }
      let newItem: Item = new Item({});
      newItem = new Item({
        status: 'Draft',
        fromSaved: true,
        beingEdited: true,
        requestId: this.requestId,
        type: this.itemType,
        details: {
          employee: {
            lastName: employee.lastName,
            firstName: employee.firstName
          },
          rate: employee.rate,
          class: employee.class,
          fringe: employee.fringe,
          multiplier: 1
        }
      });
      newItem.beingEdited = true;
      this.itemList.items = [...this.itemList.items, newItem];
      this.changeDetector.detectChanges();
    }
  }

  addRow() {
    let newItem: Item = new Item({});
    if (this.itemType === 'labor') {
      newItem = new Item({
        status: 'Draft',
        beingEdited: true,
        requestId: this.requestId,
        type: this.itemType,
        details: {
          employee: {
            lastName: '',
            firstName: ''
          },
          class: '',
          rate: 0,
          multiplier: 1,
          hours: 0,
          fringe: 0
        }
      });
    } else if (
      this.itemType === 'equipmentActive' ||
      this.itemType === 'equipmentRental' ||
      this.itemType === 'equipmentStandby'
    ) {
      newItem = new Item({
        status: 'Draft',
        id: '',
        beingEdited: true,
        requestId: this.requestId,
        type: this.itemType,
        details: {
          base: 0,
          operating: 0,
          transport: 0,
          year: '',
          hours: 0,
          make: '',
          model: '',
          amount: 0,
          subtotal: 0
        }
      });
    } else {
      newItem = new Item({
        status: 'Draft',
        beingEdited: true,
        requestId: this.requestId,
        type: this.itemType,
        subtotal: 0,
        amount: 0,
        details: {
          unitCost: 1,
          units: 1,
          description: '',
          type: '',
          transport: 0,
          year: new Date().getFullYear()
        }
      });
    }
    newItem.beingEdited = true;
    this.itemList.items = [...this.itemList.items, newItem];
    this.saveChanges(this.itemList.items.length, newItem);
  }

  removeLastRow() {
    this.itemList.items.pop();
  }

  fakeRow() {
    this.addRow();
    this.removeLastRow();
  }

  cancelAddEquipment() {
    this.beingEdited = false;
    this.createEquipmentForm();
  }

  laborChanged(item: Item) {
    let total = 0;
    if (!item.details.rate && !item.details.benefits) {
      item.subtotal = 0;
      item.amount = 0;
      return;
    }
    if (!item.details.multiplier) {
      item.details.multiplier = 1;
    }
    total =
      item.details.multiplier * item.details.rate * item.details.hours +
      item.details.hours * item.details.fringe;

    item.subtotal = total;

    item.amount = total;
    item.details.subtotal = item.subtotal;
    item.details.amount = item.amount;
  }

  activeChanged(item: Item) {
    let total = 0;

    if (item.details.hours) {
      total = +item.details.hours * +item.details.rate;
    }
    if (item.details.transport) {
      total += +item.details.transport;
    }
    item.subtotal = total;
    item.amount = total;
    this.changeDetector.detectChanges();
    // item.calculateActiveComps();
  }
  standbyChanged(item: Item) {
    let total = 0;
    if (item.details.hours) {
      total = +item.details.hours * +item.details.rate;
    }
    if (item.details.transport) {
      total += +item.details.transport;
    }
    item.subtotal = total;

    item.amount = total;
  }

  rentalChanged(item: Item) {
    let total = 0;
    if (item.details.invoice) {
      total = +item.details.invoice;
    }
    if (item.details.transport) {
      total += +item.details.transport;
    }
    if (item.details.operating && item.details.hours) {
      total += +item.details.operating * item.details.hours;
    }
    item.subtotal = total;
    item.amount = total;
    if (!item.details.startDate || !item.details.endDate) {
      return;
    }
  }

  configChosen(configuration: any) {}

  otherChanged(item: Item) {
    item.amount = item.subtotal;
  }

  subcontractorChanged(item: Item) {
    item.amount = item.subtotal; // + item.subtotal * +this.adjustments.markup;
  }

  materialChanged(item: Item) {
    item.subtotal = +item.details.unitCost * +item.details.units;
    item.amount = item.subtotal;
  }

  onProjectChange(value) {}

  trackByFn(index: number, item: any) {
    return index; // or item.id
  }

  sortData(sort: Sort) {
    const data = this.itemList.items.slice();
    if (!sort.active || sort.direction === '') {
      this.itemList.items = data;
      return;
    }

    this.itemList.items = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'type':
          return compare(a.type, b.type, isAsc);
        case 'finalAmount':
          return compare(+a.totalAdjusted, +b.totalAdjusted, isAsc);
        case 'amount':
          return compare(+a.amount, +b.amount, isAsc);
        case 'age':
          return compare(+a.age, +b.age, isAsc);
        case 'submittedOn':
          return compare(a.submittedOn, b.submittedOn, isAsc);
        case 'approvedOn':
          return compare(a.approvedOn, b.approvedOn, isAsc);
        default:
          return 0;
      }
    });
  }

  checkPermissions() {
    if (!this.project || !this.project.roles) {
      return;
    }
    this.manageRequests = false;
    this.manageProject = false;
    this.submitRequests = false;
    for (let i = 0; i < this.project.roles.length; i++) {
      const r = this.project.roles[i];
      if (r === 'ProjectRequestor') {
        this.submitRequests = true;
      }

      if (r === 'ProjectApprover') {
        this.manageRequests = true;
      }
      if (r === 'ProjectManager') {
        this.manageProject = true;
      }
    }
  }

  setDisplayType() {
    this.itemTypeDisplay = Utils.getItemDisplayType(this.itemType);
    this.changeDetector.detectChanges();
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  onDetailToggle(event: any) {}

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.id === f2.id;
  }

  removeLineItem(index: number, item: Item) {
    this.selectedItem = item;
    this.selectedIndex = index;
    const dialogRef = this.dialog.open(LineItemDeleteDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.selectedItem = null;
        this.itemList.items.splice(this.selectedIndex, 1);

        this.changeDetector.detectChanges();
      }
    });
  }

  updateItemTotal(item: Item) {
    if (item.type === 'labor') {
      this.laborChanged(item);
    } else if (item.type === 'material') {
      this.materialChanged(item);
    } else if (item.type === 'other') {
      this.otherChanged(item);
    } else if (item.type === 'subcontractor') {
      this.subcontractorChanged(item);
    } else if (item.type === 'equipmentRental') {
      this.rentalChanged(item);
    } else if (item.type === 'equipmentActive') {
      this.activeChanged(item);
    } else if (item.type === 'equipmentStandby') {
      this.standbyChanged(item);
    }
  }

  editItem(index: number, item: Item) {
    item.beingEdited = true;
    this.requestsService.addEditItem(item);
    this.changeDetector.detectChanges();
  }

  canRevert(itemId) {
    if (this.requestsService.revertItem(itemId)) {
      return true;
    } else {
      return false;
    }
  }

  revertEdits(index: number, item: Item) {
    item = this.requestsService.revertItem(item.id);
    if (item) {
      item.beingEdited = false;
      this.itemList.items[index] = item;
    }
  }

  saveChanges(index: number, item: Item) {
    this.updateItemTotal(item);
    if (this.requestId && (!item.requestId || item.requestId === '')) {
      item.requestId = this.requestId;
    }
  }
  amountChanged() {
    return +this.selectedItem.totalAdjusted - +this.selectedItem.amount;
  }

  createEquipmentForm() {
    this.equipmentFormGroup = new FormGroup({
      selectedMachineControl: new FormControl('')
    });
  }

  editLineItem(index: number, it: Item) {
    it.beingEdited = !it.beingEdited;
  }

  approve(index: number, item: Item) {
    this.selectedItem = item;
    const dialogRef = this.dialog.open(LineItemApproveDialogComponent, {
      width: '80vw',
      data: {
        selectedItem: item,
        modalType: 'ApprovedAsIs',
        modalTitle: 'Approve',
        modalSubmitLabel: 'Approve'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        if (item) {
          this.selectedItem.subtotalApproved = this.selectedItem.amount;
          this.selectedItem.approvedOn = new Date();
          // this.itemList.items[index] = this.selectedItem;
        }
      }
    });
  }

  approveWithChange(index: number, item: Item) {
    this.selectedItem = item;
    const dialogRef = this.dialog.open(LineItemApproveDialogComponent, {
      width: '80vw',
      data: {
        selectedItem: item,
        modalType: 'ApprovedWithChange',
        modalTitle: 'Approve With Changed',
        modalSubmitLabel: 'Approve'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        if (result.changes) {
          this.selectedItem.approverNotes = result.changes.changeReason;
          this.selectedItem.subtotalApproved = result.changes.finalAmount;
          this.selectedItem.approvedOn = new Date();
          // this.itemList.items[index] = this.selectedItem;
        }
      }
    });
  }

  viewAttachments(item: Item) {
    this.selectedItem = item;
    this.renderer.addClass(document.body, 'modal-open');
    const dialogRef = this.dialog.open(AttachmentsDialogComponent, {
      width: '80vw',
      disableClose: true,
      data: {
        requestId: this.requestId,
        selectedItem: item,
        canDelete: this.submitRequests,
        canAdd: this.submitRequests
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.renderer.removeClass(document.body, 'modal-open');
      if (result && result.fileList) {
        item.attachments = result.fileList;

        this.selectedItem = null;
        this.changeDetector.detectChanges();
        this.changeDetector.markForCheck();
      }
    });
  }

  addModel() {
    this.selectedConfig = [];
    this.renderer.addClass(document.body, 'modal-open');
    const dialogRef = this.dialog.open(AddModelDialogComponent, {
      width: '80vw',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      data: {
        itemType: this.itemType,
        adjustments: this.project.adjustments
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.renderer.removeClass(document.body, 'modal-open');
      if (result && result.success) {
        if (result.item) {
          this.confirmAddModel(result.item);
        }
      }
    });
  }

  addMiscEquipment() {
    this.selectedConfig = [];
    this.renderer.addClass(document.body, 'modal-open');
    const dialogRef = this.dialog.open(AddMiscDialogComponent, {
      width: '80vw',
      data: {
        type: this.itemType,
        projectId: this.project.id,
        adjustments: this.project.adjustments,
        projectState: this.project.adjustments.rentalLocation.stateCode
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.renderer.removeClass(document.body, 'modal-open');
      if (result && result.success) {
        if (result.item) {
          this.confirmAddModel(result.item);
        }
      }
    });
  }
}

function compare(a: any, b: any, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
