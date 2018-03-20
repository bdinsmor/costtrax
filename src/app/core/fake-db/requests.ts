declare var Chance: any; // for externals librairies
import * as _ from 'lodash';
import { Contact } from '@app/contacts/contact.model';
import { AppUtils } from '@app/core/utils/utils';
import {
  Request,
  Project,
  LaborCosts,
  EquipmentCosts,
  ActiveCosts,
  StandbyCost,
  ActiveCost,
  Machine,
  Company,
  Signatures,
  Costs,
  StandbyCosts,
  RentalCost,
  RentalCosts,
  MaterialCost,
  MaterialCosts,
  LaborCost,
  Cost,
  SubcontractorCosts,
  OtherCosts
} from '../../shared/model';

export class RequestsFakeDb {
  chance: any;
  public machines: Array<Machine>;
  public projects: Array<Project>;
  public requests: Array<Request>;
  public companies: Array<Company>;

  constructor(numProjects: number, numCompanies: number, numRequests: number) {
    this.chance = new Chance();
    this.createMachines();
    this.createProjects(numProjects);
    this.createCompanies(numCompanies);
    this.createRequests(numRequests);
  }

  getRequests(): Array<Request> {
    return this.requests;
  }

  createMachines() {
    this.machines = [];
    for (let i = 0; i < this.chance.integer({ min: 5, max: 35 }); i++) {
      const m = new Machine();
      m.make = this.chance.weighted(['Caterpillar', 'JCB', 'Komatsu', 'Volvo'], [60, 40, 25, 10]);
      m.model = this.chance.weighted(
        [
          'AP555F',
          'AP255E',
          'SE60 VT XW Tamper Bar Screed',
          '150T Compact Track Loader',
          'D6K2',
          'D9T',
          'D11T',
          '3CX',
          '3CX 14',
          '4CX 14 Super'
        ],
        [5, 5, 5, 5, 4, 4, 4, 3, 2, 2]
      );
      m.vin = this.chance.cf();
      m.year = this.chance.year({ min: 2008, max: 2018 });
      m.ownershipCost = this.chance.floating({ min: 10, max: 50, fixed: 2 });
      m.operatingCost = this.chance.floating({ min: 15, max: 60, fixed: 2 });
      m.operatingCost = m.operatingCost * 1000;
      m.fhwa = this.chance.floating({ min: 25, max: 75, fixed: 2 });
      this.machines.push(m);
    }
  }

  createProjects(num: number): void {
    this.projects = [];
    for (let i = 0; i < num; i++) {
      const p: Project = new Project();
      p.id = AppUtils.generateGUID();
      p.name = this.chance.animal();
      p.details = this.chance.paragraph({ sentences: this.chance.integer({ min: 5, max: 15 }) });
    }
  }

  createCompanies(num: number): void {
    this.companies = [];
    for (let i = 0; i < num; i++) {
      const company: Company = new Company();
      const numEmployees: number = this.chance.integer({ min: 3, max: 5000 });
      const companyName = this.chance.company();
      const employees: Array<Contact> = [];
      for (let j = 0; j < numEmployees; j++) {
        const employee: Contact = new Contact({
          id: this.chance.guid(),
          avatar: this.chance.avatar(),
          name: this.chance.first(),
          lastName: this.chance.last(),
          birthday: this.chance.birthday(),
          phone: this.chance.phone(),
          nickname: this.chance.last(),
          address: this.chance.address(),
          notes: this.chance.paragraph({ sentences: this.chance.integer({ min: 1, max: 5 }) }),
          company: companyName,
          jobTitle: this.chance.profession()
        });
        employees.push(employee);
        company.name = companyName;
        company.address = this.chance.address();
        company.phone = this.chance.phone();
        company.url = this.chance.url();
        company.coordinates = this.chance.coordinates();
        company.email = this.chance.email();
        company.employees = employees;
        this.companies.push(company);
      }
    }
  }

  createRequests(num: number): void {
    this.requests = [];
    for (let i = 0; i < num; i++) {
      const startDate: Date = this.chance.date({
        year: 2017,
        month: this.chance.integer({ min: 1, max: 4 })
      });
      const endDate: Date = this.chance.date({
        year: 2017,
        month: this.chance.integer({ min: startDate.getMonth(), max: startDate.getMonth() + 6 })
      });
      const company: Company = _.sample(this.companies);
      const employee = _.sample(company.employees);
      const p: Project = _.sample(this.projects);
      const request = new Request({
        id: AppUtils.generateGUID(),
        name: p.name + this.chance.weighted([' Expansion Project', ' Construction Project'], [5, 1]),
        project: p,
        requestDate: this.chance.date({ year: 2017 }),
        startDate: startDate,
        endDate: endDate,
        costs: this.createCosts(company, employee, startDate, endDate),
        signatures: this.createSignatures(company, employee, endDate)
      });
      // id: string;
      // name: string;
      // project: Project;
      //  type: string;
      //  requestDate: Date;
      //  startDate: Date;
      //  endDate: Date;
      //  costs: Costs;
      //  signatures: Signatures;
      this.requests.push(request);
    }
  }

  createSignatures(company: Company, employee: Contact, endDate: Date): Signatures {
    // contractorName: string;
    // dotName: string;
    //  date: Date;

    const s: Signatures = new Signatures({
      contractorName: employee.name,
      dotName: this.chance.state() + ' DOT',
      date: this.chance.date({ year: 2017, month: endDate.getMonth() - 1 })
    });
    return s;
  }

  /*
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

  */

  createCosts(company: Company, employee: Contact, startDate: Date, endDate: Date): Costs {
    // total: number;
    // equipmentCosts: EquipmentCosts;
    // laborCosts: LaborCosts;
    // materialCosts: MaterialCosts;
    // otherCosts: OtherCosts;
    // subcontractorCosts: SubcontractorCosts;

    let total = 0;

    const equipmentCosts = this.createEquipmentCosts(company, employee, startDate, endDate);
    total += equipmentCosts.total;
    const subcontractorCosts = this.createSubcontractorCosts(company, employee, startDate, endDate);
    total += subcontractorCosts.total;
    const materialCosts = this.createMaterialCosts(company, employee, startDate, endDate);
    total += materialCosts.total;
    const laborCosts = this.createLaborCosts(company, employee, startDate, endDate);
    // total += laborCosts.total;
    const otherCosts = this.createOtherCosts(company, employee, startDate, endDate);
    total += otherCosts.total;

    const costs: Costs = new Costs({
      subcontractorCosts: subcontractorCosts,
      materialCosts: materialCosts,
      equipmentCosts: equipmentCosts,
      laborCosts: laborCosts,
      otherCosts: otherCosts,
      total: total
    });
    return costs;
  }

  /*
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
*/

  createActiveCosts(startDate: Date, endDate: Date): ActiveCosts {
    const activeList: Array<ActiveCost> = [];
    const stanbyCostEnabled: Boolean = this.chance.bool({ likelihood: 40 });
    if (stanbyCostEnabled) {
      let total = 0;
      for (let i = 0; i < this.chance.integer({ min: 1, max: 10 }); i++) {
        const s: ActiveCost = new ActiveCost();
        s.machine = _.sample(this.machines);
        s.hours = this.chance.integer({ min: 1, max: 100 });
        s.transportationCost = this.chance.floating({ min: 10, max: 250, fixed: 2 });
        s.total = s.transportationCost + s.hours * s.machine.operatingCost;
        total += s.total;
        activeList.push(s);
      }
      return new ActiveCosts({
        costs: activeList,
        startDate: startDate,
        endDate: endDate,
        regionalAdjustment: this.chance.state(),
        total: total
      });
    } else {
      return new ActiveCosts({});
    }
  }

  createStandbyCosts(startDate: Date, endDate: Date): StandbyCosts {
    const scList: Array<StandbyCost> = [];
    const stanbyCostEnabled: Boolean = this.chance.bool({ likelihood: 40 });
    if (stanbyCostEnabled) {
      let total = 0;
      for (let i = 0; i < this.chance.integer({ min: 1, max: 10 }); i++) {
        const s: StandbyCost = new StandbyCost();
        s.machine = _.sample(this.machines);
        s.hours = this.chance.integer({ min: 1, max: 100 });
        s.transportationCost = this.chance.floating({ min: 10, max: 250, fixed: 2 });
        s.total = s.transportationCost + s.hours * s.machine.operatingCost;
        total += s.total;
        scList.push(s);
      }
      return new StandbyCosts({
        costs: scList,
        startDate: startDate,
        endDate: endDate,
        regionalAdjustment: this.chance.state(),
        total: total
      });
    } else {
      return new StandbyCosts({});
    }
  }

  createRentalCosts(startDate: Date, endDate: Date): RentalCosts {
    const rentalEnabled: Boolean = this.chance.bool({ likelihood: 60 });
    if (rentalEnabled) {
      const rc: Array<RentalCost> = [];
      let total = 0;
      for (let i = 0; i < this.chance.integer({ min: 1, max: 10 }); i++) {
        const r: RentalCost = new RentalCost();
        r.machine = _.sample(this.machines);
        r.date = this.chance.date({ year: startDate.getFullYear(), month: endDate.getMonth() - 1 });
        r.transportationCost = this.chance.floating({ min: 10, max: 250, fixed: 2 });
        r.other = this.chance.floating({ min: 0, max: 250, fixed: 2 });
        r.total = r.transportationCost + r.other;
        total += r.total;
        rc.push(r);
      }
      return new RentalCosts({
        startDate: startDate,
        endDate: endDate,
        costs: rc,
        enabled: rentalEnabled,
        total: total
      });
    } else {
      return new RentalCosts({});
    }
  }

  createEquipmentCosts(company: Company, employee: Contact, startDate: Date, endDate: Date): EquipmentCosts {
    const equipmentCostsEnabled: Boolean = this.chance.bool({ likelihood: 80 });

    if (equipmentCostsEnabled) {
      return new EquipmentCosts({
        enabled: equipmentCostsEnabled,
        activeCosts: this.createActiveCosts(startDate, endDate),
        rentalCosts: this.createRentalCosts(startDate, endDate),
        standbyCosts: this.createStandbyCosts(startDate, endDate)
      });
    } else {
      return new EquipmentCosts({
        enabled: equipmentCostsEnabled,
        activeCosts: new ActiveCosts({}),
        rentalCosts: [],
        standbyCosts: new StandbyCosts({})
      });
    }
  }

  /*
export class MaterialCost {
  description: string;
  costPerUnit: number;
  unitQuantity: number;
  receipt: ByteString;
  subtotal: number;
  total: number;
  date: Date;
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
  */

  createMaterialCosts(company: Company, employee: Contact, startDate: Date, endDate: Date): MaterialCosts {
    const materialCostsEnabled: Boolean = this.chance.bool({ likelihood: 65 });
    const materialCostList: Array<MaterialCost> = [];
    let materialCostTotal = 0;
    if (materialCostsEnabled) {
      for (let i = 0; i < this.chance.integer({ min: 1, max: 25 }); i++) {
        const c: MaterialCost = new MaterialCost();
        c.date = this.chance.date({
          year: endDate.getFullYear(),
          month: this.chance.integer({ min: startDate.getMonth(), max: endDate.getMonth() })
        });
        c.description = this.chance.sentence();
        c.costPerUnit = this.chance.floating({ min: 0.25, max: 100, fixed: 2 });
        c.unitQuantity = this.chance.integer({ min: 1, max: 15 });
        c.subtotal = c.costPerUnit * c.unitQuantity;
        c.total = c.subtotal * 0.5 + c.subtotal;
        materialCostList.push(c);
        materialCostTotal += c.total;
      }
    }
    return new MaterialCosts({
      enabled: materialCostsEnabled,
      costs: materialCostList,
      total: materialCostTotal
    });
  }

  createLaborCosts(company: Company, signee: Contact, startDate: Date, endDate: Date): LaborCosts {
    const laborCostsEnabled: Boolean = this.chance.bool({ likelihood: 10 });
    const laborCostList: Array<LaborCost> = [];
    /*
     zipCode: number;
  totalHours: number;
  payroll: number;
  benefits: number;
  additives: number;
  totalCost: number;
  submitter: Contact;
  */
    if (laborCostsEnabled) {
      const employee = _.sample(company.employees);
      const totalHours = this.chance.integer({ min: 20, max: 500 });
      const payroll = this.chance.integer({ min: 5000, max: 50000 });
      const benefits = this.chance.integer({ min: 1000, max: 4500 });
      const additives = this.chance.integer({ min: 400, max: 1000 });
      return new LaborCosts({
        submitter: employee,
        totalHours: totalHours,
        payroll: payroll,
        benefits: benefits,
        additives: additives,
        totalCost: payroll + benefits + additives,
        zipCode: this.chance.zip()
      });
    } else {
      return new LaborCosts({});
    }
  }

  createSubcontractorCosts(company: Company, employee: Contact, startDate: Date, endDate: Date): SubcontractorCosts {
    const subcontractorCostsEnabled: Boolean = this.chance.bool({ likelihood: 30 });
    const subcontractorCostList: Array<Cost> = [];
    let subcontractorTotal = 0;
    if (subcontractorCostsEnabled) {
      for (let i = 0; i < this.chance.integer({ min: 1, max: 6 }); i++) {
        const c: Cost = new Cost();
        c.date = this.chance.date({
          year: endDate.getFullYear(),
          month: this.chance.integer({ min: startDate.getMonth(), max: endDate.getMonth() })
        });
        c.description = this.chance.sentence();
        const subcontractor = _.sample(company.employees);
        c.subcontractor = subcontractor;
        c.subtotal = this.chance.integer({ min: 100, max: 16000 });
        c.total = c.subtotal;
        subcontractorCostList.push(c);
        subcontractorTotal += c.total;
      }
    }
    return new SubcontractorCosts({
      enabled: subcontractorCostsEnabled,
      costs: subcontractorCostList,
      total: subcontractorTotal
    });
  }

  createOtherCosts(company: Company, employee: Contact, startDate: Date, endDate: Date): OtherCosts {
    const otherCostsEnabled: Boolean = this.chance.bool({ likelihood: 20 });
    const otherCostList: Array<Cost> = [];
    let otherTotal = 0;
    if (otherCostsEnabled) {
      for (let i = 0; i < this.chance.integer({ min: 0, max: 4 }); i++) {
        const c: Cost = new Cost();
        c.date = this.chance.date({
          year: endDate.getFullYear(),
          month: this.chance.integer({ min: startDate.getMonth(), max: endDate.getMonth() })
        });
        c.description = this.chance.sentence();
        const subcontractor = _.sample(company.employees);
        c.subcontractor = subcontractor;
        c.subtotal = this.chance.integer({ min: 100, max: 16000 });
        c.total = c.subtotal;
        otherCostList.push(c);
        otherTotal += c.total;
      }
    }
    return new OtherCosts({ enabled: otherCostsEnabled, costs: otherCostList, total: otherTotal });
  }
}
