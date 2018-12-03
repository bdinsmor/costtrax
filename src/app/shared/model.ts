import { ClrDatagridComparatorInterface, ClrDatagridStringFilterInterface } from '@clr/angular';
import * as moment from 'moment';

import { DatesPipe } from '../core/pipes/dates.pipe';

export interface Breadcrumb {
  id: string;
  path: string;
  route: string;
  display: string;
}

export class EmployeeFirstNameFilter
  implements ClrDatagridStringFilterInterface<Employee> {
  accepts(employee: Employee, search: string): boolean {
    return employee.firstName.toLowerCase().indexOf(search) >= 0;
  }
}

export class EmployeeLastNameFilter
  implements ClrDatagridStringFilterInterface<Employee> {
  accepts(employee: Employee, search: string): boolean {
    return employee.lastName.toLowerCase().indexOf(search) >= 0;
  }
}

export class EmployeeTradeFilter
  implements ClrDatagridStringFilterInterface<Employee> {
  accepts(employee: Employee, search: string): boolean {
    return employee.trade.toLowerCase().indexOf(search) >= 0;
  }
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
  projectAdmin = false;
  projectObserve = false;
  requestManage = false;
  requestSubmit = false;

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
      this.projectAdmin = false;
      this.projectObserve = false;
      this.requestManage = false;
      this.requestSubmit = false;
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
    return this.containsRole('RequestSubmit');
  }

  hasRoles() {
    return this.roles.length > 0;
  }

  setRolesFromChecks(event) {
    if (this.requestSubmit) {
      this.addRole('RequestSubmit');
    } else {
      this.removeRole('RequestSubmit');
    }
    if (this.requestManage) {
      this.addRole('RequestManage');
    } else {
      this.removeRole('RequestManage');
    }
    if (this.projectAdmin) {
      this.addRole('ProjectAdmin');
    } else {
      this.removeRole('ProjectAdmin');
    }
    if (this.projectObserve) {
      this.addRole('ProjectObserve');
    } else {
      this.removeRole('ProjectObserve');
    }
  }

  removeRole(roleName: string) {
    if (this.containsRole(roleName)) {
      this.roles.splice(this.roles.indexOf(roleName), 1);
    }
  }
  setRoles() {
    this.requestManage = false;
    this.requestSubmit = false;
    this.projectAdmin = false;
    this.projectObserve = false;
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i] === 'RequestSubmit') {
        this.requestSubmit = true;
      } else if (this.roles[i] === 'RequestManage') {
        this.requestManage = true;
      } else if (this.roles[i] === 'ProjectAdmin') {
        this.projectAdmin = true;
      } else if (this.roles[i] === 'ProjectObserve') {
        this.projectObserve = true;
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

export class Activity {
  project: string;
  request: string;
  details: string;
  timestamp: Date;
  constructor(activity: any) {
    {
      this.project = activity.project || '';
      this.request = activity.request || '';
      this.details = activity.details || '';
      this.timestamp = activity.timestamp || new Date();
    }
  }
}

export class Adjustments {
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

export class Comment {
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
  finalAmount: number;
  subtotal: number;
  total: number;
  age: number;
  overdue: boolean;
  status: string;
  description: string;
  eSig: string;
  userId: string;
  displayType: string;

  isDraft(): boolean {
    return this.status && this.status.toLowerCase() === 'draft';
  }
}

export class OneUpComparator
  implements ClrDatagridComparatorInterface<Request> {
  compare(a: Request, b: Request) {
    return +a.oneUp - +b.oneUp;
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
  finalAmount: number;
  approvedOn: Date;
  approvedBy: string;
  status: string;
  type: string;
  startDate: Date;
  endDate: Date;
  changeReason: string;
  rejectReason: string;
  displayType: string;
  comments: Comment[];
  editDetails: any;
  revert: Item;
  beingEdited = false;

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
      this.details.dateIntroduced = moment().toDate();
    }
    if (!this.details.dateDiscontinued) {
      this.details.dateDiscontinued = moment().toDate();
    }
     let startYear = moment(this.details.dateIntroduced)
      .toDate()
      .getFullYear();
    const endYear = moment(this.details.dateDiscontinued)
      .toDate()
      .getFullYear();

  
    let nowYear = new Date().getFullYear() - 29;
    
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

  isDraft(): boolean {
    return !this.id || this.id.toLowerCase() === '';
  }

  isComplete(): boolean {
    return this.status && this.status.toLowerCase() === 'complete';
  }
  calculateActiveComps() {
    if (!this.amount || !this.details.selectedConfiguration) {
      return;
    }

    this.details.rateTotal = +Number(
      +this.details.selectedConfiguration.hourlyOwnershipCost +
        +this.details.selectedConfiguration.hourlyOperatingCost
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
      .selectedConfiguration.hourlyOwnershipCost;
    this.details.terms.blueBook.hourlyOperatingCost = +this.details
      .selectedConfiguration.hourlyOperatingCost;
    this.details.terms.blueBook.rateTotal = +Number(
      +this.details.terms.blueBook.hourlyOwnershipCost +
        +this.details.terms.blueBook.hourlyOperatingCost
    ).toFixed(2);
  }

  calculateRentalComps() {
    if (!this.details.invoice || !this.details.rentalBreakdown) {
      return;
    }

    this.details.terms = {
      blueBook: {
        dailyOwnershipCost: this.details.selectedConfiguration
          .dailyOwnershipCost,
        weeklyOwnershipCost: this.details.selectedConfiguration
          .weeklyOwnershipCost,
        monthlyOwnershipCost: this.details.selectedConfiguration
          .monthlyOwnershipCost,
        hourlyOwnershipCost: this.details.selectedConfiguration
          .hourlyOwnershipCost,
        hourlyOperatingCost: this.details.selectedConfiguration
          .hourlyOperatingCost,
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
    if (this.details.terms.blueBook.ownershipTotal > 0) {
      this.details.terms.blueBook.ownershipDelta = +Number(
        100 *
          (+this.details.invoice / +this.details.terms.blueBook.ownershipTotal)
      ).toFixed(2);
      if (+this.details.terms.blueBook.ownershipDelta >= 100) {
        this.details.rateVerified = false;
      } else {
        this.details.rateVerified = true;
      }
    }
    if (this.details.terms.regionalAvg.retailRentalTotal > 0) {
      this.details.terms.regionalAvg.retailRentalDelta = +Number(
        100 *
          (+this.details.invoice /
            +this.details.terms.regionalAvg.retailRentalTotal)
      ).toFixed(2);
    }
  }

  rateVerified(): boolean {
    if (this.type === 'equipment.active' || this.type === 'equipment.standby') {
      return !this.isDraft() && this.amount > 0;
    } else if (this.type === 'equipment.rental') {
      return !this.isDraft() && this.details.rateVerified;
    }
  }

  detailsDisplay() {
    if (
      this.type.toLowerCase() === 'equipment.active' ||
      this.type.toLowerCase() === 'equipment.standby' ||
      this.type.toLowerCase() === 'equipment.rental'
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
    if (this.type.toLowerCase() === 'equipment.active') {
      this.displayType = 'Equipment|Active';
      this.calculateActiveComps();
    } else if (this.type.toLowerCase() === 'equipment.standby') {
      this.displayType = 'Equipment|Standby';
    } else if (this.type.toLowerCase() === 'equipment.rental') {
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
    if (!this.details.fhwa) {
      this.details.fhwa = 0;
    }
    if (!this.details.method) {
      this.details.method = 0;
    }
    if (!this.details.transportation) {
      this.details.transportation = 0;
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

  constructor(data: any) {
    {
      if (!data.details) {
        data.details = {};
      }
      this.id = data.id || '';
      this.editMode = data.editMode || false;
      this.editDetails = data.editDetails || {};
      this.requestId = data.requestId || '';
      this.details = data.details || {};
      this.eSig = data.eSig || '';
      this.age = data.age || 0;
      this.subtotal = data.subtotal || this.details.subtotal || 0;
      this.amount = data.amount || 0;
      this.overdue = data.overdue || false;
      this.type = data.type || 'Other';
      this.submittedBy = data.submittedBy || data.userId || '';
      this.submittedOn = data.submittedOn || new Date();
      this.status = data.status || 'draft';
      this.changeReason = data.changeReason || '';
      this.rejectReason = data.rejectReason || '';
      this.finalAmount = data.finalAmount || 0;
      this.approvedBy = data.approvedBy || '';
      this.approvedOn = data.approvedOn || new Date();
      this.comments = data.comments || [];
      this.fromSaved = data.fromSaved || false;
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
  materialCostsEnabled = true;
  equipmentCostsEnabled = true;
  activeCostsEnabled = true;
  standbyCostsEnabled = true;
  rentalCostsEnabled = true;
  laborCostsEnabled = true;
  otherCostsEnabled = true;
  subcontractorCostsEnabled = true;
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
      if (u.containsRole('RequestSubmit')) {
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
      this.adjustments.equipment.active &&
      !this.adjustments.equipment.active.operating
    ) {
      this.adjustments.equipment.active.operating = 100;
    }
    if (
      this.adjustments.equipment.active &&
      !this.adjustments.equipment.active.ownership
    ) {
      this.adjustments.equipment.active.ownership = 100;
    }

    if (
      this.adjustments.subcontractor &&
      this.adjustments.subcontractor.markup &&
      Number(this.adjustments.subcontractor.markup) < 1
    ) {
      this.adjustments.subcontractor.markup =
        this.adjustments.subcontractor.markup * 100;
    } else {
      this.adjustments.subcontractor = { markup: 10 };
    }
    if (
      this.adjustments.other &&
      this.adjustments.other.markup &&
      Number(this.adjustments.other.markup) < 1
    ) {
      this.adjustments.other.markup = this.adjustments.other.markup * 100;
    } else {
      this.adjustments.other = { markup: 10 };
    }
    if (
      this.adjustments.material &&
      this.adjustments.material.markup &&
      Number(this.adjustments.material.markup) < 1
    ) {
      this.adjustments.material.markup = this.adjustments.material.markup * 100;
    } else {
      this.adjustments.material = { markup: 10 };
    }
    if (
      this.adjustments.equipment &&
      this.adjustments.equipment.active &&
      this.adjustments.equipment.active.markup &&
      Number(this.adjustments.equipment.active.markup) < 1
    ) {
      this.adjustments.equipment.active.markup =
        this.adjustments.equipment.active.markup * 100;
    }
    if (
      this.adjustments.equipment &&
      this.adjustments.equipment.standby &&
      this.adjustments.equipment.standby.markup &&
      Number(this.adjustments.equipment.standby.markup) < 1
    ) {
      this.adjustments.equipment.standby.markup =
        this.adjustments.equipment.standby.markup * 100;
    }
    if (
      this.adjustments.equipment &&
      this.adjustments.equipment.rental &&
      this.adjustments.equipment.rental.markup &&
      Number(this.adjustments.equipment.rental.markup) < 1
    ) {
      this.adjustments.equipment.rental.markup =
        this.adjustments.equipment.rental.markup * 100;
    }
    if (
      this.adjustments.labor &&
      this.adjustments.labor.markup &&
      Number(this.adjustments.labor.markup) < 1
    ) {
      this.adjustments.labor.markup = this.adjustments.labor.markup * 100;
    }
  }

  buildDefaultAdjustments() {
    return {
      subcontractor: { markup: 10 },
      material: { markup: 10 },
      other: { markup: 10 },
      labor: {
        markup: 10
      },
      equipment: {
        active: {
          regionalAdjustmentsEnabled: true,
          operating: 100,
          ownership: 100,
          markup: 10
        },
        standby: { regionalAdjustmentsEnabled: true, markup: 10 },
        rental: { markup: 10 }
      }
    };
  }

  constructor(project: any) {
    {
      this.id = project.id || '';
      this.zipcode = project.zipcode || 30332;
      this.state = project.state || 'GA';
      this.active = project.active || true;
      this.name = project.name || project.projectName || '';
      this.createdBy = project.createdBy || '';
      this.createdOn = new Date(project.createdOn);
      if (project.age) {
        this.age = project.age;
      } else {
        const days = Math.abs(this.createdOn.getTime() - new Date().getTime());
        this.age = Math.ceil(days / (1000 * 3600 * 24));
      }
      this.paymentTerms = project.paymentTerms || 45;
      this.description =
        project.description || project.projectInstructions || '';
      this.numContractors = project.numContractors || 0;
      this.itemsPending = project.itemsPending || 0;
      this.itemsOverdue = project.itemsOverdue || 0;
      this.materialCostsEnabled =
        project.materialCostsEnabled || project.materialCheck || true;
      this.activeCostsEnabled =
        project.activeCostsEnabled || project.activeCheck || true;
      this.standbyCostsEnabled =
        project.standbyCostsEnabled || project.standbyCheck || true;
      this.rentalCostsEnabled =
        project.rentalCostsEnabled || project.rentalCheck || true;
      this.subcontractorCostsEnabled =
        project.subcontractorCostsEnabled ||
        project.subcontractorCostsCheckbox ||
        true;
      this.laborCostsEnabled =
        project.laborCostsEnabled || project.laborCheck || true;
      this.otherCostsEnabled =
        project.otherCostsEnabled || project.otherCheck || true;
      this.userJSON = project.users || [];
      if (!project.account && project.accountId) {
        this.account = new Account({ id: project.accountId });
      } else {
        this.account = project.account || new Account({});
      }
      this.roles = project.roles;
      this.adjustments = project.adjustments || this.buildDefaultAdjustments();
      if (!this.adjustments.labor) {
        this.adjustments.labor = {
          markup: 10
        };
      }

      if (!this.adjustments.equipment.rental) {
        this.adjustments.equipment.rental = {
          markup: 10
        };
      }

      this.itemsPending = 0;
      this.itemsOverdue = 0;

      this.buildRequests(project.requests || []);
      this.pendingTotal = project.pendingTotal || 0;
      this.approvedTotal = project.approvedTotal || 0;

      if (project.organization) {
        this.account.organization = project.organization;
      }
      if (project.pendingRequests) {
        this.itemsPending = project.pendingRequests;
      }
      if (project.overdueRequests) {
        this.itemsOverdue = project.overdueRequests;
      }
      this.checkAdjustments();
      this.buildUsers();
      const today = new Date();
      const diff = Math.abs(today.getTime() - this.createdOn.getTime());
      this.activeDays = Math.ceil(diff / (1000 * 3600 * 24));
      if (this.itemsOverdue > 0) {
        this.progress =
          100 *
          Number(
            +this.itemsPending / (+this.itemsPending + +this.itemsOverdue)
          );
      } else {
        this.progress = 100;
      }
    }
  }
}

export class Email {
  email: string;
}

export class Admin {
  id: string;
  email: string;
}

export class Account {
  id: string;
  organization: string;
  accountName: string;
  roles: string[];
  users: Email[];
  admins: Admin[];
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
      this.admins = a.admins || [];
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

  generateYears() {
    let startYear = this.dateIntroduced.getFullYear();
    let nowYear = new Date().getFullYear() - 29;
    
    startYear = +Math.max(+startYear, +nowYear);
   
    let endYear = this.dateDiscontinued.getFullYear();
    this.years = [];
    for (let i = startYear; i <= endYear; i++) {
      this.years.push({ year: i });
    }
     
  }

  constructor(m: any) {
    this.id = m.id || '';
    this.details = m.details || { id: '', serial: '', year: 2018 };
    this.guid = m.guid || '';
    this.make = m.make || m.manufacturerName || '';
    this.makeId = m.makeId || m.manufacturerId || '';
    this.model = m.model || m.modelName || '';
    this.modelId = m.modelId || '';
    this.configurations = m.specs || m.configurations || {};
    this.dateIntroduced =
      moment(m.dateIntroduced).toDate() || new Date();
    this.dateDiscontinued = moment(m.dateDiscontinued).toDate() || new Date();

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
    this.categoryName = m.categoryName;
    this.categoryId = m.categoryId;
    this.subtypeName = m.subtypeName;
    this.subtypeId = m.subtypeId;
    this.sizeClassId = m.sizeClassId;
    this.sizeClassName = m.sizeClassName;
    this.classificationId = m.classificationId;
    this.classificationName = m.classificationName;
    this.rentalHouseRates = m.rentalHouseRates;
    this.nationalAverages = m.nationalAverages;
    this.regionalAverages = m.regionalAverages;
    this.status = m.status || 'draft';
    if (m.details && m.details.type) {
      this.type = m.details.type;
    } else {
      this.type = m.type || this.model;
    }

    this.calculateHourlyRates();
    this.generateYears();
    this.display = this.make + ' ' + this.model;
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

    if (this.details.selectedConfiguration) {
      this.details.rates.ownership_monthly_calculated_hourly = +Number(
        +this.details.selectedConfiguration.monthlyOwnershipCost / 176
      ).toFixed(2);
      this.details.rates.ownership_weekly_calculated_hourly = +Number(
        +this.details.selectedConfiguration.weeklyOwnershipCost / 40
      ).toFixed(2);
      this.details.rates.ownership_daily_calculated_hourly = +Number(
        +this.details.selectedConfiguration.dailyOwnershipCost / 8
      ).toFixed(2);
      this.details.rates.ownership_hourly_calculated_hourly = +Number(
        +this.details.selectedConfiguration.hourlyOwnershipCost / 1
      ).toFixed(2);
      this.details.rates.operating_hourly_calculated_hourly = +Number(
        +this.details.selectedConfiguration.hourlyOperatingCost / 1
      ).toFixed(2);
    }
  }

  isDraft() {
    return this.status && this.status.toLowerCase() === 'draft';
  }

  buildDisplay() {
    this.display = this.make + ' ' + this.model;
  }

  buildRates(duration: number = 1) {
    if (
      this.type === 'equipment.rental' &&
      this.nationalAverages &&
      this.nationalAverages.length > 0
    ) {
      this.baseRental =
        Number(this.nationalAverages[0].dailyRate * duration) || 0;
    }
  }
}

export class Dispute {
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
      case 'equipment.active': {
        return 'Equipment|Active';
      }
      case 'equipment.standby': {
        return 'Equipment|Standby';
      }
      case 'equipment.rental': {
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
    if (this.type.toLowerCase() === 'equipment.active') {
      this.displayType = 'Equipment|Active';
      this.sortOrder = 1;
    } else if (this.type.toLowerCase() === 'equipment.standby') {
      this.displayType = 'Equipment|Standby';
      this.sortOrder = 2;
    } else if (this.type.toLowerCase() === 'equipment.rental') {
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
  constructor(type: string, list: any) {
    this.type = type || '';
    this.items = list || [];
    this.setDisplayType();
  }
}

export class Request {
  id: string;
  oneUp: string;
  name: string;
  project: Project;
  projectId: string;
  type: string;
  age: number;
  requestDate: Date;
  startDate: Date;
  endDate: Date;
  dateRange: Date[];
  signatures: Signatures;
  total: number;
  messages: number;
  status: string;
  items: Item[];
  activeMarkup = 0;
  standbyMarkup = 0;
  rentalMarkup = 0;
  materialMarkup = 0;
  laborMarkup = 0;
  laborBenefitsTotal = 0;
  subcontractorMarkup = 0;
  equipmentTotal = 0;
  materialTotal = 0;
  laborTotal = 0;
  otherTotal = 0;
  otherMarkup = 0;
  subcontractorTotal = 0;
  laborSubtotal = 0;
  activeSubtotal = 0;
  standbySubtotal = 0;
  rentalSubtotal = 0;
  materialSubtotal = 0;
  subcontractorSubtotal = 0;

  pendingItems: Item[];
  completeItems: Item[];
  draftItems: Item[];
  paymentTerms: 0;
  itemsByType: ItemList[];
  unsortedItems: Item[];
  totalItems = 0;
  lineItemTotals: any;
  notes: string;

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

  addItem(item: Item) {
    this.unsortedItems.push(item);
    if (item.status.toLowerCase() === 'pending') {
      item.overdue = item.age > this.paymentTerms;
      this.pendingItems.push(item);
    } else if (item.status.toLowerCase() === 'draft') {
      this.draftItems.push(item);
    } else {
      item.overdue = false;
      this.completeItems.push(item);
    }
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

  hasNonDraftLineItems() {
    for (let i = 0; i < this.itemsByType.length; i++) {
      const lit: ItemList = this.itemsByType[i];
      if (lit.items && lit.items.length > 0) {
        for (let j = 0; j < lit.items.length; j++) {
          const currentItem: Item = lit.items[j];
          if (currentItem.status.toLowerCase() !== 'draft') {
            return true;
          }
        }
      }
    }
    return false;
  }

  calculateTotals() {
    const total = 0;
    const equipmentTotal = 0;
    let materialTotal = 0;
    let activeTotal = 0;
    let standbyTotal = 0;
    let rentalTotal = 0;
    let otherSubtotal = 0;
    let laborTotal = 0;
    let laborSubtotal = 0;
    let laborBenefits = 0;
    let subcontractorTotal = 0;

    for (let i = 0; i < this.itemsByType.length; i++) {
      const lit: ItemList = this.itemsByType[i];
      const items: Item[] = lit.items;
      for (let j = 0; j < items.length; j++) {
        const currentItem: Item = items[j];
        let lt = 0;
        if (currentItem.status.toLowerCase() === 'complete') {
          lt = +currentItem.finalAmount;
        } else {
          if (currentItem.type === 'labor') {
            lt = +currentItem.subtotal;
          } else {
            lt = +currentItem.amount;
          }
        }
        if (currentItem.type === 'equipment.rental') {
          rentalTotal += Number(lt);
        } else if (currentItem.type === 'equipment.active') {
          activeTotal += Number(lt);
        } else if (currentItem.type === 'equipment.standby') {
          standbyTotal += Number(lt);
        } else if (currentItem.type === 'other') {
          otherSubtotal += Number(lt);
        } else if (currentItem.type === 'material') {
          materialTotal += Number(lt);
        } else if (currentItem.type === 'subcontractor') {
          subcontractorTotal += Number(lt);
        } else if (currentItem.type === 'labor') {
          laborSubtotal += Number(lt);
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
    this.activeSubtotal = activeTotal;
    if (
      this.project &&
      this.project.adjustments &&
      this.project.adjustments.equipment
    ) {
      this.activeMarkup =
        Number(Number(this.project.adjustments.equipment.active.markup) / 100) *
        activeTotal;
      this.standbySubtotal = standbyTotal;
      this.standbyMarkup =
        Number(
          Number(this.project.adjustments.equipment.standby.markup) / 100
        ) * standbyTotal;
      this.rentalSubtotal = rentalTotal;
      this.rentalMarkup =
        Number(Number(this.project.adjustments.equipment.rental.markup) / 100) *
        rentalTotal;
    }
    this.equipmentTotal =
      this.activeSubtotal +
      this.activeMarkup +
      this.standbyMarkup +
      this.standbySubtotal +
      this.rentalMarkup +
      this.rentalSubtotal;
    this.laborSubtotal = laborSubtotal;
    this.laborBenefitsTotal = laborBenefits;

    if (
      this.project &&
      this.project.adjustments &&
      this.project.adjustments.labor
    ) {
      this.laborMarkup =
        Number(Number(this.project.adjustments.labor.markup) / 100) *
        laborSubtotal;
    }
    laborTotal = +laborSubtotal + +this.laborBenefitsTotal;

    this.laborTotal = laborTotal + this.laborMarkup;
    this.subcontractorSubtotal = subcontractorTotal;
    if (
      this.project &&
      this.project.adjustments &&
      this.project.adjustments.subcontractor
    ) {
      this.subcontractorMarkup =
        Number(Number(this.project.adjustments.subcontractor.markup) / 100) *
        subcontractorTotal;
    }
    this.subcontractorTotal = subcontractorTotal + this.subcontractorMarkup;

    if (
      this.project &&
      this.project.adjustments &&
      this.project.adjustments.other
    ) {
      this.otherMarkup =
        Number(Number(this.project.adjustments.other.markup) / 100) *
        otherSubtotal;
    }
    this.otherTotal = otherSubtotal; // + this.otherMarkup;
    this.materialSubtotal = materialTotal;
    if (
      this.project &&
      this.project.adjustments &&
      this.project.adjustments.material
    ) {
      this.materialMarkup =
        Number(Number(this.project.adjustments.material.markup) / 100) *
        materialTotal;
    }
    this.materialTotal = materialTotal + this.materialMarkup;

    this.total =
      this.materialTotal +
      this.laborTotal +
      this.otherTotal +
      this.subcontractorTotal +
      this.equipmentTotal;
  }

  buildLineItems() {
    let total = 0;
    const equipmentTotal = 0;
    let activeTotal = 0;
    let standbyTotal = 0;
    let rentalTotal = 0;
    let otherSubtotal = 0;
    const laborTotal = 0;
    let laborSubtotal = 0;
    let laborBenefits = 0;
    let subcontractorTotal = 0;
    let materialTotal = 0;
    this.pendingItems = [];
    this.completeItems = [];
    this.draftItems = [];
    this.itemsByType = [];
    this.unsortedItems = [];

    for (let i = 0; i < this.items.length; i++) {
      const currentItem = this.items[i];
      currentItem.requestId = this.id;

      const lineItem = new Item(currentItem);
      let lt = 0;

      this.addItem(lineItem);
      if (currentItem.status.toLowerCase() === 'complete') {
        total += Number(currentItem.finalAmount);
        lt = +currentItem.finalAmount;
      } else {
        if (currentItem.type === 'labor') {
          total += Number(currentItem.amount);
          lt = +currentItem.subtotal;
        } else {
          total += Number(currentItem.amount);
          lt = +currentItem.amount;
        }
      }
      if (currentItem.type === 'equipment.rental') {
        rentalTotal += Number(lt);
      } else if (currentItem.type === 'equipment.active') {
        activeTotal += Number(lt);
      } else if (currentItem.type === 'equipment.standby') {
        standbyTotal += Number(lt);
      } else if (currentItem.type === 'other') {
        otherSubtotal += Number(lt);
      } else if (currentItem.type === 'material') {
        materialTotal += Number(lt);
      } else if (currentItem.type === 'subcontractor') {
        subcontractorTotal += Number(lt);
      } else if (currentItem.type === 'labor') {
        laborSubtotal += Number(lt);
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
    this.totalItems = this.items.length;

    if (this.lineItemTotals) {
      this.totalItems = this.lineItemTotals.count;
      this.total = this.lineItemTotals.amount;
      this.equipmentTotal = this.lineItemTotals.equipment || 0;
      this.laborTotal = this.lineItemTotals.labor || 0;
      this.materialTotal = this.lineItemTotals.material || 0;
      this.otherTotal = this.lineItemTotals.other || 0;
      this.subcontractorTotal = this.lineItemTotals.subcontractor || 0;
    } else {
      this.activeSubtotal = activeTotal;
      if (this.project && this.project.adjustments) {
        this.activeMarkup =
          Number(
            Number(this.project.adjustments.equipment.active.markup) / 100
          ) * activeTotal;
        this.standbySubtotal = standbyTotal;
        this.standbyMarkup =
          Number(
            Number(this.project.adjustments.equipment.standby.markup) / 100
          ) * standbyTotal;
        this.rentalSubtotal = rentalTotal;
        this.rentalMarkup =
          Number(
            Number(this.project.adjustments.equipment.rental.markup) / 100
          ) * rentalTotal;
      }

      this.equipmentTotal =
        this.activeSubtotal +
        this.activeMarkup +
        this.standbyMarkup +
        this.standbySubtotal +
        this.rentalMarkup +
        this.rentalSubtotal;

      this.laborSubtotal = laborSubtotal;
      this.laborBenefitsTotal = laborBenefits;

      if (
        this.project &&
        this.project.adjustments &&
        this.project.adjustments.labor
      ) {
        this.laborMarkup =
          Number(Number(this.project.adjustments.labor.markup) / 100) *
          laborSubtotal;
      }

      this.laborTotal =
        laborSubtotal + this.laborBenefitsTotal + this.laborMarkup;

      this.subcontractorSubtotal = subcontractorTotal;
      if (
        this.project &&
        this.project.adjustments &&
        this.project.adjustments.subcontractor
      ) {
        this.subcontractorMarkup =
          Number(Number(this.project.adjustments.subcontractor.markup / 100)) *
          subcontractorTotal;
      }
      this.subcontractorTotal = subcontractorTotal + this.subcontractorMarkup;
      this.materialSubtotal = materialTotal;
      if (
        this.project &&
        this.project.adjustments &&
        this.project.adjustments.material
      ) {
        this.materialMarkup =
          Number(
            Number(this.project.adjustments.equipment.material.markup / 100)
          ) * materialTotal;
      }
      if (
        this.project &&
        this.project.adjustments &&
        this.project.adjustments.other
      ) {
        this.otherMarkup =
          Number(Number(this.project.adjustments.other.markup / 100)) *
          otherSubtotal;
      }
      this.otherTotal = otherSubtotal + this.otherMarkup;
      this.materialTotal = materialTotal + this.materialMarkup;
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
      this.notes = request.notes || '';

      let sd = request.startDate || request.start;
      if (sd && sd !== '') {
        sd = moment(sd, 'YYYY-MM-DD');
        this.startDate = new Date(sd);
      } else {
        this.startDate = new Date();
      }
      let ed = request.endDate || request.end;
      if (ed && ed !== '') {
        ed = moment(ed, 'YYYY-MM-DD');
        this.endDate = new Date(ed);
      } else {
        this.endDate = new Date(this.startDate);
      }

      this.signatures = request.signatures || new Signatures({});
      this.messages = request.messages || 0;
      this.total = request.total || 0;
      this.status = request.status || 'PENDING';
      this.items = request.items || request.lineItems || [];
      this.lineItemTotals = request.lineItemTotals;
      this.buildLineItems();
      this.buildDateRange();
      this.sortLineItemsByAge();
    }
  }
}
