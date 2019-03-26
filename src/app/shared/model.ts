import { ClrDatagridComparatorInterface } from '@clr/angular';
import { DateTime } from 'luxon';

import { DatesPipe } from '../core/pipes/dates.pipe';

export interface Breadcrumb {
  id: string;
  path: string;
  route: string;
  display: string;
}

export interface Attachment {
  id: string;
  uid: string;
  url: string;
  name: string;
  size: number;
  type: string;
  status: string;
  tempId: string;
}

export class Error403 extends Error {
  constructor(message?: string) {
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export class Error401 extends Error {
  constructor(message?: string) {
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export class Employee {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  trade: string;
  benefits: number;
  rate: number;
  company: string;
  selected = false;
  email: string;
  status = 'draft';

  constructor(employee: any) {
    this.id = employee.id || '';
    if (employee.labor) {
      employee = employee.labor;
    }
    this.firstName = employee.firstName || '';
    this.lastName = employee.lastName || '';
    this.displayName = employee.displayName || '';
    this.trade = employee.trade || '';
    this.email = employee.email || '';
    this.benefits = employee.benefits || 0;
    this.rate = employee.rate || 0;
    this.status = employee.status || 'draft';
  }

  isDraft() {
    return this.status && this.status.toLowerCase() === 'draft';
  }
}

export class User {
  id: string;
  name: string;
  lastName: string;
  nickname: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  birthday: Date;
  notes: string;
  roles: string[];
  initialRoles: string[];
  status: string;
  expanded = false;
  projectManager = false;
  projectObserver = false;
  projectApprover = false;
  projectRequestor = false;

  constructor(user: any) {
    {
      this.id = user.id || user.userId || '';
      this.name = user.name || '';
      this.lastName = user.lastName || '';
      this.nickname = user.nickname || '';
      this.company = user.company || '';
      this.jobTitle = user.jobTitle || '';
      this.email = user.email || '';
      this.phone = user.phone || '';
      this.address = user.address || '';
      this.birthday = user.birthday || new Date();
      this.notes = user.notes || '';
      this.roles = user.roles || [];
      this.projectManager = false;
      this.projectObserver = false;
      this.projectApprover = false;
      this.projectRequestor = false;
      this.initialRoles = [];
      this.roles.map(x => this.initialRoles.push(x.toString()));
      this.setRoles();
    }
  }

  rolesChanged(): boolean {
    let objectsAreSame = true;
    if (this.roles.length !== this.initialRoles.length) {
      return false;
    }
    for (const propertyName in this.roles) {
      if (this.roles[propertyName] !== this.initialRoles[propertyName]) {
        objectsAreSame = false;
        break;
      }
    }
    return objectsAreSame;
  }

  resetRoles() {
    this.roles = [];
    this.initialRoles.map(x => this.roles.push(x.toString()));
    this.setRoles();
  }

  toggleRole(roleName: string) {
    if (this.containsRole(roleName)) {
      this.removeRole(roleName);
    } else {
      this.addRole(roleName);
    }
  }

  isRequestor() {
    return this.containsRole('ProjectRequestor');
  }

  hasRoles() {
    return this.roles.length > 0;
  }

  setRolesFromChecks(event) {
    if (this.projectRequestor) {
      this.addRole('ProjectRequestor');
    } else {
      this.removeRole('ProjectRequestor');
    }
    if (this.projectApprover) {
      this.addRole('ProjectApprover');
    } else {
      this.removeRole('ProjectApprover');
    }
    if (this.projectManager) {
      this.addRole('ProjectManager');
    } else {
      this.removeRole('ProjectManager');
    }
    if (this.projectObserver) {
      this.addRole('ProjectObserver');
    } else {
      this.removeRole('ProjectObserver');
    }
  }

  removeRole(roleName: string) {
    if (this.containsRole(roleName)) {
      this.roles.splice(this.roles.indexOf(roleName), 1);
    }
  }
  setRoles() {
    this.projectApprover = false;
    this.projectRequestor = false;
    this.projectManager = false;
    this.projectObserver = false;
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i] === 'ProjectRequestor') {
        this.projectRequestor = true;
      } else if (this.roles[i] === 'ProjectApprover') {
        this.projectApprover = true;
      } else if (this.roles[i] === 'ProjectManager') {
        this.projectManager = true;
      } else if (this.roles[i] === 'ProjectObserver') {
        this.projectObserver = true;
      }
    }
  }

  public addRole(roleName: string) {
    if (this.containsRole(roleName)) {
      return;
    } else {
      this.roles.push(roleName);
    }
    this.setRoles();
  }

  containsRole(roleName: string) {
    if (
      !this.roles ||
      this.roles.length === 0 ||
      !roleName ||
      roleName === ''
    ) {
      return false;
    }
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].toUpperCase() === roleName.toUpperCase()) {
        return true;
      }
    }
    return false;
  }
}

export interface Adjustments {
  subcontractor: { markup: 0.1 };
  labor: {
    markup: 0.1;
  };
  equipment: {
    active: {
      ownership: 1;
      operating: 1;
      markup: 0.1;
    };
    standby: { markup: 0.1 };
    rental: { markup: 0.1 };
  };
}

export interface Comment {
  id: string;
  itemId: string;
  author: string;
  date: Date;
  text: string;
}

export class LineItem {
  requestId: string;
  projectId: string;
  amount: number;
  details: any;
  rejectedBy: string;
  rejectedOn: Date;
  approvedOn: Date;
  approvedBy: string;
  changeReason: string;
  rejectReason: string;
  totalAdjusted: number;
  subtotal: number;
  total: number;
  age: number;
  overdue: boolean;
  description: string;
  eSig: string;
  userId: string;
  displayType: string;
}

export class OneUpComparator
  implements ClrDatagridComparatorInterface<Request> {
  compare(a: Request, b: Request) {
    return +b.oneUp - +a.oneUp;
  }
}

export class Item {
  id: string;
  fromSaved = false;
  requestId: string;
  details: any;
  eSig: string;
  submittedOn: Date;
  submittedBy: string;
  age: number;
  overdue: boolean;
  editMode: boolean;
  amount: number;
  subtotal: number;
  totalAdjusted: number;
  approvedOn: Date;
  approvedBy: string;
  type: string;
  startDate: Date;
  endDate: Date;
  changeReason: string;
  rejectReason: string;
  displayType: string;
  comments: Comment[];
  attachments: Attachment[];
  editDetails: any;
  revert: Item;
  beingEdited = false;

  misc = false;

  setNoCost() {
    this.details.selectedConfiguration = {
      hourlyOperatingCost: 0,
      hourlyOwnershipCost: 0,
      dailyOwnershipCost: 0,
      weeklyOwnershipCost: 0,
      monthlyOwnershipCost: 0
    };
  }

  resetSelectedConfiguration() {
    this.details.selectedConfiguration = {
      hourlyOperatingCost: 0,
      hourlyOwnershipCost: 0,
      dailyOwnershipCost: 0,
      weeklyOwnershipCost: 0,
      monthlyOwnershipCost: 0
    };
  }

  generateYears() {
    if (!this.details.dateIntroduced) {
      this.details.dateIntroduced = new Date(0);
    }
    if (!this.details.dateDiscontinued) {
      this.details.dateDiscontinued = DateTime.local().toJSDate();
    }
    if (this.details.dateIntroduced instanceof Date) {
    } else {
      this.details.dateIntroduced = DateTime.fromISO(
        this.details.dateIntroduced
      ).toJSDate();
    }
    if (this.details.dateDiscontinued instanceof Date) {
    } else {
      this.details.dateDiscontinued = DateTime.fromISO(
        this.details.dateDiscontinued
      ).toJSDate();
    }
    let startYear = this.details.dateIntroduced.getFullYear();
    const endYear = this.details.dateDiscontinued.getFullYear();

    const nowYear = DateTime.local().year - 29;

    startYear = +Math.max(+startYear, +nowYear);
    this.details.years = [];
    for (let i = startYear; i <= endYear; i++) {
      this.details.years.push({ year: i });
    }
  }

  buildRentalDates() {
    if (this.details.dateRange && this.details.dateRange.length > 0) {
      this.details.startDate = this.details.dateRange[0];
      this.details.endDate = this.details.dateRange[1];
    }
  }

  buildDateRange() {
    if (
      (!this.details.dateRange || this.details.dateRange.length < 2) &&
      (this.details.startDate &&
        this.details.startDate !== '' &&
        this.details.endDate)
    ) {
      if (this.details.startDate && this.details.startDate !== null) {
        this.details.dateRange = [this.details.startDate, this.details.endDate];
      }
    } else {
      this.details.dateRange = [
        new Date(this.details.startDate),
        new Date(this.details.endDate)
      ];
    }
    this.details.dateRangeStr = new DatesPipe().transform(
      this.details.dateRange
    );
  }

  hasId(): boolean {
    return this.id && this.id !== '';
  }

  calculateActiveComps() {
    if (
      !this.amount ||
      !this.details.selectedConfiguration ||
      !this.details.selectedConfiguration.rates
    ) {
      return;
    }

    this.details.rateTotal = +Number(
      +this.details.selectedConfiguration.rates.hourlyOwnershipCostFinal +
        +this.details.selectedConfiguration.rates.hourlyOperatingCostFinal
    ).toFixed(2);
    if (!this.details.terms || !this.details.terms.blueBook) {
      this.details.terms = {
        days: 0,
        weeks: 0,
        months: 0,
        blueBook: {
          dailyOwnershipCost: 0,
          weeklyOwnershipCost: 0,
          monthlyOwnershipCost: 0,
          hourlyOwnershipCost: 0,
          hourlyOperatingCost: 0,
          ownershipTotal: 0,
          ownershipDelta: 0,
          rateTotal: 0,
          rateDelta: 0
        }
      };
    }
    this.details.terms.blueBook.hourlyOwnershipCost = +this.details
      .selectedConfiguration.rates.hourlyOwnershipCostFinal;
    this.details.terms.blueBook.hourlyOperatingCost = +this.details
      .selectedConfiguration.rates.hourlyOperatingCostFinal;
    this.details.terms.blueBook.rateTotal = +Number(
      +this.details.terms.blueBook.hourlyOwnershipCost +
        +this.details.terms.blueBook.hourlyOperatingCost
    ).toFixed(2);
  }

  setDates(dates: any) {
    if (dates && dates.length > 0) {
      this.details.startDate = new Date(dates[0]);
      this.details.endDate = new Date(dates[1]);
    }
  }

  calculateRentalComps() {
    if (!this.details.invoice || !this.details.rentalBreakdown) {
      return;
    }

    if (
      this.details.selectedConfiguration &&
      this.details.selectedConfiguration.rates
    ) {
      this.details.terms = {
        blueBook: {
          dailyOwnershipCost: this.details.selectedConfiguration.rates
            .dailyOwnershipCostUnadjusted,
          weeklyOwnershipCost: this.details.selectedConfiguration.rates
            .weeklyOwnershipCostUnadjusted,
          monthlyOwnershipCost: this.details.selectedConfiguration.rates
            .monthlyOwnershipCostUnadjusted,
          hourlyOwnershipCost: this.details.selectedConfiguration.rates
            .hourlyOwnershipCostUnadjusted,
          hourlyOperatingCost: this.details.selectedConfiguration.rates
            .hourlyOperatingCostUnadjusted,
          ownershipTotal: 0,
          ownershipDelta: 0
        },
        regionalAvg: {
          dailyRetailRentalCost: 0,
          weeklyRetailRentalCost: 0,
          monthlyRetailRentalCost: 0,
          retailRentalTotal: 0,
          retailRentalDelta: 0
        }
      };
    } else if (this.details.selectedConfiguration) {
      this.details.terms = {
        blueBook: {
          dailyOwnershipCost:
            this.details.selectedConfiguration.dailyOwnershipCost || 0,
          weeklyOwnershipCost:
            this.details.selectedConfiguration.weeklyOwnershipCost || 0,
          monthlyOwnershipCost:
            this.details.selectedConfiguration.monthlyOwnershipCost || 0,
          hourlyOwnershipCost:
            this.details.selectedConfiguration.hourlyOwnershipCost || 0,
          hourlyOperatingCost:
            this.details.selectedConfiguration.hourlyOperatingCost || 0,
          ownershipTotal: 0,
          ownershipDelta: 0
        },
        regionalAvg: {
          dailyRetailRentalCost: 0,
          weeklyRetailRentalCost: 0,
          monthlyRetailRentalCost: 0,
          retailRentalTotal: 0,
          retailRentalDelta: 0
        }
      };
    }

    if (
      this.details.regionalAverages &&
      this.details.regionalAverages.length >= 1
    ) {
      this.details.terms.regionalAvg.monthlyRetailRentalCost = +this.details
        .regionalAverages[0].monthlyRate;
      this.details.terms.regionalAvg.weeklyRetailRentalCost = +this.details
        .regionalAverages[0].weeklyRate;
      this.details.terms.regionalAvg.dailyRetailRentalCost = +this.details
        .regionalAverages[0].dailyRate;
    } else if (this.details.nationalAverages) {
      for (let i = 0; i < this.details.nationalAverages.length; i++) {
        if (this.details.nationalAverages[i].country === 'US') {
          this.details.terms.regionalAvg.dailyRetailRentalCost = +Number(
            +this.details.nationalAverages[i].dailyRate
          ).toFixed(2);
          this.details.terms.regionalAvg.weeklyRetailRentalCost = +Number(
            +this.details.nationalAverages[i].weeklyRate
          ).toFixed(2);
          this.details.terms.regionalAvg.monthlyRetailRentalCost = +Number(
            +this.details.nationalAverages[i].monthlyRate
          ).toFixed(2);
          break;
        }
      }
    } else {
      this.details.terms.regionalAvg.monthlyRetailRentalCost = 0;
      this.details.terms.regionalAvg.weeklyRetailRentalCost = 0;
      this.details.terms.regionalAvg.dailyRetailRentalCost = 0;
    }

    this.details.terms.blueBook.ownershipTotal = 0;
    this.details.terms.regionalAvg.retailRentalTotal = 0;

    if (this.details.rentalBreakdown.months > 0) {
      this.details.terms.blueBook.ownershipTotal +=
        +this.details.rentalBreakdown.months *
        +this.details.terms.blueBook.monthlyOwnershipCost;
      this.details.terms.regionalAvg.retailRentalTotal +=
        +this.details.rentalBreakdown.months *
        +this.details.terms.regionalAvg.monthlyRetailRentalCost;
    }
    if (this.details.rentalBreakdown.weeks > 0) {
      this.details.terms.blueBook.ownershipTotal +=
        +this.details.rentalBreakdown.weeks *
        +this.details.terms.blueBook.weeklyOwnershipCost;
      this.details.terms.regionalAvg.retailRentalTotal +=
        +this.details.rentalBreakdown.weeks *
        +this.details.terms.regionalAvg.weeklyRetailRentalCost;
    }
    if (this.details.rentalBreakdown.days > 0) {
      this.details.terms.blueBook.ownershipTotal +=
        +this.details.rentalBreakdown.days *
        +this.details.terms.blueBook.dailyOwnershipCost;
      this.details.terms.regionalAvg.retailRentalTotal +=
        +this.details.rentalBreakdown.days *
        +this.details.terms.regionalAvg.dailyRetailRentalCost;
    }

    // (Ownership Cost Total - Invoice)/Invoice and (Rental Total - Invoice) / Invoice

    if (this.details.terms.blueBook.ownershipTotal > 0) {
      this.details.terms.blueBook.ownershipDelta = Math.abs(
        +Number(
          (100 *
            (+this.details.terms.blueBook.ownershipTotal -
              +this.details.invoice)) /
            +this.details.invoice
        ).toFixed(2)
      );
      if (
        +this.details.terms.blueBook.ownershipTotal >= +this.details.invoice
      ) {
        this.details.rateVerified = true;
      } else {
        this.details.rateVerified = false;
      }
    }
    if (this.details.terms.regionalAvg.retailRentalTotal > 0) {
      this.details.terms.regionalAvg.retailRentalDelta = Math.abs(
        +Number(
          100 *
            ((+this.details.terms.regionalAvg.retailRentalTotal -
              +this.details.invoice) /
              +this.details.invoice)
        ).toFixed(2)
      );
    }
  }

  rateVerified(): boolean {
    if (this.type === 'equipmentActive' || this.type === 'equipmentStandby') {
      return this.amount > 0;
    } else if (this.type === 'equipmentRental') {
      return this.details.rateVerified;
    }
  }

  setDetailsFromConfiguration(m: any) {
    this.details.make = m.make || m.manufacturerName || '';
    this.details.manufacturerId = m.makeId || m.manufacturerId || '';
    this.details.model = m.model || m.modelName || '';
    this.details.modelId = m.modelId || '';
    this.details.categoryName = m.categoryName || '';
    this.details.categoryId = m.categoryId || '';
    this.details.subtypeName = m.subtypeName || '';
    this.details.subtypeId = m.subtypeId || '';
    this.details.sizeClassId = m.sizeClassId || '';
    this.details.sizeClassName = m.sizeClassName || '';
    this.details.subSize = m.subtypeName + ' ' + this.details.sizeClassName;
  }

  detailsDisplay() {
    if (
      this.type.toLowerCase() === 'equipmentActive' ||
      this.type.toLowerCase() === 'equipmentStandby' ||
      this.type.toLowerCase() === 'equipmentRental'
    ) {
      return this.details.make + ' ' + this.details.model;
    } else {
      return this.details.description;
    }
  }

  setDisplayType() {
    if (!this.type) {
      this.displayType = 'Other';
    }
    if (this.type.toLowerCase() === 'equipmentActive') {
      this.displayType = 'Equipment|Active';
      this.calculateActiveComps();
    } else if (this.type.toLowerCase() === 'equipmentStandby') {
      this.displayType = 'Equipment|Standby';
    } else if (this.type.toLowerCase() === 'equipmentRental') {
      this.displayType = 'Equipment|Rental';
      this.calculateRentalComps();
    } else if (this.type.toLowerCase() === 'labor') {
      this.displayType = 'Labor';
    } else if (this.type.toLowerCase() === 'material') {
      this.displayType = 'Material';
    } else if (this.type.toLowerCase() === 'subcontractor') {
      this.displayType = 'Subcontractor';
    } else {
      this.displayType = 'Other';
    }
  }

  setAmounts() {
    if (!this.details.rate) {
      this.details.rate = 0;
    }
    if (!this.details.method) {
      this.details.method = 0;
    }
    if (!this.details.transport) {
      this.details.transport = 0;
    }
    if (!this.details.hours) {
      this.details.hours = 0;
    } else if (this.details.hours) {
      this.details.hours = Math.round(this.details.hours);
    }
    if (!this.details.base) {
      this.details.base = 0;
    }
  }

  buildDetails(details: any) {
    if (!details) {
      details = {};
    }
    const d = details;
    if (details.type === 'labor') {
      d['employee'] = {
        firstName: details.firstName,
        lastName: details.lastName
      };
    }
    return d;
  }

  constructor(data: any) {
    {
      this.details = this.buildDetails(data);

      this.id = data.id || '';
      this.requestId = data.requestId || '';
      this.eSig = data.eSig || '';
      this.age = data.age || 0;
      this.subtotal = data.subtotal || this.details.subtotal || 0;
      this.amount = data.amount || 0;
      this.overdue = data.overdue || false;
      this.type = data.type || 'Other';
      this.submittedBy = data.submittedBy || data.userId || '';
      this.submittedOn = data.submittedOn || new Date();
      this.changeReason = data.changeReason || '';
      this.rejectReason = data.rejectReason || '';
      this.totalAdjusted = data.totalAdjusted || 0;
      this.approvedBy = data.approvedBy || '';
      this.approvedOn = data.approvedOn || new Date();
      this.comments = data.comments || [];
      this.attachments = data.attachments || [];

      this.buildRentalDates();

      if (this.details.startDate) {
        this.details.startDate = new Date(data.details.startDate);
      } else {
        this.details.startDate = new Date();
      }
      if (this.details.endDate) {
        this.details.endDate = new Date(data.details.endDate);
      } else {
        this.details.endDate = new Date();
      }
      if (this.details.startDate && this.details.endDate) {
        const diff = Math.abs(
          this.details.endDate.getTime() - this.details.startDate.getTime()
        );
        let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        if (diffDays === 0) {
          diffDays = 1;
        }
        this.details.numDays = diffDays;
      }
      this.buildDateRange();
      if (
        this.details.subtypeName &&
        (this.details.sizeClassName &&
          this.details.sizeClassName !== '' &&
          this.details.sizeClassName !== undefined)
      ) {
        this.details.subSize =
          this.details.subtypeName + ' ' + this.details.sizeClassName;
      } else if (this.details.subtypeName) {
        this.details.subSize = this.details.subtypeName;
      } else {
        this.details.subSize = this.details.sizeClassName;
      }
      this.setDisplayType();
      this.setAmounts();

      if (!this.details) {
        this.details = {
          selectedConfiguration: {
            hourlyOperatingCost: 0,
            hourlyOwnershipCost: 0,
            dailyOwnershipCost: 0,
            weeklyOwnershipCost: 0,
            monthlyOwnershipCost: 0
          }
        };
      }
      if (!this.details.selectedConfiguration) {
        this.details.selectedConfiguration = {
          hourlyOperatingCost: 0,
          hourlyOwnershipCost: 0,
          dailyOwnershipCost: 0,
          weeklyOwnershipCost: 0,
          monthlyOwnershipCost: 0
        };
      }
    }
  }
}

export class Project {
  id: string;
  zipcode: 902010;
  state: 'GA';
  active = true;
  name: string;
  age: number;
  meta: any;
  requestStats: any;
  description: string;
  itemsOverdue: number;
  itemsPending: number;
  paymentTerms: number;
  account: Account;
  organization: string;
  createdOn: Date;
  createdBy: string;
  modifiedOn: Date;
  modifiedBy: string;
  numContractors: number;
  users: User[];
  requestors: User[];
  requestorJSON: any[];
  userJSON: any[];
  adjustments: any;
  draftRequests: Request[];
  pendingRequests: Request[];
  completeRequests: Request[];
  requestJSON: any;
  pendingTotal = 0;
  approvedTotal = 0;
  roles: any[];
  accountRoles: any[];
  projectRoles: any[];
  total = 0;
  activeDays = 0;
  materialTotal = 0;
  laborTotal = 0;
  equipmentTotal = 0;
  subcontractorTotal = 0;
  otherTotal = 0;
  progress = 0;
  statuses = ['Draft', 'Pending', 'Complete'];

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  calculateCosts(includeDraft, includePending, includeComplete) {
    let total = 0;
    let laborTotal = 0;
    let equipmentTotal = 0;
    let materialTotal = 0;
    let subcontractorTotal = 0;
    let otherTotal = 0;
    if (includeDraft) {
      for (let i = 0; i < this.draftRequests.length; i++) {
        const r = this.draftRequests[i];
        total += +r.total;
        laborTotal += +r.laborTotal;
        equipmentTotal += +r.equipmentTotal;
        materialTotal += +r.materialTotal;
        subcontractorTotal += +r.subcontractorTotal;
        otherTotal += +r.otherTotal;
      }
    }
    if (includePending) {
      for (let i = 0; i < this.pendingRequests.length; i++) {
        const r = this.pendingRequests[i];
        total += +r.total;
        laborTotal += +r.laborTotal;
        equipmentTotal += +r.equipmentTotal;
        materialTotal += +r.materialTotal;
        subcontractorTotal += +r.subcontractorTotal;
        otherTotal += +r.otherTotal;
      }
    }
    if (includeComplete) {
      for (let i = 0; i < this.completeRequests.length; i++) {
        const r = this.completeRequests[i];
        total += +r.total;
        laborTotal += +r.laborTotal;
        equipmentTotal += +r.equipmentTotal;
        materialTotal += +r.materialTotal;
        subcontractorTotal += +r.subcontractorTotal;
        otherTotal += +r.otherTotal;
      }
    }
    this.total = total;
    this.subcontractorTotal = subcontractorTotal;
    this.laborTotal = laborTotal;
    this.materialTotal = materialTotal;
    this.otherTotal = otherTotal;
    this.equipmentTotal = equipmentTotal;
  }

  buildRequests(requestJSON: any) {
    this.requestJSON = requestJSON;
    this.draftRequests = [];
    this.pendingRequests = [];
    this.completeRequests = [];
    let total = 0;
    let laborTotal = 0;
    let equipmentTotal = 0;
    let materialTotal = 0;
    let subcontractorTotal = 0;
    let otherTotal = 0;
    for (let i = 0; i < requestJSON.length; i++) {
      const r = new Request(requestJSON[i]);
      total += +r.total;
      laborTotal += +r.laborTotal;
      equipmentTotal += +r.equipmentTotal;
      materialTotal += +r.materialTotal;
      subcontractorTotal += +r.subcontractorTotal;
      otherTotal += +r.otherTotal;
      if (r.status.toLowerCase() === 'draft') {
        this.draftRequests.push(r);
      }
      if (r.status.toLowerCase() === 'pending') {
        this.pendingRequests.push(r);
      }
      if (r.status.toLowerCase() === 'complete') {
        this.completeRequests.push(r);
      }
    }
    this.total = total;
    this.subcontractorTotal = subcontractorTotal;
    this.laborTotal = laborTotal;
    this.materialTotal = materialTotal;
    this.otherTotal = otherTotal;
    this.equipmentTotal = equipmentTotal;
  }

  buildUsers() {
    this.users = [];
    this.requestors = [];
    for (let i = 0; i < this.userJSON.length; i++) {
      const u = new User(this.userJSON[i]);
      if (u.containsRole('ProjectRequestor')) {
        this.requestors.push(u);
      } else {
        this.users.push(u);
      }
    }
  }

  checkAdjustments() {
    if (!this.adjustments) {
      return this.buildDefaultAdjustments();
    }
    if (
      this.adjustments.equipmentActive &&
      !this.adjustments.equipmentActive.operating
    ) {
      this.adjustments.equipmentActive.operating = 100;
    }
    if (
      this.adjustments.equipmentActive &&
      !this.adjustments.equipmentActive.ownership
    ) {
      this.adjustments.equipmentActive.ownership = 100;
    }

    if (
      this.adjustments.subcontractor &&
      this.adjustments.subcontractor.markup &&
      Number(this.adjustments.subcontractor.markup) < 1
    ) {
      this.adjustments.subcontractor.markup = +Number(
        this.adjustments.subcontractor.markupPercent * 100
      ).toFixed(0);
    }
    if (
      this.adjustments.other &&
      this.adjustments.other.markup &&
      Number(this.adjustments.other.markup) < 1
    ) {
      this.adjustments.other.markup = +Number(
        this.adjustments.other.markupPercent * 100
      ).toFixed(0);
    }
    if (
      this.adjustments.material &&
      this.adjustments.material.markup &&
      Number(this.adjustments.material.markup) < 1
    ) {
      this.adjustments.material.markup = +Number(
        this.adjustments.material.markupPercent * 100
      ).toFixed(0);
    }
    if (
      this.adjustments.equipment &&
      this.adjustments.equipmentActive &&
      this.adjustments.equipmentActive.markup &&
      Number(this.adjustments.equipmentActive.markup) < 1
    ) {
      this.adjustments.equipmentActive.markup = +Number(
        this.adjustments.equipmentActive.markupPercent * 100
      ).toFixed(0);
    }
    if (
      this.adjustments.equipment &&
      this.adjustments.equipmentStandby &&
      this.adjustments.equipmentStandby.markup &&
      Number(this.adjustments.equipmentStandby.markup) < 1
    ) {
      this.adjustments.equipmentStandby.markup = +Number(
        this.adjustments.equipmentStandby.markupPercent * 100
      ).toFixed(0);
    }
    if (
      this.adjustments.equipment &&
      this.adjustments.equipmentRental &&
      this.adjustments.equipmentRental.markup &&
      Number(this.adjustments.equipmentRental.markup) < 1
    ) {
      this.adjustments.equipmentRental.markup = +Number(
        this.adjustments.equipmentRental.markupPercent * 100
      ).toFixed(0);
    }
    if (
      this.adjustments.labor &&
      this.adjustments.labor.markup &&
      Number(this.adjustments.labor.markup) < 1
    ) {
      this.adjustments.labor.markup = +Number(
        this.adjustments.labor.markupPercent * 100
      ).toFixed(0);
    }
  }

  buildMarkup() {
    if (this.adjustments.equipmentActive) {
      this.adjustments.equipmentActive.markup = +Number(
        this.adjustments.equipmentActive.markupPercent * 100
      ).toFixed(0);
      this.adjustments.equipmentActive.operating =
        100 * +this.adjustments.equipmentActive.operatingPercent;
      this.adjustments.equipmentActive.ownership =
        100 * +this.adjustments.equipmentActive.ownershipPercent;
    }
    if (this.adjustments.equipmentStandby) {
      this.adjustments.equipmentStandby.markup = +Number(
        this.adjustments.equipmentStandby.markupPercent * 100
      ).toFixed(0);
      if (this.adjustments.equipmentStandby.operatingPercent) {
        this.adjustments.equipmentStandby.operating =
          100 * +this.adjustments.equipmentStandby.operatingPercent;
      }
      if (this.adjustments.equipmentStandby.ownershipPercent) {
        this.adjustments.equipmentStandby.ownership = +Number(
          100 * +this.adjustments.equipmentStandby.ownershipPercent
        ).toFixed(0);
      }
    }
    if (this.adjustments.equipmentRental) {
      this.adjustments.equipmentRental.markup = +Number(
        100 * +this.adjustments.equipmentRental.markupPercent
      ).toFixed(0);
    }
    if (this.adjustments.labor) {
      this.adjustments.labor.markup = +Number(
        100 * +this.adjustments.labor.markupPercent
      ).toFixed(0);
    }
    if (this.adjustments.other) {
      this.adjustments.other.markup = +Number(
        100 * +this.adjustments.other.markupPercent
      ).toFixed(0);
    }
    if (this.adjustments.material) {
      this.adjustments.material.markup = +Number(
        100 * +this.adjustments.material.markupPercent
      ).toFixed(0);
    }
    if (this.adjustments.subcontractor) {
      this.adjustments.subcontractor.markup = +Number(
        100 * +this.adjustments.subcontractor.markupPercent
      ).toFixed(0);
    }
  }

  buildCostEnabled(p: any) {
    if (
      p.adjustments &&
      !p.adjustments.equipmentActive.hasOwnProperty('enabled') &&
      p.hasOwnProperty('equipmentCostsEnabled') &&
      (p.equipmentCostsEnabled ||
        p.equipmentCostsEnabled === null ||
        p.equipmentCostsEnabled === 'null')
    ) {
      this.adjustments.equipmentActive.enabled = true;
      this.adjustments.equipmentRental.enabled = true;
      this.adjustments.equipmentStandby.enabled = true;
    }
    if (
      p.adjustments &&
      !p.adjustments.material.hasOwnProperty('enabled') &&
      p.hasOwnProperty('materialCostsEnabled') &&
      p.materialCostsEnabled
    ) {
      this.adjustments.material.enabled = p.materialCostsEnabled;
    }
    if (
      p.adjustments &&
      !p.adjustments.labor.hasOwnProperty('enabled') &&
      p.hasOwnProperty('laborCostsEnabled') &&
      p.laborCostsEnabled
    ) {
      this.adjustments.labor.enabled = p.laborCostsEnabled;
    }
    if (
      p.adjustments &&
      !p.adjustments.subcontractor.hasOwnProperty('enabled') &&
      p.hasOwnProperty('subcontractorCostsEnabled') &&
      p.subcontractorCostsEnabled
    ) {
      this.adjustments.subcontractor.enabled = p.subcontractorCostsEnabled;
    }
    if (
      p.adjustments &&
      !p.adjustments.other.hasOwnProperty('enabled') &&
      p.hasOwnProperty('otherCostsEnabled') &&
      p.otherCostsEnabled
    ) {
      this.adjustments.other.enabled = p.otherCostsEnabled;
    }
  }

  buildDefaultAdjustments() {
    return {
      equipmentActive: {
        enabled: true,
        regionalAdjustmentsEnabled: true,
        operating: 100,
        ownership: 100,
        markup: 10,
        operatingPercent: 1,
        ownershipPercent: 1,
        markupPercent: 0.1
      },
      equipmentStandby: {
        enabled: true,
        regionalAdjustmentsEnabled: true,
        markup: 10,
        markupPercent: 0.1
      },
      equipmentRental: { enabled: true, markup: 10, markupPercent: 0.1 },

      labor: { markup: 10, markupPercent: 0.1, enabled: true },
      material: { markup: 10, markupPercent: 0.1, enabled: true },
      other: { markup: 10, markupPercent: 0.1, enabled: true },
      subcontractor: { markup: 10, markupPercent: 0.1, enabled: true }
    };
  }

  constructor(project: any) {
    {
      this.id = project.id || '';
      this.meta = project.meta || {};
      if (!project.meta) {
        project.meta = {
          name: '',
          paymentTerms: 45,
          description: '',
          state: 'GA',
          requestingOrgs: [],
          zipcode: 30332
        };
      }
      this.requestStats = project.requestStats || {};
      if (!this.requestStats.pendingMaxAge) {
        this.requestStats.pendingMaxAge = 0;
      }
      if (!this.requestStats.pendingCount) {
        this.requestStats.pendingCount = 0;
      }
      this.zipcode = project.meta.zipcode || project.zipcode || 30332;
      this.state = project.meta.state || project.state || 'GA';
      this.active = project.active || true;
      this.name =
        project.meta.name || project.name || project.projectName || '';
      this.createdBy = project.createdBy || '';
      this.createdOn = new Date(project.createdOn);

      this.paymentTerms =
        project.meta.paymentTerms || project.paymentTerms || 45;
      this.description =
        project.meta.description ||
        project.description ||
        project.projectInstructions ||
        '';

      this.userJSON = project.users || [];
      if (!project.account && project.accountId) {
        this.account = new Account({ id: project.accountId });
      } else {
        this.account = project.account || new Account({});
      }
      this.roles = project.roles;
      this.accountRoles = project.accountRoles || [];
      this.projectRoles = project.projectRoles || [];
      this.adjustments = project.adjustments || this.buildDefaultAdjustments();
      this.buildMarkup();
      if (!this.adjustments.labor) {
        this.adjustments.labor = {
          enabled: true,
          markup: 10,
          markupPerect: 0.1
        };
      }

      if (!this.adjustments.other) {
        this.adjustments.other = {
          enabled: true,
          markup: 10,
          markupPerect: 0.1
        };
      }

      if (!this.adjustments.equipmentRental) {
        this.adjustments.equipmentRental = {
          enabled: true,
          markup: 10,
          markupPerect: 0.1
        };
      }

      this.buildCostEnabled(project);
      this.buildRequests(project.requests || []);
      this.checkAdjustments();
      this.buildUsers();
      const today = new Date();
      const diff = Math.abs(today.getTime() - this.createdOn.getTime());
      this.activeDays = Math.ceil(diff / (1000 * 3600 * 24));
    }
  }
}

export interface Email {
  email: string;
}

export interface Admin {
  id: string;
  email: string;
}

export class Account {
  id: string;
  organization: string;
  accountName: string;
  roles: string[];
  users: User[];
  email: string;
  active = true;
  adminsList: string;

  isActive() {
    return this.active;
  }

  constructor(a: any) {
    {
      this.id = a.id || '';
      this.organization = a.organization || '';
      this.accountName = a.accountName || this.organization || '';
      this.roles = a.roles || [];
      this.email = a.email || '';
      this.users = a.users || [];
      this.active = a.active || true;
    }
  }
}

export class Signatures {
  contractorName: string;
  dotName: string;
  date: Date;
  constructor(signatures: any) {
    {
      this.contractorName = signatures.contractorName || '';
      this.dotName = signatures.dotName || '';
      this.date = signatures.date || new Date();
    }
  }
}

export class Equipment {
  id: string;
  guid: string;
  make: string;
  makeId: string;
  model: string;
  modelId: string;
  misc = false;
  configurations: any;
  selectedConfiguration: any;
  year = '';
  vin: string;
  status: string;
  description: string;
  dateIntroduced: Date;
  dateDiscontinued: Date;
  years: any[];
  baseRental: number;
  fhwa: number;
  method: number;
  display: string;
  categoryId: number;
  sizeClassMin: number;
  sizeClassMax: number;
  sizeClassUom: string;
  sizeClassName: string;
  categoryName: string;
  subSize: string;
  classificationName: string;
  subtypeName: string;
  sizeClassId: number;
  classificationId: string;
  subtypeId: number;
  nationalAverages: any;
  regionalAverages: any;
  rentalHouseRates: any;
  type: string;
  details: any;
  revert: any;
  beingEdited = false;

  setDetailsFromConfiguration() {
    this.make =
      this.details.selectedConfiguration.make ||
      this.details.selectedConfiguration.manufacturerName ||
      '';
    this.makeId =
      this.details.selectedConfiguration.makeId ||
      this.details.selectedConfiguration.manufacturerId ||
      '';
    this.model =
      this.details.selectedConfiguration.model ||
      this.details.selectedConfiguration.modelName ||
      '';
    this.modelId = this.details.selectedConfiguration.modelId || '';
    this.categoryName = this.details.selectedConfiguration.categoryName || '';
    this.categoryId = this.details.selectedConfiguration.categoryId || '';
    this.subtypeName = this.details.selectedConfiguration.subtypeName || '';
    this.subtypeId = this.details.selectedConfiguration.subtypeId || '';
    this.sizeClassId = this.details.selectedConfiguration.sizeClassId || '';
    this.sizeClassName = this.details.selectedConfiguration.sizeClassName || '';
    this.subSize =
      this.details.selectedConfiguration.subtypeName + ' ' + this.sizeClassName;
  }

  generateYears() {
    if (!this.dateIntroduced) {
      this.dateIntroduced = new Date(0);
    }
    let startYear = this.dateIntroduced.getFullYear();
    const nowYear = new Date().getFullYear() - 29;

    startYear = +Math.max(+startYear, +nowYear);

    const endYear = this.dateDiscontinued.getFullYear();

    this.years = [];
    for (let i = startYear; i <= endYear; i++) {
      this.years.push({ year: i });
    }
  }

  constructor(m: any) {
    this.id = m.id || '';
    this.details = m.details || { id: '', serial: '', year: '' };
    this.guid = m.guid || '';
    this.make = m.make || m.manufacturerName || '';
    this.makeId = m.makeId || m.manufacturerId || '';
    this.model = m.model || m.modelName || '';
    this.modelId = m.modelId || '';
    this.misc = this.make.toUpperCase() === 'MISCELLANEOUS';
    this.configurations = m.specs || m.configurations || {};
    if (m.dateIntroduced && m.dateIntroduced !== '') {
      if (m.dateIntroduced instanceof Date) {
        this.dateIntroduced = m.dateIntroduced;
      } else {
        this.dateIntroduced = DateTime.fromISO(m.dateIntroduced).toJSDate();
      }
    } else {
      this.dateIntroduced = new Date(0);
    }

    if (m.dateDiscontinued && m.dateDiscontinued !== '') {
      if (m.dateDiscontinued instanceof Date) {
        this.dateDiscontinued = m.dateDiscontinued;
      } else {
        this.dateDiscontinued = DateTime.fromISO(m.dateDiscontinued).toJSDate();
      }
    } else {
      this.dateDiscontinued = DateTime.local().toJSDate();
    }

    if (m.details) {
      this.vin = m.details.vin || m.details.serial || 0;
      if (m.details.year) {
        this.year = m.details.year || '';
      }
    } else {
      this.vin = m.vin || m.serial || 0;
      this.year = m.year || '';
    }

    if (this.details && !this.details.selectedConfiguration) {
      this.details.selectedConfiguration = {
        hourlyOperatingCost: 0,
        hourlyOwnershipCost: 0,
        dailyOwnershipCost: 0,
        weeklyOwnershipCost: 0,
        monthlyOwnershipCost: 0
      };
    }

    this.description = m.description || m.categoryName || '';
    this.baseRental = Number(m.baseRental) || Number(m.base) || 0;
    this.fhwa = Number(m.fhwa) || 0;
    this.method = Number(m.method) || 0;
    this.categoryName = m.categoryName || '';
    this.categoryId = m.categoryId || '';
    this.subtypeName = m.subtypeName || '';
    this.subtypeId = m.subtypeId || '';
    this.sizeClassId = m.sizeClassId || '';
    this.sizeClassName = m.sizeClassName || '';
    if (this.subtypeName && this.sizeClassName) {
      this.subSize = this.subtypeName + ' ' + this.sizeClassName;
    } else if (this.sizeClassName) {
      this.subSize = this.sizeClassName;
    } else {
      this.subSize = '';
    }

    this.classificationId = m.classificationId;
    this.classificationName = m.classificationName;
    this.rentalHouseRates = m.rentalHouseRates;
    this.nationalAverages = m.nationalAverages;
    this.regionalAverages = m.regionalAverages;
    if (m.details && m.details.type) {
      this.type = m.details.type;
    } else {
      this.type = m.type || this.model;
    }

    this.calculateHourlyRates();
    this.generateYears();
    this.display = this.make + ' ' + this.model;
  }

  setNoCost() {
    this.details.selectedConfiguration = {
      hourlyOperatingCost: 0,
      hourlyOwnershipCost: 0,
      dailyOwnershipCost: 0,
      weeklyOwnershipCost: 0,
      monthlyOwnershipCost: 0
    };
  }

  resetSelectedConfiguration() {
    this.details.selectedConfiguration = {
      hourlyOperatingCost: 0,
      hourlyOwnershipCost: 0,
      dailyOwnershipCost: 0,
      weeklyOwnershipCost: 0,
      monthlyOwnershipCost: 0
    };
  }

  calculateHourlyRates() {
    if (
      this.details.rates &&
      this.details.rates.ownership_monthly_calculated_hourly > 0
    ) {
      return;
    }

    this.details.rates = {
      ownership_monthly_calculated_hourly: 0,
      ownership_weekly_calculated_hourly: 0,
      ownership_daily_calculated_hourly: 0,
      ownership_hourly_calculated_hourly: 0,
      operating_hourly_calculated_hourly: 0
    };

    if (
      this.details.selectedConfiguration &&
      this.details.selectedConfiguration.rates
    ) {
      this.details.rates.ownership_monthly_calculated_hourly = +Number(
        +this.details.selectedConfiguration.rates.monthlyOwnershipCostFinal /
          176
      ).toFixed(2);
      this.details.rates.ownership_weekly_calculated_hourly = +Number(
        +this.details.selectedConfiguration.rates.weeklyOwnershipCostFinal / 40
      ).toFixed(2);
      this.details.rates.ownership_daily_calculated_hourly = +Number(
        +this.details.selectedConfiguration.rates.dailyOwnershipCostFinal / 8
      ).toFixed(2);
      this.details.rates.ownership_hourly_calculated_hourly = +Number(
        +this.details.selectedConfiguration.rates.hourlyOwnershipCostFinal
      ).toFixed(2);
      this.details.rates.operating_hourly_calculated_hourly = +Number(
        +this.details.selectedConfiguration.rates.hourlyOperatingCostFinal
      ).toFixed(2);
    }
  }

  buildDisplay() {
    this.display = this.make + ' ' + this.model;
  }

  buildRates(duration: number = 1) {
    if (
      this.type === 'equipmentRental' &&
      this.nationalAverages &&
      this.nationalAverages.length > 0
    ) {
      this.baseRental =
        Number(this.nationalAverages[0].dailyRate * duration) || 0;
    }
  }
}

export interface Dispute {
  id: string;
  comments: string;
  type: string;
  issue: string;
  amount: number;
  disputeReqest: string;
  date: Date;
}

export class Utils {
  static getItemDisplayType(itemType) {
    itemType = itemType.toLowerCase();
    switch (itemType) {
      case 'equipmentactive': {
        return 'Equipment|Active';
      }
      case 'equipmentstandby': {
        return 'Equipment|Standby';
      }
      case 'equipmentrental': {
        return 'Equipment|Rental';
      }
      case 'material': {
        return 'Material';
      }
      case 'labor': {
        return 'Labor';
      }
      case 'subcontractor': {
        return 'Subcontractor';
      }
      case 'other': {
        return 'Other';
      }
      default: {
        return 'Other';
      }
    }
  }
}

export class ItemList {
  type: string;
  displayType: string;
  items: Item[];
  sortOrder: number;

  setDisplayType() {
    if (!this.type) {
      this.displayType = 'Other';
      this.sortOrder = 6;
    }
    if (
      this.type.toLowerCase() === 'equipmentActive' ||
      this.type.toLowerCase() === 'equipmentactive'
    ) {
      this.displayType = 'Equipment|Active';
      this.sortOrder = 1;
    } else if (
      this.type.toLowerCase() === 'equipmentStandby' ||
      this.type.toLowerCase() === 'equipmentstandby'
    ) {
      this.displayType = 'Equipment|Standby';
      this.sortOrder = 2;
    } else if (
      this.type.toLowerCase() === 'equipmentRental' ||
      this.type.toLowerCase() === 'equipmentrental'
    ) {
      this.displayType = 'Equipment|Rental';
      this.sortOrder = 3;
    } else if (this.type.toLowerCase() === 'labor') {
      this.displayType = 'Labor';
      this.sortOrder = 0;
    } else if (this.type.toLowerCase() === 'material') {
      this.displayType = 'Material';
      this.sortOrder = 4;
    } else if (this.type.toLowerCase() === 'subcontractor') {
      this.displayType = 'Subcontractor';
      this.sortOrder = 5;
    } else {
      this.displayType = 'Other';
      this.sortOrder = 6;
    }
  }

  constructor(type: string, list: Item[]) {
    this.type = type || '';
    this.items = list;
    this.setDisplayType();
  }
}

export class Request {
  id: string;
  oneUp: string;
  meta: any;
  coord: any;
  name: string;
  project: Project;
  projectId: string;
  type: string;
  age: number;
  requestDate: Date;
  startDate: Date;
  dateRangeStr: string[];
  endDate: Date;
  dateRange: Date[];
  signatures: Signatures;
  total: number;
  messages: number;
  status: string;
  lineItems: any;
  activeMarkup = 0;
  standbyMarkup = 0;
  rentalMarkup = 0;
  materialMarkup = 0;
  laborMarkup = 0;
  laborBenefitsTotal = 0;
  subcontractorMarkup = 0;
  equipmentTotal = 0;
  equipmentSubtotal = 0;
  materialTotal = 0;
  materialSubtotal = 0;
  laborTotal = 0;
  otherTotal = 0;
  otherSubtotal = 0;
  otherMarkup = 0;
  subcontractorTotal = 0;
  subcontractorSubtotal = 0;
  laborSubtotal = 0;
  equipmentActiveSubtotal = 0;
  equipmentStandbySubtotal = 0;
  equipmentRentalSubtotal = 0;
  approved = false;
  pendingItems: Item[];
  completeItems: Item[];
  draftItems: Item[];
  paymentTerms: 0;
  itemsByType: ItemList[];
  unsortedItems: Item[];
  totalItems = 0;
  lineItemTotals: any;
  notes: string;
  submittedOn: string;
  submittedBy: string;
  createdOn: string;
  createdBy: string;
  lastModified: string;
  lastModifiedBy: string;
  canApprove = false; // can current user approve request?

  isDraft(): boolean {
    return (
      (!this.status && this.status === '') ||
      (this.status &&
        (this.status.toLowerCase() === 'new' ||
          this.status.toLowerCase() === 'draft'))
    );
  }

  buildDateRange() {
    if (!this.startDate && !this.endDate) {
      this.startDate = new Date();
      this.endDate = new Date();
    } else {
    }
    this.dateRange = [this.startDate, this.endDate];
  }

  isPending(): boolean {
    return this.status && this.status.toLowerCase() === 'pending';
  }

  isComplete(): boolean {
    return (
      this.status &&
      (this.status.toLowerCase() === 'complete' ||
        this.status.toLowerCase() === 'completed')
    );
  }

  getTotals(): any {
    return {
      total: this.total,
      equipmentTotal: this.equipmentTotal,
      materialTotal: this.materialTotal,
      laborTotal: this.laborTotal,
      subcontractorTotal: this.subcontractorTotal,
      otherTotal: this.otherTotal
    };
  }

  sortLineItemsByAge() {
    if (this.pendingItems) {
      this.pendingItems.sort((n1, n2) => {
        if (n2.age > n1.age) {
          return 1;
        }

        if (n2.age < n1.age) {
          return -1;
        }

        return 0;
      });
    }
    if (this.completeItems) {
      this.completeItems.sort((n1, n2) => {
        if (n2.age > n1.age) {
          return 1;
        }

        if (n2.age < n1.age) {
          return -1;
        }

        return 0;
      });
    }
  }
  isOverdue(li: any) {
    return +li.age > +this.paymentTerms;
  }

  groupByType() {
    return this.unsortedItems.reduce(function(groups, item) {
      const val = item['type'];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  }

  hasLineItemsByType(type: string) {
    for (let i = 0; i < this.itemsByType.length; i++) {
      const lit: ItemList = this.itemsByType[i];
      if (lit.type === type && lit.items && lit.items.length > 0) {
        return true;
      }
    }
    return false;
  }

  hasLineItems() {
    for (let i = 0; i < this.itemsByType.length; i++) {
      const lit: ItemList = this.itemsByType[i];
      if (lit.items && lit.items.length > 0) {
        return true;
      }
    }
    return false;
  }

  calculateTotals() {
    const total = 0;
    const equipmentTotal = 0;
    const materialTotal = 0;
    const activeTotal = 0;
    const standbyTotal = 0;
    const rentalTotal = 0;
    const otherSubtotal = 0;
    let laborTotal = 0;
    const laborSubtotal = 0;
    let laborBenefits = 0;
    const subcontractorTotal = 0;

    for (let i = 0; i < this.itemsByType.length; i++) {
      const lit: ItemList = this.itemsByType[i];
      const items: Item[] = lit.items;
      for (let j = 0; j < items.length; j++) {
        const currentItem: Item = items[j];

        if (currentItem.type === 'equipmentRental') {
          // rentalTotal += Number(lt);
        } else if (currentItem.type === 'equipmentActive') {
          //  activeTotal += Number(lt);
        } else if (currentItem.type === 'equipmentStandby') {
          //  standbyTotal += Number(lt);
        } else if (currentItem.type === 'other') {
          // otherSubtotal += Number(lt);
        } else if (currentItem.type === 'material') {
          // materialTotal += Number(lt);
        } else if (currentItem.type === 'subcontractor') {
          // subcontractorTotal += Number(lt);
        } else if (currentItem.type === 'labor') {
          // laborSubtotal += Number(lt);
          if (currentItem.details.benefits) {
            const totalHours =
              +currentItem.details.time2 +
              +currentItem.details.time15 +
              +currentItem.details.time1;
            const totalBennies = +currentItem.details.benefits * totalHours;
            laborBenefits += +totalBennies;
          }
        }
      }
    }

    if (
      this.project &&
      this.project.adjustments &&
      this.project.adjustments.equipment
    ) {
      this.activeMarkup =
        +this.project.adjustments.equipmentActive.markupPercent *
        +this.equipmentActiveSubtotal;

      this.standbyMarkup =
        +this.project.adjustments.equipmentStandby.markup *
        +this.equipmentStandbySubtotal;

      this.rentalMarkup =
        +this.project.adjustments.equipmentRental.markupPercent *
        +this.equipmentRentalSubtotal;
    }
    this.equipmentTotal =
      this.equipmentActiveSubtotal +
      this.activeMarkup +
      this.standbyMarkup +
      this.equipmentStandbySubtotal +
      this.rentalMarkup +
      this.equipmentRentalSubtotal;
    this.laborBenefitsTotal = laborBenefits;

    if (
      this.project &&
      this.project.adjustments &&
      this.project.adjustments.labor
    ) {
      this.laborMarkup =
        +this.project.adjustments.labor.markupPercent * this.laborSubtotal;
    }
    laborTotal = +this.laborSubtotal + +this.laborBenefitsTotal;

    this.laborTotal = laborTotal + this.laborMarkup;
    if (
      this.project &&
      this.project.adjustments &&
      this.project.adjustments.subcontractor
    ) {
      this.subcontractorMarkup =
        +this.project.adjustments.subcontractor.markupPercent *
        +this.subcontractorTotal;
    }
    this.subcontractorTotal =
      +this.subcontractorTotal + this.subcontractorMarkup;

    if (
      this.project &&
      this.project.adjustments &&
      this.project.adjustments.other
    ) {
      this.otherMarkup =
        +this.project.adjustments.other.markupPercent * this.otherSubtotal;
    }
    this.otherTotal = this.otherSubtotal; // + this.otherMarkup;
    if (
      this.project &&
      this.project.adjustments &&
      this.project.adjustments.material
    ) {
      this.materialMarkup =
        +this.project.adjustments.material.markupPercent *
        this.materialSubtotal;
    }
    this.materialTotal = this.materialSubtotal + this.materialMarkup;

    this.total =
      this.materialTotal +
      this.laborTotal +
      this.otherTotal +
      this.subcontractorTotal +
      this.equipmentTotal;
  }

  buildLineItems() {
    const laborBenefits = 0;
    this.pendingItems = [];
    this.completeItems = [];
    this.draftItems = [];
    this.itemsByType = [];
    this.unsortedItems = [];
    const types = Object.keys(this.lineItems);
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      let typeItems = [];
      if (type === 'equipment') {
        // typeItems = this.lineItems[type].active.items;
        const equipmentTypes = Object.keys(this.lineItems[type]);
        for (let z = 0; z < equipmentTypes.length; z++) {
          const eType = equipmentTypes[z];
          typeItems = this.lineItems[type][eType].items;
          this.totalItems = +this.totalItems + +typeItems.length;
          const items = [];
          for (let j = 0; j < typeItems.length; j++) {
            const t = typeItems[j];
            t.type = type + '.' + eType;
            t.requestId = this.id;
            items.push(new Item(t));
          }
          this.itemsByType.push(new ItemList(type + '.' + eType, items));
        }
      } else {
        typeItems = this.lineItems[type].items;
        this.totalItems = +this.totalItems + +typeItems.length;
        const items = [];
        for (let j = 0; j < typeItems.length; j++) {
          const t = typeItems[j];
          t.type = type;
          t.requestId = this.id;
          items.push(new Item(t));
        }
        this.itemsByType.push(new ItemList(type, items));
      }
    }

    if (this.lineItemTotals) {
      this.totalItems = this.lineItemTotals.count;
      this.total = this.lineItemTotals.amount;
      this.equipmentTotal = this.lineItemTotals.equipment || 0;
      this.laborTotal = this.lineItemTotals.labor || 0;
      this.materialTotal = this.lineItemTotals.material || 0;
      this.otherTotal = this.lineItemTotals.other || 0;
      this.subcontractorTotal = this.lineItemTotals.subcontractor || 0;
    } else {
      if (this.project && this.project.adjustments) {
        this.activeMarkup =
          +this.project.adjustments.equipmentActive.markupPercent *
          +this.equipmentActiveSubtotal;
        this.standbyMarkup =
          +this.project.adjustments.equipmentStandby.markupPercent *
          +this.equipmentStandbySubtotal;
        this.rentalMarkup =
          +this.project.adjustments.equipmentRental.markupPercent *
          +this.equipmentRentalSubtotal;
      }

      this.equipmentTotal =
        +this.equipmentActiveSubtotal +
        this.activeMarkup +
        this.standbyMarkup +
        +this.equipmentStandbySubtotal +
        this.rentalMarkup +
        +this.equipmentRentalSubtotal;

      this.laborBenefitsTotal = laborBenefits;

      if (
        this.project &&
        this.project.adjustments &&
        this.project.adjustments.labor
      ) {
        this.laborMarkup =
          +this.project.adjustments.labor.markupPercent * +this.laborSubtotal;
      }

      this.laborTotal =
        +this.laborSubtotal + this.laborBenefitsTotal + this.laborMarkup;

      if (
        this.project &&
        this.project.adjustments &&
        this.project.adjustments.subcontractor
      ) {
        this.subcontractorMarkup =
          +this.project.adjustments.subcontractor.markupPercent *
          +this.subcontractorSubtotal;
      }

      this.subcontractorTotal =
        +this.subcontractorMarkup + +this.subcontractorSubtotal;
      if (
        this.project &&
        this.project.adjustments &&
        this.project.adjustments.material
      ) {
        this.materialMarkup =
          +this.project.adjustments.material.markupPercent *
          +this.materialSubtotal;
      }
      if (
        this.project &&
        this.project.adjustments &&
        this.project.adjustments.other
      ) {
        this.otherMarkup =
          +this.project.adjustments.other.markupPercent * +this.otherSubtotal;
      }
      this.otherTotal = +this.otherSubtotal + this.otherMarkup;
      this.materialTotal = +this.materialSubtotal + this.materialMarkup;
    }
    this.total =
      this.materialTotal +
      this.subcontractorTotal +
      this.equipmentTotal +
      this.laborTotal +
      this.otherTotal;
    const sorted = this.groupByType();
    // tslint:disable-next-line:forin
    for (const k in sorted) {
      this.itemsByType.push(new ItemList(k, sorted[k]));
    }
    this.itemsByType.sort((a, b) =>
      a.sortOrder < b.sortOrder ? -1 : a.sortOrder > b.sortOrder ? 1 : 0
    );
  }

  getItemsForType(type: string) {
    for (let i = 0; i < this.itemsByType.length; i++) {
      if (this.itemsByType[i].type === type) {
        return this.itemsByType[i].items;
      }
    }
    return [];
  }

  public constructor(request: any) {
    {
      this.id = request.id || '';
      this.oneUp = request.oneUp || '';
      this.meta = request.meta || {};
      this.coord = request.coord || {};
      this.canApprove = request.canApprove || false;
      this.submittedOn = request.submittedOn || '';
      this.submittedBy = request.submittedBy || '';
      this.createdOn = request.createdOn || '';
      this.createdBy = request.createdBy || '';
      this.lastModified = request.lastModified || '';
      this.lastModifiedBy = request.lastModifiedBy || '';
      this.materialSubtotal = +request.materialSubtotal || 0;
      this.laborSubtotal = +request.laborSubtotal || 0;
      this.otherSubtotal = +request.otherSubtotal || 0;
      this.subcontractorSubtotal = +request.subcontractorSubtotal || 0;
      this.equipmentActiveSubtotal = +request.equipmentActiveSubtotal || 0;
      this.equipmentStandbySubtotal = +request.equipmentStandbySubtotal || 0;
      this.equipmentRentalSubtotal = +request.equipmentRentalSubtotal || 0;
      if (request.meta && request.meta.notes) {
        this.notes = request.meta.notes;
      } else if (request.notes) {
        this.notes = request.notes || '';
      } else {
        this.notes = '';
      }
      this.name = request.name || '';
      this.projectId = request.projectId || '';
      this.type = request.type || 'Force Account';
      this.requestDate = request.requestDate || new Date();

      if (request.age) {
        this.age = request.age;
      } else {
        const diff = Math.abs(
          this.requestDate.getTime() - new Date().getTime()
        );
        this.age = Math.ceil(diff / (1000 * 3600 * 24));
      }

      const sd = request.startDate || request.start;
      if (sd && sd !== '') {
        this.startDate = DateTime.fromISO(sd, { zone: 'utc' }).toJSDate();
      } else {
        this.startDate = new Date();
      }
      const ed = request.endDate || request.end;
      if (ed && ed !== '') {
        this.endDate = DateTime.fromISO(ed, { zone: 'utc' }).toJSDate();
      } else {
        this.endDate = new Date(this.startDate);
      }

      this.signatures = request.signatures || new Signatures({});
      this.messages = request.messages || 0;
      this.total = request.total || 0;
      this.status = request.status || 'PENDING';
      this.lineItems = request.lineItems || [];
      this.lineItemTotals = request.lineItemTotals;
      this.buildLineItems();
      this.buildDateRange();
      this.sortLineItemsByAge();
    }
  }
}
