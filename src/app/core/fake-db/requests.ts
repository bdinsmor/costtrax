declare var Chance: any; // for externals librairies
import * as _ from 'lodash';
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
  OtherCosts,
  Activity,
  LogEntry,
  Contractor
} from '../../shared/model';

export class RequestsFakeDb {
  chance: any;
  public machines: Array<Machine> = [];
  public projects: Array<Project> = [];
  public requests: Array<Request> = [];
  public companies: Array<Company> = [];
  public contractors: Array<Contractor> = [];
  public activities: Array<Activity> = [];
  public logEntries: Array<LogEntry> = [];
  private actions: Array<string> = ['requested more info', 'approved', 'rejected', 'placed under review'];
  private projectTypes: Array<string> = ['Project', 'Expansion', 'Construction'];

  constructor() {
    this.chance = new Chance();
    try {
      const numProjects = this.chance.integer({ min: 5, max: 15 });
      const numCompanies = this.chance.integer({ min: 2, max: 15 });
      const numRequests = this.chance.integer({ min: 25, max: 75 });
      this.createMachines();
      this.createCompanies(numCompanies);
      this.createProjects(numProjects);
      this.createRequests(numRequests);
      this.createActivities();
      this.createHistory();
      this.finalize();
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  finalize(): void {
    const cTracker: Map<string, string> = new Map<string, string>();
    let companyId = '';
    for (let i = 0; i < this.requests.length; i++) {
      this.updateCompany(this.requests[i].costs);
      companyId = this.requests[i].costs.company.id;
      this.updateProject(this.requests[i].costs.company.name, this.requests[i], !cTracker.has(companyId));
      cTracker.set(companyId, companyId);
    }
  }

  updateProject(companyName: string, request: Request, includeEmployees: boolean): void {
    const projectId: string = request.project.id;
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].id === projectId) {
        if (includeEmployees) {
          this.projects[i].numContractors = +this.projects[i].numContractors + request.costs.company.employees.length;
        } else {
          this.projects[i].numContractors = +request.costs.company.employees.length;
        }
        this.projects[i].openRequests = +this.projects[i].openRequests + 1;
      }
    }
  }

  updateCompany(costs: Costs): void {
    const companyId: string = costs.company.id;
    for (let i = 0; i < this.companies.length; i++) {
      if (this.companies[i].id === companyId) {
        this.companies[i].openRequests++;
        const o: number = this.companies[i].totalPaid;
        const n: number = costs.total;
        const total: number = +o + +n;

        this.companies[i].totalPaid = Number(total.toFixed(2));
        // console.log('totalPaid:  ' + this.companies[i].totalPaid);
      }
    }
  }

  createActivities(): void {
    this.activities = [];
    for (let i = 0; i < this.chance.integer({ min: 5, max: 35 }); i++) {
      const timestamp: Date = this.chance.date({ year: 2018 });
      const r: Request = _.sample(this.requests);
      this.activities.push(
        new Activity({
          project: r.project,
          request: r,
          details: 'created',
          timestamp: timestamp
        })
      );
    }
  }

  createHistory(): void {
    this.logEntries = [];
    for (let i = 0; i < this.chance.integer({ min: 5, max: 35 }); i++) {
      const r: Request = _.sample(this.requests);

      this.logEntries.push(
        new LogEntry({
          project: r.project,
          request: r,
          date: this.chance.date({ year: 2018 }),
          log: _.sample(this.actions)
        })
      );
    }
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
      // m.operatingCost = m.operatingCost * 1000;
      m.fhwa = this.chance.floating({ min: 25, max: 75, fixed: 2 });
      this.machines.push(m);
    }
  }

  createProjects(num: number): void {
    this.projects = [];
    for (let i = 0; i < num; i++) {
      const p: Project = new Project({});
      p.id = AppUtils.generateGUID(true);
      p.name =
        this.chance.animal() +
        ' ' +
        this.chance.animal() +
        this.chance.weighted([' Project', ' Construction', ' Expansion'], [5, 3, 3]);
      p.details = this.chance.paragraph({ sentences: this.chance.integer({ min: 5, max: 15 }) });
      p.owner = _.sample(this.contractors).name;
      this.projects.push(p);
    }
  }

  createCompanies(num: number): void {
    this.companies = [];
    this.contractors = [];
    for (let i = 0; i < num; i++) {
      const company: Company = new Company({});
      const numEmployees: number = this.chance.integer({ min: 1, max: 15 });
      const companyName = this.chance.company();
      const employees: Array<Contractor> = [];
      for (let j = 0; j < numEmployees; j++) {
        const employee: Contractor = new Contractor({
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
        this.contractors.push(employee);
      }
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
      const costs: Costs = this.createCosts(company, employee, startDate, endDate);
      const statusPaid: Boolean = this.chance.bool({ likelihood: 40 });
      let status = 'UNPAID';
      if (statusPaid) {
        status = 'PAID';
      }
      const id: String = AppUtils.generateGUID(true);
      const request = new Request({
        id: id,
        name: p.name + this.chance.weighted([' Expansion Project', ' Construction Project'], [5, 1]),
        project: p,
        requestDate: this.chance.date({ year: 2018 }),
        startDate: startDate,
        endDate: endDate,
        costs: costs,
        total: costs.total,
        messages: this.chance.integer({ min: 0, max: 10 }),
        signatures: this.createSignatures(company, employee, endDate),
        status: status
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

  createSignatures(company: Company, employee: Contractor, endDate: Date): Signatures {
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
  subcontractor: Contractor;
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

  createCosts(company: Company, employee: Contractor, startDate: Date, endDate: Date): Costs {
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
      total: total.toFixed(2),
      company: company
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

  createActiveCosts(company: Company, startDate: Date, endDate: Date): ActiveCosts {
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
        s.actionDate = this.chance.date({ year: endDate.getFullYear(), month: endDate.getMonth() - 1 });
        s.submitDate = this.chance.date({ year: startDate.getFullYear, month: startDate.getMonth() });
        s.approved = this.chance.bool({ likelihood: 60 });
        s.approver = _.sample(company.employees);
        s.reason = this.chance.sentence();
        total += s.total;
        activeList.push(s);
      }
      // console.log('active costs: ' + activeList.length);
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

  createStandbyCosts(company: Company, startDate: Date, endDate: Date): StandbyCosts {
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
        s.actionDate = this.chance.date({ year: endDate.getFullYear(), month: endDate.getMonth() - 1 });
        s.submitDate = this.chance.date({ year: startDate.getFullYear, month: startDate.getMonth() });
        s.approved = this.chance.bool({ likelihood: 60 });
        s.approver = _.sample(company.employees);
        s.reason = this.chance.sentence();
        total += s.total;
        scList.push(s);
        // console.log('standby costs: ' + scList.length);
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

  createRentalCosts(company: Company, startDate: Date, endDate: Date): RentalCosts {
    const rentalEnabled: Boolean = this.chance.bool({ likelihood: 60 });
    if (rentalEnabled) {
      const rc: Array<RentalCost> = [];
      let total = 0;
      for (let i = 0; i < this.chance.integer({ min: 1, max: 10 }); i++) {
        const s: RentalCost = new RentalCost();
        s.machine = _.sample(this.machines);
        s.date = this.chance.date({ year: startDate.getFullYear(), month: endDate.getMonth() - 1 });
        s.transportationCost = this.chance.floating({ min: 10, max: 250, fixed: 2 });
        s.other = this.chance.floating({ min: 0, max: 250, fixed: 2 });
        s.total = s.transportationCost + s.other;
        s.actionDate = this.chance.date({ year: endDate.getFullYear(), month: endDate.getMonth() - 1 });
        s.submitDate = this.chance.date({ year: startDate.getFullYear, month: startDate.getMonth() });
        s.approved = this.chance.bool({ likelihood: 60 });
        s.approver = _.sample(company.employees);
        s.reason = this.chance.sentence();
        total += s.total;
        rc.push(s);
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

  createEquipmentCosts(company: Company, employee: Contractor, startDate: Date, endDate: Date): EquipmentCosts {
    const equipmentCostsEnabled: Boolean = this.chance.bool({ likelihood: 80 });

    if (equipmentCostsEnabled) {
      return new EquipmentCosts({
        enabled: equipmentCostsEnabled,
        activeCosts: this.createActiveCosts(company, startDate, endDate),
        rentalCosts: this.createRentalCosts(company, startDate, endDate),
        standbyCosts: this.createStandbyCosts(company, startDate, endDate)
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

  createMaterialCosts(company: Company, employee: Contractor, startDate: Date, endDate: Date): MaterialCosts {
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
        c.actionDate = this.chance.date({ year: endDate.getFullYear(), month: endDate.getMonth() - 1 });
        c.submitDate = this.chance.date({ year: startDate.getFullYear, month: startDate.getMonth() });
        c.approved = this.chance.bool({ likelihood: 60 });
        c.approver = _.sample(company.employees);
        c.reason = this.chance.sentence();
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

  createLaborCosts(company: Company, signee: Contractor, startDate: Date, endDate: Date): LaborCosts {
    const laborCostsEnabled: Boolean = this.chance.bool({ likelihood: 10 });
    const laborCostList: Array<LaborCost> = [];
    /*
     zipCode: number;
  totalHours: number;
  payroll: number;
  benefits: number;
  additives: number;
  totalCost: number;
  submitter: Contractor;
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

  createSubcontractorCosts(company: Company, employee: Contractor, startDate: Date, endDate: Date): SubcontractorCosts {
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
        c.actionDate = this.chance.date({ year: endDate.getFullYear(), month: endDate.getMonth() - 1 });
        c.submitDate = this.chance.date({ year: startDate.getFullYear, month: startDate.getMonth() });
        c.approved = this.chance.bool({ likelihood: 60 });
        c.approver = _.sample(company.employees);
        c.reason = this.chance.sentence();
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

  createOtherCosts(company: Company, employee: Contractor, startDate: Date, endDate: Date): OtherCosts {
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
        c.actionDate = this.chance.date({ year: endDate.getFullYear(), month: endDate.getMonth() - 1 });
        c.submitDate = this.chance.date({ year: startDate.getFullYear, month: startDate.getMonth() });
        c.approved = this.chance.bool({ likelihood: 60 });
        c.approver = _.sample(company.employees);
        c.reason = this.chance.sentence();
        otherCostList.push(c);
        otherTotal += c.total;
      }
    }
    return new OtherCosts({ enabled: otherCostsEnabled, costs: otherCostList, total: otherTotal });
  }
}
