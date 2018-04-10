import { AppUtils } from '@app/core/utils/utils';

export class Message {
  id: string;
  subject: string;
  sender: Contractor;
  body: string;
  timestamp: Date;
  project: Project;
  request: Request;

  constructor(message: any) {
    {
      this.id = message.id || AppUtils.generateGUID(true);
      this.sender = message.sender || new Contractor({});
      this.subject = message.subject || '';
      this.body = message.body || '';
      this.timestamp = message.timestamp || new Date();
      this.project = message.project || new Project({});
      this.request = message.request || new Request({});
    }
  }
}

export class Contractor {
  id: string;
  name: string;
  lastName: string;
  avatar: string;
  nickname: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  birthday: Date;
  notes: string;

  constructor(contractor: any) {
    {
      this.id = contractor.id || AppUtils.generateGUID(true);
      this.name = contractor.name || '';
      this.lastName = contractor.lastName || '';
      this.avatar = contractor.avatar || 'assets/images/avatars/profile.jpg';
      this.nickname = contractor.nickname || '';
      this.company = contractor.company || '';
      this.jobTitle = contractor.jobTitle || '';
      this.email = contractor.email || '';
      this.phone = contractor.phone || '';
      this.address = contractor.address || '';
      this.birthday = contractor.birthday || new Date();
      this.notes = contractor.notes || '';
    }
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

export class Project {
  id: string;
  name: string;
  owner: string;
  details: string;
  numContractors: number;
  openRequests: number;
  materialCostsEnabled: boolean;
  equipmentCostsEnabled: boolean;
  laborCostsEnabled: boolean;
  otherCostsEnabled: boolean;
  subcontractorCostsEnabled: boolean;
  invitedContractors: Contractor[];

  constructor(project: any) {
    {
      this.id = project.id || AppUtils.generateGUID(true);
      this.name = project.name || '';
      this.owner = project.owner || '';
      this.details = project.details || '';
      this.numContractors = project.numContractors || 0;
      this.openRequests = project.openRequests || 0;
      this.materialCostsEnabled = project.materialCostsEnabled || false;
      this.equipmentCostsEnabled = project.equipmentCostsEnabled || false;
      this.subcontractorCostsEnabled = project.subcontractorCostsEnabled || false;
      this.laborCostsEnabled = project.laborCostsEnabled || false;
      this.otherCostsEnabled = project.otherCostsEnabled || false;
      this.invitedContractors = project.invitedContractors || [];
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

export class Cost {
  id: string;
  subcontractor: Contractor;
  description: string;
  receipt: ByteString;
  subtotal: number;
  total: number;
  paid: number;
  unpaid: number;
  date: Date;
  approved: Boolean;
  reason: Boolean;
  approver: Contractor;
  actionDate: Date;
  submitDate: Date;
  type: string;
  status: string;
  disputes: Dispute[];
}

export class SubcontractorCosts {
  enabled: Boolean;
  total: number;
  paid: number;
  unpaid: number;
  costs: Cost[];
  constructor(subCost: any) {
    {
      this.enabled = subCost.enabled || false;
      this.total = subCost.total || 0;
      this.costs = subCost.costs || [];
    }
  }
}

export class MaterialCost {
  id: string;
  description: string;
  costPerUnit: number;
  unitQuantity: number;
  receipt: ByteString;
  subtotal: number;
  total: number;
  date: Date;
  approved: Boolean;
  reason: Boolean;
  status: string;
  approver: Contractor;
  actionDate: Date;
  submitDate: Date;
  disputes: Dispute[];

  constructor(mc: any) {
    {
      this.id = mc.id || AppUtils.generateGUID(true);
      this.total = mc.total || 0;
      this.subtotal = mc.subtotal || 0;
      this.unitQuantity = mc.unitQuantity || 0;
      this.description = mc.description || '';
      this.costPerUnit = mc.costPerUnit || 0;
      this.submitDate = mc.submitDate || new Date();
      this.status = mc.status || '';
      this.disputes = mc.disputes || [];
    }
  }
}

export class MaterialCosts {
  enabled: Boolean;
  total: number;
  paid: number;
  unpaid: number;
  costs: MaterialCost[];
  constructor(m: any) {
    {
      this.enabled = m.enabled || false;
      this.total = m.total || 0;
      this.costs = m.costs || [];
    }
  }
}

export class LaborCost {
  id: string;
  employee: Contractor;
  trade: string;
  payRate: number;
  regularTime: number;
  timeAndHalf: number;
  doubleTime: number;
  fut: number;
  sut: number;
  paid: number;
  unpaid: number;
  approved: Boolean;
  reason: Boolean;
  approver: Contractor;
  actionDate: Date;
  submitDate: Date;
  disputes: Dispute[];

  constructor(laborCost: any) {
    {
      this.id = laborCost.id || AppUtils.generateGUID(true);
      this.employee = laborCost.employee || new Contractor({});
      this.trade = laborCost.trade || '';
      this.payRate = laborCost.payRate || 0;
      this.regularTime = laborCost.regularTime || 0;
      this.timeAndHalf = laborCost.timeAndHalf || 0;
      this.doubleTime = laborCost.doubleTime || 0;
      this.fut = laborCost.fut || 0;
      this.sut = laborCost.sut || 0;
      this.disputes = laborCost.disputes || [];
    }
  }
}

export class LaborCosts {
  zipCode: string;
  totalHours: number;
  payroll: number;
  benefits: number;
  additives: number;
  total: number;
  paid: number;
  unpaid: number;
  submitter: Contractor;
  submitDate: Date;
  actionDate: Date;
  enabled: Boolean;

  constructor(laborCosts: any) {
    {
      this.enabled = laborCosts.enabled || false;
      this.zipCode = laborCosts.zipCode || '90210';
      this.totalHours = laborCosts.totalHours || 0;
      this.payroll = laborCosts.payroll || 0;
      this.benefits = laborCosts.benefits || 0;
      this.additives = laborCosts.additives || 0;
      this.total = laborCosts.total || 0;
      this.paid = laborCosts.paid || 0;
      this.unpaid = laborCosts.unpaid || 0;
      this.submitter = laborCosts.submitter || new Contractor({});
    }
  }
}

export class Equipment {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  description: string;
  ownershipCost: number;
  operatingCost: number;
  baseRental: number;
  fhwa: number;
  constructor(m: any) {
    this.id = m.id || AppUtils.generateGUID(true);
    this.make = m.make || m.manufacturerName || '';
    this.model = m.model || m.modelName || '';
    this.year = Number(m.year) || Number(new Date(m.dateIntroduced).getFullYear) || 2018;
    this.vin = m.vin || 0;
    this.description = m.description || m.categoryName || '';
    this.ownershipCost = Number(m.ownershipCost) || 0;
    this.operatingCost = Number(m.operatingCost) || 0;
    this.baseRental = Number(m.baseRental) || 0;
    this.fhwa = Number(m.fhwa) || 0;
  }
}

export class ActiveCost {
  id: string;
  machine: Equipment;
  hours: number;
  transportationCost: number;
  total: number;
  paid: number;
  unpaid: number;
  approved: Boolean;
  reason: Boolean;
  approver: Contractor;
  actionDate: Date;
  submitDate: Date;
  status: string;
  disputes: Dispute[];
}

export class StandbyCost {
  id: string;
  machine: Equipment;
  transportationCost: number;
  total: number;
  paid: number;
  unpaid: number;
  hours: number;
  approved: Boolean;
  reason: Boolean;
  approver: Contractor;
  actionDate: Date;
  submitDate: Date;
  status: string;
  disputes: Dispute[];
}

export class RentalCost {
  id: string;
  date: Date;
  machine: Equipment;
  description: string;
  transportationCost: number;
  other: number;
  invoice: ByteString;
  total: number;
  paid: number;
  unpaid: number;
  approved: Boolean;
  reason: Boolean;
  approver: Contractor;
  actionDate: Date;
  submitDate: Date;
  status: string;
  disputes: Dispute[];
}

export class ActiveCosts {
  startDate: Date;
  endDate: Date;
  regionalAdjustment: string;
  costs: ActiveCost[];
  total: number;
  paid: number;
  unpaid: number;
  constructor(activeCosts: any) {
    {
      this.startDate = activeCosts.startDate || new Date();
      this.endDate = activeCosts.endDate || new Date();
      this.regionalAdjustment = activeCosts.regionalAdjustment || '';
      this.costs = activeCosts.costs || new Array<ActiveCost>();
      this.paid = activeCosts.paid || 0;
      this.unpaid = activeCosts.unpaid || 0;
    }
  }
}

export class StandbyCosts {
  startDate: Date;
  endDate: Date;
  regionalAdjustment: string; // state
  costs: StandbyCost[];
  total: number;
  paid: number;
  unpaid: number;
  constructor(standbyCosts: any) {
    {
      this.startDate = standbyCosts.startDate || new Date();
      this.endDate = standbyCosts.endDate || new Date();
      this.regionalAdjustment = standbyCosts.regionalAdjustment || '';
      this.costs = standbyCosts.costs || [];
      this.paid = standbyCosts.paid || 0;
      this.unpaid = standbyCosts.unpaid || 0;
    }
  }
}

export class EquipmentCosts {
  enabled: Boolean;
  activeCosts: ActiveCosts;
  standbyCosts: StandbyCosts;
  rentalCosts: RentalCosts;
  total: number;
  paid: number;
  unpaid: number;

  constructor(equipmentCosts: any) {
    {
      this.enabled = equipmentCosts.enabled || false;
      this.activeCosts = equipmentCosts.activeCosts || new ActiveCosts({});
      this.standbyCosts = equipmentCosts.standbyCosts || new StandbyCosts({});
      this.rentalCosts = equipmentCosts.rentalCosts || new RentalCosts({});
      this.total = equipmentCosts.total || 0;
      this.paid = equipmentCosts.paid || 0;
      this.unpaid = equipmentCosts.unpaid || 0;
    }
  }
}

export class RentalCosts {
  enabled: Boolean;
  costs: RentalCost[];
  total: number;
  startDate: Date;
  endDate: Date;
  paid: number;
  unpaid: number;

  constructor(rentalCosts: any) {
    {
      this.enabled = rentalCosts.enabled || false;
      this.costs = rentalCosts.costs || new Array<RentalCost>();
      this.total = rentalCosts.total || 0;
      this.paid = rentalCosts.paid || 0;
      this.unpaid = rentalCosts.unpaid || 0;
      this.startDate = rentalCosts.startDate || new Date();
      this.endDate = rentalCosts.endDate || new Date();
    }
  }
}

export class OtherCosts {
  enabled: Boolean;
  costs: Cost[];
  total: number;
  paid: number;
  unpaid: number;
  constructor(otherCosts: any) {
    {
      this.enabled = otherCosts.enabled || false;
      this.costs = otherCosts.costs || new Array<Cost>();
      this.total = otherCosts.total || 0;
      this.paid = otherCosts.paid || 0;
      this.unpaid = otherCosts.unpaid || 0;
    }
  }
}

export class Costs {
  total: number;
  paid: number;
  unpaid: number;
  equipmentCosts: EquipmentCosts;
  laborCosts: LaborCosts;
  materialCosts: MaterialCosts;
  otherCosts: OtherCosts;
  subcontractorCosts: SubcontractorCosts;
  company: Company;
  constructor(costs: any) {
    {
      this.equipmentCosts = costs.equipmentCosts || new EquipmentCosts({});
      this.laborCosts = costs.laborCosts || new LaborCosts({});
      this.materialCosts = costs.materialCosts || new MaterialCosts({});
      this.otherCosts = costs.otherCosts || new OtherCosts({});
      this.subcontractorCosts = costs.subcontractorCosts || new SubcontractorCosts({});
      this.total = costs.total || 0;
      this.paid = costs.paid || 0;
      this.unpaid = costs.unpaid || 0;
      this.company = costs.company || new Company({});
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

export class Request {
  id: string;
  name: string;
  project: Project;
  type: string;
  requestDate: Date;
  startDate: Date;
  endDate: Date;
  costs: Costs;
  signatures: Signatures;
  total: number;
  messages: number;
  status: string;
  disputes: Dispute[];

  public constructor(request: any) {
    {
      this.id = request.id || AppUtils.generateGUID();
      this.name = request.name || '';
      this.project = request.project || new Project({});
      this.type = request.type || 'Force Account';
      this.requestDate = request.requestDate || new Date();
      this.startDate = request.startDate || new Date();
      this.endDate = request.endDate || new Date();
      this.costs = request.costs || new Costs({});
      this.signatures = request.signatures || new Signatures({});
      this.messages = request.messages || 0;
      this.total = request.total || 0;
      this.status = request.status || 'UNPAID';
    }
  }

  recalculateTotalMaterial() {
    let total = 0;
    for (let i = 0; i < this.costs.materialCosts.costs.length; i++) {
      const c: MaterialCost = this.costs.materialCosts.costs[i];
      total += c.total;
    }
    this.costs.materialCosts.total = total;
  }

  recalculateTotalEquipment() {
    let total = 0;
    let activeTotal = 0;
    let standbyTotal = 0;
    let rentalTotal = 0;
    for (let i = 0; i < this.costs.equipmentCosts.activeCosts.costs.length; i++) {
      const c: ActiveCost = this.costs.equipmentCosts.activeCosts.costs[i];
      activeTotal += c.total;
    }
    for (let i = 0; i < this.costs.equipmentCosts.standbyCosts.costs.length; i++) {
      const c: StandbyCost = this.costs.equipmentCosts.standbyCosts.costs[i];
      standbyTotal += c.total;
    }
    for (let i = 0; i < this.costs.equipmentCosts.rentalCosts.costs.length; i++) {
      const c: RentalCost = this.costs.equipmentCosts.rentalCosts.costs[i];
      rentalTotal += c.total;
    }
    this.costs.equipmentCosts.activeCosts.total = activeTotal;
    this.costs.equipmentCosts.standbyCosts.total = standbyTotal;
    this.costs.equipmentCosts.rentalCosts.total = rentalTotal;
    total = activeTotal + standbyTotal + rentalTotal;
    this.costs.equipmentCosts.total = total;
  }

  recalculateTotalLabor() {
    const total = 0;
    this.costs.laborCosts.total = total;
  }

  recalculateTotalSubcontractor() {
    let total = 0;
    for (let i = 0; i < this.costs.subcontractorCosts.costs.length; i++) {
      const c: Cost = this.costs.subcontractorCosts.costs[i];
      total += c.total;
    }
    this.costs.subcontractorCosts.total = total;
  }

  recalculateTotalOther() {
    let total = 0;
    for (let i = 0; i < this.costs.otherCosts.costs.length; i++) {
      const c: Cost = this.costs.otherCosts.costs[i];
      total += c.total;
    }
    this.costs.otherCosts.total = total;
  }

  recalculateTotal() {
    let t = 0;
    if (this.costs.equipmentCosts) {
      this.recalculateTotalEquipment();
      t += this.costs.equipmentCosts.total;
    }
    if (this.costs.laborCosts) {
      this.recalculateTotalLabor();
      t += this.costs.laborCosts.total;
    }
    if (this.costs.materialCosts) {
      this.recalculateTotalMaterial();
      t += this.costs.materialCosts.total;
    }
    if (this.costs.otherCosts) {
      this.recalculateTotalOther();
      t += this.costs.otherCosts.total;
    }
    if (this.costs.subcontractorCosts) {
      this.recalculateTotalSubcontractor();
      t += this.costs.subcontractorCosts.total;
    }
    this.costs.total = t;
    this.total = t;
  }

  calculateTotal() {
    this.recalculateTotal();
  }
}
/*
export class Company {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  coordinates: string;
  phone: string;
  url: string;
  employees: Array<Contractor>;
}
*/

/**
 *
 *
 * @export
 * @class Company
 */
export class Company {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  coordinates: string;
  phone: string;
  url: string;
  employees: Array<Contractor>;
  openRequests: number;
  totalPaid: number;
  constructor(c: any) {
    {
      this.id = c.id || AppUtils.generateGUID();
      this.name = c.name || '';
      this.email = c.email || '';
      this.address = c.address || '';
      this.city = c.city || '';
      this.state = c.state || '';
      this.zip = c.zip || '';
      this.coordinates = c.coordinates || '';
      this.phone = c.phone || '';
      this.url = c.url || '';
      this.employees = c.employess || new Array<Contractor>();
      this.openRequests = c.openRequests || 0;
      this.totalPaid = c.totalPaid || 0;
    }
  }
}

/**
 *
 *
 * @export
 * @class LogEntry
 */
export class LogEntry {
  id: string;
  date: Date;
  project: Project;
  request: Request;
  log: string;
  constructor(log: any) {
    {
      this.id = log.id || AppUtils.generateGUID();
      this.date = log.date || new Date();
      this.log = log.log || '';
      this.project = log.project;
      this.request = log.request;
    }
  }
}
