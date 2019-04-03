import { ClrDatagridComparatorInterface } from '@clr/angular';
import * as moment from 'moment';

import { DatesPipe } from '../core/pipes/dates.pipe';

export interface Breadcrumb {
  id: string;
  path: string;
  route: string;
  display: string;
}

export interface State {
  label: string;
  stateName: string;
  countryCode: string;
}

export interface Attachment {
  id: string;
  uid: string;
  url: string;
  name: string;
  size: number;
  type: string;
  status: string;
  message: string;
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
  class: string;
  fringe: number;
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
    this.class = employee.class || employee.trade || '';
    this.email = employee.email || '';
    this.fringe = employee.fringe || employee.benefits || 0;
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
  popover = '';
  eSig: string;
  submittedOn: Date;
  submittedBy: string;
  age: number;
  overdue: boolean;
  approverNotes: string;
  subtotalApproved: number;
  editMode: boolean;
  amount: number;
  subtotal: number;
  totalAdjusted: number;
  approvedOn: Date;
  approvedBy: string;
  type: string;
  startDate: Date;
  endDate: Date;
  amountAdjusted = false;
  changeReason: string;
  rejectReason: string;
  displayType: string;
  comments: Comment[];
  attachments: Attachment[];
  editDetails: any;
  revert: Item;
  beingEdited = false;

  misc = false;

  buildApproveVersion() {
    const json = this.buildSaveVersion();
    json['approverNotes'] = this.approverNotes;
    if (this.subtotalApproved) {
      json['subtotalApproved'] = this.subtotalApproved;
    }

    return json;
  }

  buildSaveVersion() {
    const json = {};
    if (this.attachments && this.attachments.length > 0) {
      json['attachments'] = this.attachments.map((file: Attachment) => {
        return {
          id: file.id,
          fileName: file.name
        };
      });
    }
    if (this.type === 'equipmentActive') {
      json['modelId'] = this.details.modelId;
      json['configurationSequence'] = this.details.configurationSequence;
      json['hours'] = this.details.hours;
      json['transport'] = this.details.transport;
      json['rate'] = this.details.rate;
      json['subtotal'] = this.subtotal;
      json['year'] = this.details.year;
    } else if (this.type === 'equipmentStandby') {
      json['modelId'] = this.details.modelId;
      json['configurationSequence'] = this.details.configurationSequence;
      json['hours'] = this.details.hours;
      json['transport'] = this.details.transport;
      json['rate'] = this.details.rate;
      json['subtotal'] = this.subtotal;

      json['year'] = this.details.year;
    } else if (this.type === 'equipmentRental') {
      json['modelId'] = this.details.modelId;
      json['configurationSequence'] = this.details.configurationSequence;
      json['hours'] = this.details.hours;
      json['transport'] = this.details.transport;
      json['operating'] = this.details.operating;
      json['invoice'] = this.details.invoice;
      json['start'] = moment(this.details.startDate).format('yyyy-MM-dd');
      json['end'] = moment(this.details.endDate).format('yyyy-MM-dd');
      json['subtotal'] = this.subtotal;
      json['year'] = this.details.year;
    } else if (this.type === 'other') {
      json['description'] = this.details.description;
      json['type'] = this.details.type;
      json['cost'] = this.subtotal;
      json['subtotal'] = this.subtotal;
    } else if (this.type === 'material') {
      json['description'] = this.details.description;
      json['units'] = this.details.units;
      json['unitCost'] = this.details.unitCost;
      json['subtotal'] = this.subtotal;
    } else if (this.type === 'labor') {
      json['lastName'] = this.details.employee.lastName;
      json['firstName'] = this.details.employee.firstName;
      json['class'] = this.details.class;
      json['hours'] = this.details.hours;
      json['multiplier'] = this.details.multiplier;
      json['fringe'] = this.details.fringe;
      json['rate'] = this.details.rate;
      json['subtotal'] = this.subtotal;
    } else if (this.type === 'subcontractor') {
      json['description'] = this.details.description;
      json['subcontractor'] = this.details.subcontractor;
      json['cost'] = this.subtotal;
      json['subtotal'] = this.subtotal;
    }
    return json;
  }

  generateYears() {
    if (!this.details.dateIntroduced) {
      this.details.dateIntroduced = new Date(0);
    }
    if (!this.details.dateDiscontinued) {
      this.details.dateDiscontinued = moment().toDate();
    }
    if (this.details.dateIntroduced instanceof Date) {
    } else {
      this.details.dateIntroduced = moment(
        this.details.dateIntroduced
      ).toDate();
    }
    if (this.details.dateDiscontinued instanceof Date) {
    } else {
      this.details.dateDiscontinued = moment(
        this.details.dateDiscontinued
      ).toDate();
    }
    let startYear = this.details.dateIntroduced.getFullYear();
    const endYear = this.details.dateDiscontinued.getFullYear();

    const nowYear =
      moment()
        .toDate()
        .getFullYear() - 29;

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

  setDates(dates: any) {
    if (dates && dates.length > 0) {
      this.details.startDate = new Date(dates[0]);
      this.details.endDate = new Date(dates[1]);
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
    this.details.manufacturerName =
      m.manufacturerName || m.manufacturerName || '';
    this.details.manufacturerId = m.manufacturerName || m.manufacturerId || '';
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
      return this.details.manufacturerName + ' ' + this.details.model;
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
    } else if (this.type.toLowerCase() === 'equipmentStandby') {
      this.displayType = 'Equipment|Standby';
    } else if (this.type.toLowerCase() === 'equipmentRental') {
      this.displayType = 'Equipment|Rental';
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
    if (
      this.type === 'equipmentRental' &&
      this.details &&
      this.details.rentalAverages &&
      this.details.rentalConversion
    ) {
      this.details.dailyRate = 0;
      if (this.details.rentalAverages.dailyRateState) {
        this.details.rentalAverages.rateSuurce = 'State';
        this.details.rentalAverages.dailyRate = this.details.rentalAverages.dailyRateState;
      } else if (this.details.rentalAverages.dailyRateRegional) {
        this.details.rentalAverages.rateSuurce = 'Regional';
        this.details.rentalAverages.dailyRate = this.details.rentalAverages.dailyRateRegional;
      } else if (this.details.rentalAverages.dailyRateNational) {
        this.details.rentalAverages.rateSuurce = 'National';
        this.details.rentalAverages.dailyRate = this.details.rentalAverages.dailyRateNational;
      }
      this.details.weeklyRate = 0;
      if (this.details.rentalAverages.weeklyRateState) {
        this.details.rentalAverages.weeklyRate = this.details.rentalAverages.weeklyRateState;
      } else if (this.details.rentalAverages.weeklyRateRegional) {
        this.details.rentalAverages.weeklyRate = this.details.rentalAverages.weeklyRateRegional;
      } else if (this.details.rentalAverages.weeklyRateNational) {
        this.details.rentalAverages.weeklyRate = this.details.rentalAverages.weeklyRateNational;
      }
      this.details.monthlyRate = 0;
      if (this.details.rentalAverages.monthlyRateState) {
        this.details.rentalAverages.monthlyRate = this.details.rentalAverages.monthlyRateState;
      } else if (this.details.rentalAverages.monthlyRateRegional) {
        this.details.rentalAverages.monthlyRate = this.details.rentalAverages.monthlyRateRegional;
      } else if (this.details.rentalAverages.monthlyRateNational) {
        this.details.rentalAverages.monthlyRate = this.details.rentalAverages.monthlyRateNational;
      }

      this.details.rentalOwnershipTotal = 0;
      this.details.rentalOwnershipTotal =
        this.details.rentalConversion.days *
          this.details.activeOwnershipAdjustedDaily +
        this.details.rentalConversion.weeks *
          this.details.activeOwnershipAdjustedWeekly +
        this.details.rentalConversion.months *
          this.details.activeOwnershipAdjustedMonthly;

      this.details.rentalOwnershipDelta = 0;
      this.details.rentalOwnershipDelta =
        +this.details.rentalOwnershipTotal / +this.details.invoice;

      this.details.rentalOwnershipDelta = Math.abs(
        (+this.details.rentalOwnershipTotal - +this.details.invoice) /
          +this.details.invoice
      );
      if (+this.details.rentalOwnershipTotal >= +this.details.invoice) {
        this.details.rateVerified = true;
      } else {
        this.details.rateVerified = false;
      }

      this.details.rentalRetailTotal =
        this.details.rentalConversion.days *
          this.details.rentalAverages.dailyRate +
        this.details.rentalConversion.weeks *
          this.details.rentalAverages.weeklyRate +
        this.details.rentalConversion.months *
          this.details.rentalAverages.monthlyRate;

      this.details.rentalOwnershipRed =
        +this.details.invoice > +this.details.rentalOwnershipTotal;
      this.details.rentalOwnershipGreen =
        +this.details.invoice <= +this.details.rentalOwnershipTotal;
      this.details.rentalRetailDelta =
        +this.details.rentalRetailTotal / +this.details.invoice;
      this.details.rentalRetailDelta = Math.abs(
        (+this.details.rentalRetailTotal - +this.details.invoice) /
          +this.details.invoice
      );
      this.details.rentalRetailRed =
        +this.details.invoice > +this.details.rentalRetailTotal;
      this.details.rentalRetailGreen =
        +this.details.invoice <= +this.details.rentalRetailTotal;
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

  buildSpecs() {
    if (!this.details || !this.details.specs) {
      return;
    }
    const specColumns = {};
    let cols = [];

    const specs = this.details.specs;
    for (let j = 0; j < specs.length; j++) {
      const spec = specs[j];
      const specNameFriendly = spec.specNameFriendly;

      if (!specColumns[specNameFriendly]) {
        specColumns[specNameFriendly] = true;
        cols.push(specNameFriendly);
      }
      this.details[specNameFriendly] = spec.specValue || '';
    }

    cols = cols.sort();
    const updatedCols = [];

    for (let k = 0; k < cols.length; k++) {
      const col = cols[k] as string;
      if (!this.details[col]) {
        this.details[col] = '';
      }
    }

    for (let k = 0; k < cols.length; k++) {
      updatedCols.push({ name: cols[k] });
    }
    this.details.specsColumns = updatedCols;
  }

  constructor(data: any) {
    {
      if (!data.details) {
        this.details = this.buildDetails(data);
      } else {
        this.details = data.details;
      }
      if (this.details && this.details.modelName) {
        this.details.model = this.details.modelName;
      }
      this.id = data.id || '';
      this.requestId = data.requestId || '';
      this.eSig = data.eSig || '';
      this.age = data.age || 0;
      this.subtotal = data.subtotal || this.details.subtotal || 0;
      this.amount = data.amount || 0;
      this.type = data.type || 'Other';
      this.submittedBy = data.submittedBy || data.userId || '';
      this.submittedOn = data.submittedOn || new Date();
      this.changeReason = data.changeReason || '';
      this.rejectReason = data.rejectReason || '';
      this.totalAdjusted = data.totalAdjusted || 0;
      this.subtotalApproved = data.subtotalApproved || null;
      this.amountAdjusted =
        this.subtotalApproved &&
        this.subtotal > 0 &&
        +this.subtotal !== +this.subtotalApproved;

      this.approvedBy = data.approvedBy || '';
      this.approvedOn = data.approvedOn || new Date();
      this.comments = data.comments || [];
      this.attachments = data.attachments || [];
      this.buildRentalDates();
      if (!this.details.transport) {
        this.details.transport = 0;
      }
      if (!this.details.hours) {
        this.details.hours = 0;
      }

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
      this.buildSpecs();
      this.setDisplayType();
      this.setAmounts();
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
  rejectedRequests: Request[];
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
    this.rejectedRequests = [];
    let total = 0;
    let laborTotal = 0;
    let equipmentTotal = 0;
    let materialTotal = 0;
    let subcontractorTotal = 0;
    let otherTotal = 0;
    for (let i = 0; i < requestJSON.length; i++) {
      requestJSON[i].adjustments = this.adjustments;
      const r: Request = new Request(requestJSON[i]);
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
      if (r.status.toLowerCase() === 'approved') {
        this.completeRequests.push(r);
      }
      if (r.status.toLowerCase() === 'rejected') {
        this.rejectedRequests.push(r);
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
      }
      if (
        u.containsRole('ProjectObserver') ||
        u.containsRole('ProjectApprover') ||
        u.containsRole('ProjectManager') ||
        u.containsRole('AccountManager')
      ) {
        this.users.push(u);
      }
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
      costLocation: {
        city: '',
        cityId: '',
        region: '',
        regionId: ''
      },
      rentalLocation: {
        zipcode: '',
        stateCode: '',
        countryCode: ''
      },
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
          autoSaveLabor: false,
          autoSaveEquipment: false,
          requestingOrgs: []
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

      this.buildCostEnabled(project);
      this.buildRequests(project.requests || []);

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
  model: string;
  modelId: string;
  manufacturerName: string;
  manufacturerId: string;
  configurationSequence: string;
  misc = false;
  configurations: any;
  rates: any;
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
  specs: [];
  specsColumns: [];
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
  modelName: string;

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

  isDraft() {
    return this.status.toLowerCase() === 'draft';
  }

  constructor(m: any) {
    Object.assign(this, m);

    if (m.dateIntroduced && m.dateIntroduced !== '') {
      if (m.dateIntroduced instanceof Date) {
        this.dateIntroduced = m.dateIntroduced;
      } else {
        this.dateIntroduced = moment(m.dateIntroduced).toDate();
      }
    } else {
      this.dateIntroduced = new Date(0);
    }

    if (m.dateDiscontinued && m.dateDiscontinued !== '') {
      if (m.dateDiscontinued instanceof Date) {
        this.dateDiscontinued = m.dateDiscontinued;
      } else {
        this.dateDiscontinued = moment(m.dateDiscontinued).toDate();
      }
    } else {
      this.dateDiscontinued = moment().toDate();
    }
    this.model = m.model || m.modelName || '';
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

    if (!this.details) {
      this.details = { id: '', vin: '' };
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
    this.status = m.status || 'draft';
    this.generateYears();
    this.display = this.manufacturerName + ' ' + this.model;
  }

  buildDisplay() {
    this.display = this.manufacturerName + ' ' + this.model;
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
  static getItemDisplayType(itemType: string) {
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
  projectRoles: string[];
  projectId: string;
  projectName: string;
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
  equipmentActiveMarkup = 0;
  equipmentStandbyMarkup = 0;
  equipmentRentalMarkup = 0;
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
  equipmentActiveTotal = 0;
  equipmentStandbyTotal = 0;
  equipmentRentalTotal = 0;
  approved = false;
  adjustments = null;
  pendingItems: Item[];
  completeItems: Item[];
  draftItems: Item[];
  paymentTerms: 0;
  itemsByType: ItemList[];
  unsortedItems: Item[];
  lineItemCount = 0;
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
    return this.status && this.status.toLowerCase() === 'approved';
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

  buildLineItemsToApprove() {
    const lineItems = {};
    this.itemsByType.forEach((it: ItemList) => {
      if (it.items && it.items.length > 0) {
        lineItems[it.type] = {
          items: it.items.map((item: Item) => {
            return item.buildApproveVersion();
          })
        };
      }
    });

    return lineItems;
  }

  buildLineItemsToSave() {
    const lineItems = {};
    this.itemsByType.forEach((it: ItemList) => {
      if (it.items && it.items.length > 0) {
        lineItems[it.type] = {
          items: it.items.map((item: Item) => {
            return item.buildSaveVersion();
          })
        };
      }
    });

    return lineItems;
  }

  buildLineItems() {
    this.pendingItems = [];
    this.completeItems = [];
    this.draftItems = [];
    this.itemsByType = [];
    this.unsortedItems = [];
    const types = Object.keys(this.lineItems);
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      let typeItems: any;

      typeItems = this.lineItems[type];
      if (!typeItems || !typeItems.items) {
        continue;
      }
      const items = [];
      for (let j = 0; j < typeItems.items.length; j++) {
        const t = typeItems.items[j];
        t.type = type;
        t.requestId = this.id;
        items.push(new Item(t));
      }
      this.itemsByType.push(new ItemList(type, items));
    }

    if (this.lineItemTotals) {
      this.total = this.lineItemTotals.amount;
      this.equipmentTotal = this.lineItemTotals.equipment || 0;
      this.laborTotal = this.lineItemTotals.labor || 0;
      this.materialTotal = this.lineItemTotals.material || 0;
      this.otherTotal = this.lineItemTotals.other || 0;
      this.subcontractorTotal = this.lineItemTotals.subcontractor || 0;
    }

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
      this.adjustments = request.adjustments || {};
      this.meta = request.meta || {};
      this.coord = request.coord || {};
      this.canApprove = request.canApprove || false;
      this.submittedOn = request.submittedOn || '';
      this.submittedBy = request.submittedBy || '';
      this.createdOn = request.createdOn || '';
      this.createdBy = request.createdBy || '';
      this.projectRoles = request.projectRoles || [];
      this.projectName = request.projectName || '';
      this.lineItemCount = request.lineItemCount || 0;
      this.lastModified = request.lastModified || '';
      this.lastModifiedBy = request.lastModifiedBy || '';
      this.materialSubtotal = +request.materialSubtotal || 0;
      this.laborSubtotal = +request.laborSubtotal || 0;
      this.otherSubtotal = +request.otherSubtotal || 0;
      this.subcontractorSubtotal = +request.subcontractorSubtotal || 0;
      this.equipmentActiveSubtotal = +request.equipmentActiveSubtotal || 0;
      this.equipmentStandbySubtotal = +request.equipmentStandbySubtotal || 0;
      this.equipmentRentalSubtotal = +request.equipmentRentalSubtotal || 0;
      this.subcontractorTotal = +request.subcontractorSubtotal || 0;
      this.equipmentActiveTotal = +request.equipmentActiveTotal || 0;
      this.equipmentStandbyTotal = +request.equipmentStandbyTotal || 0;
      this.equipmentRentalTotal = +request.equipmentRentalTotal || 0;
      this.equipmentActiveMarkup =
        +this.equipmentActiveSubtotal *
        +this.adjustments.equipmentActive.markup;
      this.equipmentStandbyMarkup =
        +this.equipmentStandbySubtotal *
        +this.adjustments.equipmentStandby.markup;

      this.equipmentRentalMarkup =
        +this.equipmentRentalSubtotal *
        +this.adjustments.equipmentRental.markup;
      this.laborMarkup = +this.laborSubtotal * +this.adjustments.labor.markup;
      this.laborTotal = this.laborSubtotal + this.laborMarkup;
      this.otherMarkup = +this.otherSubtotal * +this.adjustments.other.markup;
      this.otherTotal = +this.otherMarkup + +this.otherSubtotal;
      this.materialMarkup =
        +this.materialSubtotal * +this.adjustments.material.markup;
      this.materialTotal = +this.materialMarkup + +this.materialSubtotal;

      this.subcontractorMarkup =
        +this.subcontractorSubtotal * +this.adjustments.subcontractor.markup;
      this.subcontractorTotal =
        +this.subcontractorMarkup + +this.subcontractorSubtotal;
      this.equipmentTotal =
        this.equipmentActiveSubtotal +
        this.equipmentActiveMarkup +
        this.equipmentStandbySubtotal +
        this.equipmentStandbyMarkup +
        this.equipmentRentalSubtotal +
        this.equipmentRentalMarkup;

      this.total =
        this.equipmentTotal +
        this.laborTotal +
        this.otherTotal +
        this.materialTotal +
        this.subcontractorTotal;
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
        this.startDate = moment(sd).toDate();
      } else {
        this.startDate = new Date();
      }
      const ed = request.endDate || request.end;
      if (ed && ed !== '') {
        this.endDate = moment(ed).toDate();
      } else {
        this.endDate = new Date(this.startDate);
      }

      this.signatures = request.signatures || new Signatures({});
      this.messages = request.messages || 0;

      this.status = request.status || 'PENDING';
      this.lineItems = request.lineItems || [];
      this.lineItemTotals = request.lineItemTotals;
      this.buildLineItems();
      this.buildDateRange();
      this.sortLineItemsByAge();
    }
  }
}
