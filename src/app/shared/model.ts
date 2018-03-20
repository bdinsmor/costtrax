
import { AppUtils } from '@app/core/utils/utils';
import { Contact } from '@app/contacts/contact.model';

export class Project {
  id: string;
  name: string;
  owner: string;
  details: string;
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

export class OtherCost {
  enabled: Boolean;
  total: number;
  costs: Array<Cost>;
  constructor(otherCost: any) {
    {
      this.enabled = otherCost.enabled || false;
      this.total = otherCost.total || 0;
      this.costs = otherCost.costs || new Array<Cost>();
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
  zipCode: number;
  totalHours: number;
  payroll: number;
  benefits: number;
  additives: number;
  totalCost: number;
  submitter: Contact;
  constructor(laborCosts: any) {
    {
      this.zipCode = laborCosts.zipCode || 90210;
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
}

export class ActiveCost {
  machine: Machine;
  description: string;
  ownershipCost: number;
  operatingCost: number;
  fhwa: number;
  hours: number;
  transportationCost: number;
  total: number;
}

export class StandbyCost {
  machine: Machine;
  ownershipCost: number;
  operatingCost: number;
  fhwa: number;
  hours: number;
  transportationCost: number;
  total: number;
}

export class RentalCost {
  description: string;
  machine: Machine;
  baseRental: number;
  transportation: number;
  other: number;
  invoice: ByteString;
  total: number;
}

export class ActiveCosts {
  startDate: Date;
  endDate: Date;
  regionalAdjustment: string;
  ownership: number;
  operating: number;
  costs: Array<ActiveCost>;
  constructor(activeCosts: any) {
    {
      this.startDate = activeCosts.startDate || new Date();
      this.endDate = activeCosts.endDate || new Date();
      this.regionalAdjustment = activeCosts.regionalAdjustment || '';
      this.ownership = activeCosts.ownership || 0;
      this.operating = activeCosts.operating || 0;
      this.costs = activeCosts.costs || new Array<ActiveCost>();
    }
  }
}

export class StandbyCosts {
  startDate: Date;
  endDate: Date;
  regionalAdjustment: string;
  ownership: number;
  operating: number;
  costs: Array<StandbyCost>;
  constructor(standbyCosts: any) {
    {
      this.startDate = standbyCosts.startDate || new Date();
      this.endDate = standbyCosts.endDate || new Date();
      this.regionalAdjustment = standbyCosts.regionalAdjustment || '';
      this.ownership = standbyCosts.ownership || 0;
      this.operating = standbyCosts.operating || 0;
      this.costs = standbyCosts.costs || new Array<StandbyCost>();
    }
  }
}


export class EquipmentCosts {
  enabled: Boolean;
  activeCosts: ActiveCosts;
  standbyCosts: StandbyCosts;
  rentalCosts: Array<RentalCost>;
  constructor(equipmentCosts: any) {
    {
      this.enabled = equipmentCosts.enabled || false;
      this.activeCosts = equipmentCosts.activeCosts || new ActiveCosts({});
      this.standbyCosts = equipmentCosts.standbyCosts || new StandbyCosts({});
      this.rentalCosts = equipmentCosts.rentalCosts || new Array<RentalCost>();
    }
  }
}

export class OtherCosts {
  enabled: Boolean;
  costs: Array<OtherCost>;
  total: number;
  constructor(otherCosts: any) {
    {
      this.enabled = otherCosts.enabled || false;
      this.costs = otherCosts.costs || new Array<OtherCost>();
      this.total = otherCosts.total || 0;
    }
  }
}

export class Costs {
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
