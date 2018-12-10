import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatIconRegistry, MatSnackBar, MatSnackBarConfig, Sort } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ClrDatagridComparatorInterface } from '@clr/angular/data/datagrid';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import { Observable, Subject, Subscription } from 'rxjs';

import { ANIMATE_ON_ROUTE_ENTER } from '../core/animations';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { EquipmentService } from '../equipment/equipment.service';
import { RequestsService } from '../requests/requests.service';
import {
  Employee,
  EmployeeFirstNameFilter,
  EmployeeLastNameFilter,
  EmployeeTradeFilter,
  Equipment,
  Item,
  ItemList,
  Project,
  Utils,
} from '../shared/model';
import { appAnimations } from './../core/animations';
import { AddMiscDialogComponent } from './dialogs/add-misc-dialog.component';
import { AddSavedDialogComponent } from './dialogs/add-saved-dialog.component';
import { AttachmentsDialogComponent } from './dialogs/attachments-dialog.component';
import { ConfigurationDialogComponent } from './dialogs/configuration-dialog.component';
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
  public dateRangeComparator = new ItemDateRangeComparator();
  lastNameFilter = new EmployeeLastNameFilter();
  firstNameFilter = new EmployeeFirstNameFilter();
  tradeFilter = new EmployeeTradeFilter();
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
  selectedConfiguration: any;
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
  @Input() draftMode: boolean;
  @Input() requestStartDate: string;
  @Input() printingInvoice = false;
  @Output() itemsChanged = new EventEmitter<any>();
  @Output() itemChanged = new EventEmitter<Item>();
  @Output() itemRemoved = new EventEmitter<Item>();
  @Output() itemEdited = new EventEmitter<any>();
  @Output() allApprove = new EventEmitter<any>();

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

  accountSynced = false;
  subscription: Subscription;
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
    private authenticationService: AuthenticationService
  ) {
    this.matIconRegistry.addSvgIcon(
      'costtrax-check',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../assets/icons/check.svg'
      )
    );
  }

  ngOnInit() {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    this.subscription = this.authenticationService
      .getCreds()
      .subscribe(message => {
        if (message && message.advantageId) {
          this.accountSynced =
            message.advantageId && message.advantageId !== '';
        } else {
          this.accountSynced = false;
        }
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
      this.refreshPending();
    }
    this.changeDetector.detectChanges();
    this.checkPermissions();
    this.setDisplayType();
    this.getComps();

    if (
      this.project &&
      this.project.adjustments &&
      (this.itemType === 'equipment.active' ||
        this.itemType === 'equipment.standby' ||
        this.itemType === 'equipment.rental')
    ) {
      this.adjustments = this.project.adjustments.equipment;
    } else if (
      this.project &&
      this.project.adjustments &&
      this.itemType === 'material'
    ) {
      this.adjustments = {};
    } else if (
      this.project &&
      this.project.adjustments &&
      this.itemType === 'other'
    ) {
      this.adjustments = {};
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
  }

  ngOnDestroy(): void {
    if (this.modelInput$) {
      this.modelInput$.unsubscribe();
    }
    this.subscription.unsubscribe();
  }

  getComps() {
    if (this.itemType !== 'equipment.rental') {
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
    const dialogRef = this.dialog.open(AddSavedDialogComponent, {
      width: '75vw',
      data: {
        type: this.itemType,
        projectId: this.project.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
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

  cancelSelectConfiguration() {
    this.selected = [];
    this.selectedIndex = -1;
  }

  selectConfiguration(configurations: any[]) {
    if (configurations.length === 0) {
      console.log('no configs!!');
    }
    const dialogRef = this.dialog.open(ConfigurationDialogComponent, {
      data: {
        configurations: configurations
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        if (result.configuration) {
          this.itemList.items[
            this.selectedIndex
          ].details.selectedConfiguration = JSON.parse(
            JSON.stringify(result.configuration)
          );

          if (this.itemType === 'equipment.active') {
            this.itemList.items[this.selectedIndex].details.fhwa = +Number(
              +this.itemList.items[this.selectedIndex].details
                .selectedConfiguration.hourlyOwnershipCost +
                +this.itemList.items[this.selectedIndex].details
                  .selectedConfiguration.hourlyOperatingCost
            ).toFixed(2);
            this.itemList.items[this.selectedIndex].details.method = +Number(
              this.itemList.items[this.selectedIndex].details.fhwa
            ).toFixed(2);
          } else if (this.itemType === 'equipment.standby') {
            this.itemList.items[this.selectedIndex].details.fhwa = +Number(
              +this.itemList.items[this.selectedIndex].details
                .selectedConfiguration.hourlyOwnershipCost * 0.5
            ).toFixed(2);
            this.itemList.items[this.selectedIndex].details.method = +Number(
              +this.itemList.items[this.selectedIndex].details.fhwa
            ).toFixed(2);
          }

          this.selected = [];
          this.selectedIndex = -1;
        } else {
          this.cancelSelectConfiguration();
        }
      } else {
        this.cancelSelectConfiguration();
      }
    });
  }

  confirmAddSavedModels() {
    if (!this.selected || this.selected.length === 0) {
      return;
    }
    const selectedEquipment = [];
    for (let i = 0; i < this.selected.length; i++) {
      // check to see if employee already added...

      const equipment: Equipment = new Equipment(this.selected[i]);
      if (this.hasEquipment(equipment)) {
        continue;
      }
      selectedEquipment.push(equipment);
    }

    if (this.itemType === 'equipment.rental') {
      this.equipmentService
        .getRateData(this.project.state, selectedEquipment as Equipment[])
        .then((response: any) => {
          const rentals = response.value as Equipment[];
          for (let z = 0; z < rentals.length; z++) {
            const e: Equipment = rentals[z];
            const newItem = new Item({
              status: 'Draft',
              beingEdited: true,
              requestId: this.requestId,
              type: this.itemType,
              fromSaved: true,
              details: {
                invoice: 0,
                selectedConfiguration: e.details.selectedConfiguration,
                configurations: e.details.configurations,
                base: e.baseRental,
                transportation: 0,
                hours: 0,
                make: e.make,
                makeId: e.makeId,
                model: e.model,
                modelId: e.modelId,
                rentalHouseRates: e.rentalHouseRates,
                regionalAverages: e.regionalAverages,
                nationalAverages: e.nationalAverages,
                fhwa: e.fhwa,
                method: e.method,
                sizeClassName: e.sizeClassName,
                year: e.year,
                amount: 0,
                subtotal: 0
              }
            });
            newItem.beingEdited = true;
            this.itemList.items = [...this.itemList.items, newItem];
            this.saveChanges(this.itemList.items.length, newItem);
          }
          this.changeDetector.detectChanges();
        })
        .catch(error => {
          console.error('Caught error getting rates: ' + error);
        });
    } else if (
      this.itemType === 'equipment.active' ||
      this.itemType === 'equipment.standby'
    ) {
      for (let z = 0; z < selectedEquipment.length; z++) {
        const e: Equipment = selectedEquipment[z];
        const newItem = new Item({
          status: 'Draft',
          beingEdited: true,
          requestId: this.requestId,
          type: this.itemType,
          fromSaved: true,
          details: {
            base: e.baseRental,
            configurations: e.details.configurations,
            selectedConfiguration: e.details.selectedConfiguration,
            transportation: 0,
            years: e.years,
            hours: 0,
            make: e.make,
            makeId: e.makeId,
            model: e.model,
            modelId: e.modelId,
            method: +e.method,
            fhwa: +e.fhwa,
            sizeClassName: e.sizeClassName,
            year: e.year,
            amount: 0,
            subtotal: 0
          }
        });
        if (this.itemType === 'equipment.active') {
          newItem.details.fhwa = +Number(
            +newItem.details.selectedConfiguration.hourlyOwnershipCost +
              +newItem.details.selectedConfiguration.hourlyOperatingCost
          ).toFixed(2);
          newItem.details.method = +Number(+newItem.details.fhwa).toFixed(2);
        } else if (this.itemType === 'equipment.standby') {
          newItem.details.fhwa = +Number(
            +newItem.details.selectedConfiguration.hourlyOwnershipCost * 0.5
          ).toFixed(2);
          newItem.details.method = +Number(+newItem.details.fhwa).toFixed(2);
        }
        newItem.beingEdited = true;
        this.itemList.items = [...this.itemList.items, newItem];
        this.saveChanges(this.itemList.items.length, newItem);
      }

      this.changeDetector.detectChanges();
    }
  }

  hasEquipment(equipment: Equipment) {
    for (let i = 0; i < this.itemList.items.length; i++) {
      const e: Item = this.itemList.items[i];
      if (
        e.details.modelId === equipment.modelId &&
        e.details.make === equipment.make
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
        e.details.trade === employee.trade &&
        e.details.rate === employee.rate
      ) {
        return true;
      }
    }
    return false;
  }

  confirmAddSavedEmployees() {
    //  console.log('employees to add: ' + JSON.stringify(this.selected, null, 2));
    if (!this.selected || this.selected.length === 0) {
      return;
    }
    for (let i = 0; i < this.selected.length; i++) {
      // check to see if employee already added...

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
          trade: employee.trade,
          benefits: employee.benefits,
          time1: 0,
          time15: 0,
          time2: 0
        }
      });
      newItem.beingEdited = true;
      this.itemList.items = [...this.itemList.items, newItem];
      this.changeDetector.detectChanges();
    }
  }

  makeNewSelectionChanged(event: any, item: Item) {
    // console.log('event: ' + JSON.stringify(event, null, 2));
    // console.log('item: ' + JSON.stringify(item, null, 2));
    if (item && item.details && event && event.item) {
      item.details.makeId = event.item.makeId;
    } else if (event && !event.item) {
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
            rate: 0,
            time1: 0,
            time15: 0,
            time2: 0,
            benefits: 0
          }
        });
      } else if (
        this.itemType === 'equipment.active' ||
        this.itemType === 'equipment.rental' ||
        this.itemType === 'equipment.standby'
      ) {
        newItem = new Item({
          status: 'Draft',
          beingEdited: true,
          requestId: this.requestId,
          type: this.itemType,
          details: {
            base: 0,
            operating: 0,
            transportation: 0,
            hours: 0,
            make: '',
            model: '',
            terms: 'Monthly',
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
          details: {
            unitCost: 1,
            units: 1
          }
        });
      }
      newItem.beingEdited = true;
      this.itemList.items[event.index] = newItem;
    } else {
      item.details.sizeClassName = '';
      item.details.fhwa = 0;
      item.details.year = '';
      item.details.years = null;
      item.details.modelId = null;
      item.details.hours = 0;
      item.details.amount = 0;
      item.amount = 0;
      item.details.transportation = 0;
      item.resetSelectedConfiguration();
    }
  }
  modelNewSelectionChanged(event: any, item: Item, index: number) {
    if (!event || !event.item) {
      item.details.makeId = item.details.makeId;
      item.details.sizeClassName = '';
      item.details.fhwa = 0;
      item.details.year = '';
      item.details.years = null;
      item.details.modelId = null;
      item.details.hours = 0;
      item.details.amount = 0;
      item.amount = 0;
      item.details.transportation = 0;
      item.resetSelectedConfiguration();
      return;
    }
    item.details.sizeClassId = event.item.sizeClassId;
    item.details.sizeClassName = event.item.sizeClassName;
    item.details.year = event.item.year;
    item.details.subtypeId = event.item.subtypeId;
    item.details.classificationId = event.item.classificationId;
    item.details.classificationName = event.item.classificationName;
    item.details.display = event.item.display;

    item.details.description = event.item.description;
    item.details.subtypeName = event.item.subtypeName;
    item.details.subtypeId = event.item.subtypeId;
    item.details.categoryId = event.item.categoryId;
    item.details.categoryName = event.item.categoryName;
    item.details.make = event.item.make;
    item.details.model = event.item.model;
    item.details.modelId = event.item.modelId;
    item.details.dateIntroduced = event.item.dateIntroduced;
    item.details.dateDiscontinued = event.item.dateDiscontinued;
    item.generateYears();
    if (item.details.years && item.details.years.length === 1) {
      item.details.year = item.details.years[0].year;
    }
    item.details.vin = event.item.vin;
    if (item && item.details) {
      if (item.type === 'equipment.rental') {
        this.equipmentService
          .getRateDataForSizeClassId(
            item.details.sizeClassId,
            item.details.modelId,
            this.project.state,
            this.project.zipcode,
            1
          )
          .subscribe((choice: Equipment) => {
            this.equipmentService
              .getConfiguration(
                item.details.modelId,
                item.details.year,
                this.project.state,
                this.requestStartDate
              )
              .subscribe((configurations: any) => {
                item.details.configurations = configurations;
                item.details.year = choice.year;
                item.details.baseRental = choice.baseRental;
                item.details.fhwa = choice.fhwa;
                console.log(
                  'rental house rates: ' +
                    JSON.stringify(choice.rentalHouseRates, null, 2)
                );
                item.details.nationalAverages = choice.nationalAverages;
                item.details.regionalAverages = choice.regionalAverages;
                item.details.rentalHouseRates = choice.rentalHouseRates;
                item.details.nodata = false;
                if (configurations && configurations.values.length > 1) {
                  this.selectedItem = item;
                  this.selectedIndex = index;
                  this.selectConfiguration(configurations);
                } else if (
                  configurations &&
                  configurations.values.length === 1
                ) {
                  item.details.selectedConfiguration = configurations.values[0];
                } else {
                  item.details.nodata = true;
                  item.setNoCost();
                }
                item.beingEdited = true;
                this.changeDetector.detectChanges();
              });
          });
      } else if (
        item.type === 'equipment.active' ||
        item.type === 'equipment.standby'
      ) {
      }
    }
  }

  yearSelectionChanged(item: Item, index: number) {
    if (!item.details.year || item.details.year === '') {
      item.details.fhwa = 0;
      item.details.hours = 0;
      item.details.amount = 0;
      item.amount = 0;
      item.details.transportation = 0;
      item.resetSelectedConfiguration();
      if (this.itemType === 'equipment.active') {
        this.activeChanged(item);
      } else if (this.itemType === 'equipment.standby') {
        this.standbyChanged(item);
      } else if (this.itemType === 'equipment.rental') {
        this.rentalChanged(item);
      }
      return;
    }
    let state = '';
    if (
      this.itemType === 'equipment.active' &&
      this.project.adjustments.equipment.active.regionalAdjustmentsEnabled
    ) {
      state = this.project.state;
    } else if (
      this.itemType === 'equipment.standby' &&
      this.project.adjustments.equipment.standby.regionalAdjustmentsEnabled
    ) {
      state = this.project.state;
    }
    this.equipmentService
      .getConfiguration(
        item.details.modelId,
        item.details.year,
        state,
        this.requestStartDate
      )
      .subscribe((configurations: any) => {
        //  console.log('# of configs:  ' + configurations.values.length);
        item.details.nodata = false;
        if (configurations && configurations.values.length > 1) {
          this.selectedItem = item;
          this.selectedIndex = index;
          this.selectedItem.details.configurations = configurations;
          this.selectConfiguration(configurations);
        } else if (configurations && configurations.values.length === 1) {
          item.details.selectedConfiguration = configurations.values[0];
          item.details.configurations = configurations;

          if (this.itemType === 'equipment.active') {
            item.details.fhwa = +Number(
              +item.details.selectedConfiguration.hourlyOwnershipCost +
                +item.details.selectedConfiguration.hourlyOperatingCost
            ).toFixed(2);
            item.details.method = +Number(item.details.fhwa).toFixed(2);
          } else if (this.itemType === 'equipment.standby') {
            item.details.fhwa = +Number(
              +item.details.selectedConfiguration.hourlyOwnershipCost * 0.5
            ).toFixed(2);
            item.details.method = +Number(+item.details.fhwa).toFixed(2);
          } else {
            item.resetSelectedConfiguration();
          }
        } else {
          item.setNoCost();
          item.details.nodata = true;
        }
        if (this.itemType === 'equipment.active') {
          this.activeChanged(item);
        } else if (this.itemType === 'equipment.standby') {
          this.standbyChanged(item);
        } else if (this.itemType === 'equipment.rental') {
          this.rentalChanged(item);
        }
        item.beingEdited = true;
        this.changeDetector.detectChanges();
      });
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
          rate: 0,
          time1: 0,
          time15: 0,
          time2: 0,
          benefits: 0
        }
      });
    } else if (
      this.itemType === 'equipment.active' ||
      this.itemType === 'equipment.rental' ||
      this.itemType === 'equipment.standby'
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
          transportation: 0,
          year: '',
          configurations: null,
          selectedConfiguration: {
            hourlyOperatingCost: 0,
            hourlyOwnershipCost: 0,
            dailyOwnershipCost: 0,
            weeklyOwnershipCost: 0,
            monthlyOwnershipCost: 0
          },
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
        details: {
          unitCost: 1,
          units: 1,
          transportation: 0,
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
    if (item.details.time1) {
      total += +item.details.time1 * +item.details.rate;
    }
    if (item.details.time15) {
      total += +item.details.time15 * (1.5 * +item.details.rate);
    }
    if (item.details.time2) {
      total += +item.details.time2 * (2 * +item.details.rate);
    }
    item.subtotal = total;
    if (item.details.benefits) {
      const totalHours =
        +item.details.time2 + +item.details.time15 + +item.details.time1;
      const totalBennies = +item.details.benefits * totalHours;
      total += +totalBennies;
    }

    item.amount = total;
    item.details.subtotal = item.subtotal;
    item.details.amount = item.amount;
  }

  activeChanged(item: Item) {
    let total = 0;

    if (item.details.hours) {
      total = +item.details.hours * +item.details.method;
    }
    if (item.details.transportation) {
      total += +item.details.transportation;
    }
    item.subtotal = total;
    item.amount = total;
    item.calculateActiveComps();
  }
  standbyChanged(item: Item) {
    let total = 0;
    if (item.details.hours) {
      total = +item.details.hours * +item.details.method;
    }
    if (item.details.transportation) {
      total += +item.details.transportation;
    }
    item.subtotal = total;

    item.amount = total;
  }

  rentalChanged(item: Item) {
    let total = 0;
    if (item.details.invoice) {
      total = +item.details.invoice;
    }
    if (item.details.transportation) {
      total += +item.details.transportation;
    }
    if (item.details.invoice_operating && item.details.hours) {
      total += +item.details.invoice_operating * item.details.hours;
    }
    item.subtotal = total;
    item.amount = total;
    if (!item.details.startDate || !item.details.endDate) {
      return;
    }
    const diff = Math.abs(
      new Date(item.details.startDate).getTime() -
        new Date(item.details.endDate).getTime()
    );

    let diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    if (diffDays === 0) {
      diffDays = 1;
    }

    this.requestsService
      .getDaysBreakdown(diffDays)
      .subscribe((breakdown: any) => {
        item.details.rentalBreakdown = breakdown;
        item.calculateRentalComps();
      });
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

  equipmentChoiceChanged(event: any, item: Item) {
    if (!event) {
      return;
    }
    let duration = 1;
    if (item.type === 'equipement.rental') {
      if (item.details.terms === 'Monthly') {
        duration = 30;
      } else if (item.details.terms === 'Weekly') {
        duration = 7;
      } else {
        duration = 1;
      }
    } else {
      duration = 1;
    }

    this.equipmentService
      .getRateData(this.project.state, [event] as Equipment[], duration)
      .then((response: any) => {
        const assets = response.value as Equipment[];
        if (assets && assets.length === 1) {
          const choice = assets[0];
          const details = {
            hours: 0,
            make: choice.make,
            model: choice.model,
            base: choice.baseRental,
            fhwa: +choice.fhwa,
            selectedConfiguration: choice.selectedConfiguration,
            configurations: choice.configurations,
            description: choice.description,
            type: choice.type
          };

          item.details = details;
          item.editDetails = choice;
        }
      });
    this.changeDetector.detectChanges();
  }

  confirmAddEquipment() {
    this.beingEdited = false;
    const choices = this.equipmentFormGroup.get('selectedMachineControl').value;
    this.equipmentService
      .getRateData(this.project.state, choices as Equipment[])
      .then((response: any) => {
        const assets = response.value as Equipment[];
        for (let i = 0; i < assets.length; i++) {
          const choice = assets[i];
          let details = {};
          if (this.itemType === 'equipment.active') {
            details = {
              hours: 0,
              make: choice.make,
              model: choice.model,
              base: choice.baseRental,
              sizeClassName: choice.sizeClassName,
              year: choice.year,
              fhwa: choice.fhwa,
              markup: this.project.adjustments.equipment.active.markup,
              description: choice.description,
              type: choice.type
            };
          } else if (this.itemType === 'equipment.standby') {
            details = {
              hours: 0,
              make: choice.make,
              model: choice.model,
              base: choice.baseRental,
              sizeClassName: choice.sizeClassName,
              year: choice.year,
              fhwa: choice.fhwa,
              markup: this.project.adjustments.equipment.active.markup,
              description: choice.description,
              type: choice.type
            };
          } else {
            details = {
              hours: 0,
              make: choice.make,
              model: choice.model,
              base: choice.baseRental,
              terms: 'Monthly',
              sizeClassName: choice.sizeClassName,
              year: choice.year,
              fhwa: choice.fhwa,
              markup: this.project.adjustments.equipment.active.markup,
              description: choice.description,
              type: choice.type
            };
          }

          this.itemList.items = [
            ...this.itemList.items,
            new Item({
              beingEdited: true,
              requestId: this.requestId,
              type: this.itemType,
              status: 'Draft',
              details: details,
              editDetails: choice
            })
          ];
        }
        this.changeDetector.detectChanges();
        this.createEquipmentForm();
      });
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
          return compare(+a.finalAmount, +b.finalAmount, isAsc);
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
      if (r === 'RequestSubmit') {
        this.submitRequests = true;
      }

      if (r === 'RequestManage') {
        this.manageRequests = true;
      }
      if (r === 'ProjectAdmin') {
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
        if (!this.selectedItem.id) {
          this.selectedItem = null;
          this.itemList.items.splice(this.selectedIndex, 1);
        } else {
          this.requestsService.deleteLineItem(this.selectedItem.id).subscribe(
            (response: any) => {
              this.openSnackBar('Line Item Deleted!', 'ok', 'OK');
              this.itemList.items.splice(this.selectedIndex, 1);
              this.itemRemoved.emit(this.selectedItem);
              this.changeDetector.detectChanges();
            },
            (error: any) => {
              this.openSnackBar('Line Item NOT Deleted!', 'ok', 'OK');
            }
          );
        }

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
    } else if (item.type === 'equipment.rental') {
      this.rentalChanged(item);
    } else if (item.type === 'equipment.active') {
      this.activeChanged(item);
    } else if (item.type === 'equipment.standby') {
      this.standbyChanged(item);
    }
  }

  editItem(index: number, item: Item) {
    item.beingEdited = true;
    // console.log('details: ' + JSON.stringify(item.details, null, 2));
    this.requestsService.addEditItem(item);
    this.changeDetector.detectChanges();
  }

  revertEdits(index: number, item: Item) {
    item = this.requestsService.revertItem(item.id);
    item.beingEdited = false;
    this.itemList.items[index] = item;
  }

  saveChanges(index: number, item: Item) {
    this.updateItemTotal(item);
    if (this.requestId && (!item.requestId || item.requestId === '')) {
      item.requestId = this.requestId;
    }
    const lineItemData: any = {
      id: item.id,
      requestId: item.requestId,
      type: item.type,
      status: item.status.toLowerCase(),
      amount: Number(item.amount).toFixed(2),
      details: item.details
    };
    lineItemData.details.amount = item.amount;
    if (item.id && item.id !== '') {
      this.requestsService.updateLineItem(lineItemData).subscribe(
        (response: any) => {
          item.id = lineItemData.id;
          this.itemList.items[index] = new Item(item);
          item.beingEdited = false;
          this.itemsChanged.emit({ type: item.type, index: index });
          this.openSnackBar('Line Item Updated!', 'ok', 'OK');
          this.changeDetector.detectChanges();
        },
        (error: any) => {
          this.openSnackBar('Line Items Did Not Save', 'error', 'OK');
        }
      );
    } else {
      this.requestsService.saveLineItems([lineItemData]).then(
        (response: any) => {
          lineItemData.id = response[0].id;
          item.id = lineItemData.id;
          item.beingEdited = true;
          this.itemsChanged.emit({ type: item.type, index: index });
          this.changeDetector.detectChanges();
        },
        (error: any) => {}
      );
    }
  }

  get amountChanged() {
    return +this.selectedItem.finalAmount - +this.selectedItem.amount;
  }

  createEquipmentForm() {
    this.equipmentFormGroup = new FormGroup({
      selectedMachineControl: new FormControl('')
    });
  }

  refreshPending() {
    for (let i = 0; i < this.itemList.items.length; i++) {
      if (this.itemList.items[i].status.toLowerCase() === 'pending') {
        this.hasPending = true;
        return;
      }
    }
    this.hasPending = false;
  }

  editLineItem(index: number, it: Item) {
    it.beingEdited = !it.beingEdited;
  }

  viewAttachments(item: Item) {
    this.selectedItem = item;
    const dialogRef = this.dialog.open(AttachmentsDialogComponent, {
      width: '50vw',
      disableClose: true,
      data: {
        selectedItem: item,
        canDelete: this.submitRequests,
        canAdd: this.submitRequests
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.fileList) {
        item.attachments = result.fileList;
        this.selectedItem = null;
        this.changeDetector.detectChanges();
        this.changeDetector.markForCheck();
      }
    });
  }

  approve(item: Item) {
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
          this.selectedItem.status = 'Complete';
          this.selectedItem.finalAmount = this.selectedItem.amount;
          this.selectedItem.approvedOn = new Date();
          this.requestsService.approveLineItemAsIs(this.selectedItem).subscribe(
            (approveResponse: any) => {
              this.changeDetector.detectChanges();
              this.openSnackBar('Line Item Approved!', 'ok', 'OK');
              this.itemChanged.emit(this.selectedItem);
            },
            (error: any) => {
              this.openSnackBar('Line Items Did Not Save', 'error', 'OK');
            }
          );
        }
      }
    });
  }

  approveWithChange(item: Item) {
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
          this.selectedItem.status = 'Complete';
          this.selectedItem.changeReason = result.changes.changeReason;
          this.selectedItem.finalAmount = result.changes.finalAmount;
          this.selectedItem.approvedOn = new Date();
          this.requestsService
            .approveLineItemWithChanges(this.selectedItem)
            .subscribe(
              (approveResponse: any) => {
                this.openSnackBar(
                  'Line Item Approved With Changes',
                  'ok',
                  'OK'
                );
                this.itemChanged.emit(this.selectedItem);
                this.changeDetector.detectChanges();
              },
              (error: any) => {
                this.openSnackBar('Line Item Did Not Save', 'error', 'OK');
              }
            );
        }
      }
    });
  }
  requestMoreInfo(item: Item) {
    item.status = 'RequestMoreInfo';
  }

  addMiscEquipment() {
    this.selectedConfig = [];

    const dialogRef = this.dialog.open(AddMiscDialogComponent, {
      width: '80vw',
      data: {
        type: this.itemType,
        projectId: this.project.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        if (result.configuration) {
          this.confirmAddMiscModel(
            result.equipment,
            result.configuration,
            result.configurations
          );
        }
      }
    });
  }

  confirmAddMiscModel(equipment: any, sc: any, configs: any) {
    this.miscCategoryId = null;
    this.miscEquipment = equipment;
    this.miscEquipment.misc = true;
    this.miscEquipment.details.configurations = configs;
    this.miscEquipment.details.selectedConfiguration = sc;

    if (this.itemType === 'equipment.rental') {
      this.equipmentService
        .getRateDataForSizeClassId(
          String(this.miscEquipment.sizeClassId),
          this.miscEquipment.modelId,
          this.project.state,
          this.project.zipcode,
          1
        )
        .subscribe((choice: Equipment) => {
          this.miscEquipment.year = choice.year;
          this.miscEquipment.baseRental = choice.baseRental;
          this.miscEquipment.fhwa = choice.fhwa;
          this.miscEquipment.type = this.itemType;
          this.miscEquipment.rentalHouseRates = choice.rentalHouseRates;
          this.miscEquipment.nationalAverages = choice.nationalAverages;
          const newItem = new Item({
            status: 'Draft',
            beingEdited: true,
            requestId: this.requestId,
            type: this.itemType,
            details: {
              configurations: this.miscEquipment.details.configurations,
              selectedConfiguration: this.miscEquipment.details
                .selectedConfiguration,
              base: this.miscEquipment.baseRental,
              transportation: 0,
              hours: 0,
              make: this.miscEquipment.make,
              makeId: this.miscEquipment.makeId,
              model: this.miscEquipment.model,
              modelId: this.miscEquipment.modelId,
              fhwa: this.miscEquipment.fhwa,
              sizeClassName: this.miscEquipment.sizeClassName,
              year: this.miscEquipment.year,
              amount: 0,
              subtotal: 0,
              nationalAverages: this.miscEquipment.nationalAverages,
              rentalHouseRates: this.miscEquipment.rentalHouseRates
            }
          });
          newItem.generateYears();
          newItem.details.selectedConfiguration = this.miscEquipment.details.selectedConfiguration;
          newItem.details.configuration = this.miscEquipment.details.configurations;
          // need to set base rate that is different than invoice amount - right now i only
          // have one amount which is used for invoice but needs to be split out
          newItem.beingEdited = true;
          this.selectedConfig = null;

          this.itemList.items = [...this.itemList.items, newItem];
          this.saveChanges(this.itemList.items.length, newItem);
          this.changeDetector.detectChanges();
        });
    } else if (
      this.itemType === 'equipment.active' ||
      this.itemType === 'equipment.standby'
    ) {
      const newItem = new Item({
        status: 'Draft',
        beingEdited: true,
        requestId: this.requestId,
        type: this.itemType,
        details: {
          selectedConfiguration: this.miscEquipment.details
            .selectedConfiguration,
          configurations: this.miscEquipment.details.configurations,
          transportation: 0,
          hours: 0,
          make: this.miscEquipment.make,
          makeId: this.miscEquipment.makeId,
          model: this.miscEquipment.model,
          modelId: this.miscEquipment.modelId,
          sizeClassName: this.miscEquipment.sizeClassName,
          year: this.miscEquipment.year,
          dateIntroduced: this.miscEquipment.dateIntroduced,
          dateDiscontinued: this.miscEquipment.dateDiscontinued,

          amount: 0,
          subtotal: 0
        }
      });
      newItem.generateYears();
      if (newItem.details.years && newItem.details.years.length === 1) {
        newItem.details.year = newItem.details.years[0].year;
      }
      newItem.details.selectedConfiguration = this.miscEquipment.details.selectedConfiguration;
      newItem.details.configuration = this.miscEquipment.details.configurations;

      if (this.itemType === 'equipment.active') {
        newItem.details.fhwa = +Number(
          +newItem.details.selectedConfiguration.hourlyOwnershipCost +
            +newItem.details.selectedConfiguration.hourlyOperatingCost
        ).toFixed(2);
        newItem.details.method = newItem.details.fhwa;
      } else if (this.itemType === 'equipment.standby') {
        newItem.details.fhwa = +Number(
          +newItem.details.selectedConfiguration.hourlyOwnershipCost * 0.5
        ).toFixed(2);
        newItem.details.method = newItem.details.fhwa;
      }

      newItem.beingEdited = true;
      this.itemList.items = [...this.itemList.items, newItem];
      this.saveChanges(this.itemList.items.length, newItem);
      this.changeDetector.detectChanges();
    }
    this.selected = [];
    this.selectedConfig = null;
    this.miscEquipment = null;
  }
}

function compare(a: any, b: any, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
