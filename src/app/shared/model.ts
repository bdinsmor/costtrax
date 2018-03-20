import { AppUtils } from '@app/core/utils/utils';
import { Contact } from '@app/contacts/contact.model';

export class Project {
  id: string;
  name: string;
  owner: string;
  details: string;
}

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
  employees: Array<Contact>;
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
  subcontractor: Contact;
  description: string;
  receipt: ByteString;
  subtotal: number;
  total: number;
  date: Date;
  approved: Boolean;
  reason: Boolean;
  approver: Contact;
  actionDate: Date;
  submitDate: Date;
}

export class SubcontractorCosts {
  enabled: Boolean;
  total: number;
  costs: Array<Cost>;
  constructor(subCost: any) {
    {
      this.enabled = subCost.enabled || false;
      this.total = subCost.total || 0;
      this.costs = subCost.costs || new Array<Cost>();
    }
  }
}

export class MaterialCost {
  description: string;
  costPerUnit: number;
  unitQuantity: number;
  receipt: ByteString;
  subtotal: number;
  total: number;
  date: Date;
  approved: Boolean;
  reason: Boolean;
  approver: Contact;
  actionDate: Date;
  submitDate: Date;
}

export class MaterialCosts {
  enabled: Boolean;
  total: number;
  materialCosts: Array<MaterialCost>;
  constructor(materialCosts: any) {
    {
      this.enabled = materialCosts.enabled || false;
      this.total = materialCosts.total || 0;
      this.materialCosts = materialCosts.materialCosts || new Array<MaterialCost>();
    }
  }
}

export class LaborCost {
  employee: Contact;
  trade: string;
  payRate: number;
  regularTime: number;
  timeAndHalf: number;
  doubleTime: number;
  fut: number;
  sut: number;
  approved: Boolean;
  reason: Boolean;
  approver: Contact;
  actionDate: Date;
  submitDate: Date;

  constructor(laborCost: any) {
    {
      this.employee = laborCost.employee || new Contact({});
      this.trade = laborCost.trade || '';
      this.payRate = laborCost.payRate || 0;
      this.regularTime = laborCost.regularTime || 0;
      this.timeAndHalf = laborCost.timeAndHalf || 0;
      this.doubleTime = laborCost.doubleTime || 0;
      this.fut = laborCost.fut || 0;
      this.sut = laborCost.sut || 0;
    }
  }
}

export class LaborCosts {
  zipCode: string;
  totalHours: number;
  payroll: number;
  benefits: number;
  additives: number;
  totalCost: number;
  submitter: Contact;
  submitDate: Date;
  actionDate: Date;

  constructor(laborCosts: any) {
    {
      this.zipCode = laborCosts.zipCode || '90210';
      this.totalHours = laborCosts.totalHours || 0;
      this.payroll = laborCosts.payroll || 0;
      this.benefits = laborCosts.benefits || 0;
      this.additives = laborCosts.additives || 0;
      this.totalCost = laborCosts.totalCost || 0;
      this.submitter = laborCosts.submitter || new Contact({});
    }
  }
}

export class Machine {
  make: string;
  model: string;
  year: number;
  vin: string;
  description: string;
  ownershipCost: number;
  operatingCost: number;
  baseRental: number;
  fhwa: number;
}

export class ActiveCost {
  machine: Machine;
  hours: number;
  transportationCost: number;
  total: number;
  approved: Boolean;
  reason: Boolean;
  approver: Contact;
  actionDate: Date;
  submitDate: Date;
}

export class StandbyCost {
  machine: Machine;
  transportationCost: number;
  total: number;
  hours: number;
  approved: Boolean;
  reason: Boolean;
  approver: Contact;
  actionDate: Date;
  submitDate: Date;
}

export class RentalCost {
  date: Date;
  machine: Machine;
  transportationCost: number;
  other: number;
  invoice: ByteString;
  total: number;
  approved: Boolean;
  reason: Boolean;
  approver: Contact;
  actionDate: Date;
  submitDate: Date;
}

export class ActiveCosts {
  startDate: Date;
  endDate: Date;
  regionalAdjustment: string;
  costs: Array<ActiveCost>;
  total: number;
  constructor(activeCosts: any) {
    {
      this.startDate = activeCosts.startDate || new Date();
      this.endDate = activeCosts.endDate || new Date();
      this.regionalAdjustment = activeCosts.regionalAdjustment || '';
      this.costs = activeCosts.costs || new Array<ActiveCost>();
    }
  }
}

export class StandbyCosts {
  startDate: Date;
  endDate: Date;
  regionalAdjustment: string; // state
  costs: Array<StandbyCost>;
  total: number;
  constructor(standbyCosts: any) {
    {
      this.startDate = standbyCosts.startDate || new Date();
      this.endDate = standbyCosts.endDate || new Date();
      this.regionalAdjustment = standbyCosts.regionalAdjustment || '';
      this.costs = standbyCosts.costs || new Array<StandbyCost>();
    }
  }
}

export class EquipmentCosts {
  enabled: Boolean;
  activeCosts: ActiveCosts;
  standbyCosts: StandbyCosts;
  rentalCosts: Array<RentalCost>;
  total: number;

  constructor(equipmentCosts: any) {
    {
      this.enabled = equipmentCosts.enabled || false;
      this.activeCosts = equipmentCosts.activeCosts || new ActiveCosts({});
      this.standbyCosts = equipmentCosts.standbyCosts || new StandbyCosts({});
      this.rentalCosts = equipmentCosts.rentalCosts || new RentalCosts({});
      this.total = equipmentCosts.total || 0;
    }
  }
}

export class RentalCosts {
  enabled: Boolean;
  costs: Array<RentalCost>;
  total: number;
  startDate: Date;
  endDate: Date;
  constructor(rentalCosts: any) {
    {
      this.enabled = rentalCosts.enabled || false;
      this.costs = rentalCosts.costs || new Array<RentalCost>();
      this.total = rentalCosts.total || 0;
      this.startDate = rentalCosts.startDate || new Date();
      this.endDate = rentalCosts.endDate || new Date();
    }
  }
}

export class OtherCosts {
  enabled: Boolean;
  costs: Array<Cost>;
  total: number;
  constructor(otherCosts: any) {
    {
      this.enabled = otherCosts.enabled || false;
      this.costs = otherCosts.costs || new Array<Cost>();
      this.total = otherCosts.total || 0;
    }
  }
}

export class Costs {
  total: number;
  equipmentCosts: EquipmentCosts;
  laborCosts: LaborCosts;
  materialCosts: MaterialCosts;
  otherCosts: OtherCosts;
  subcontractorCosts: SubcontractorCosts;
  constructor(costs: any) {
    {
      this.equipmentCosts = costs.equipmentCosts || new EquipmentCosts({});
      this.laborCosts = costs.laborCosts || new LaborCosts({});
      this.materialCosts = costs.materialCosts || new MaterialCosts({});
      this.otherCosts = costs.otherCosts || new OtherCosts({});
      this.subcontractorCosts = costs.subcontractorCosts || new SubcontractorCosts({});
    }
  }
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
  constructor(request: any) {
    {
      this.id = request.id || AppUtils.generateGUID();
      this.name = request.name || '';
      this.project = request.project || new Project();
      this.type = request.type || '';
      this.requestDate = request.requestDate || new Date();
      this.startDate = request.startDate || new Date();
      this.endDate = request.endDate || new Date();
      this.costs = request.costs || new Costs({});
      this.signatures = request.signatures || new Signatures({});
    }
  }
}
