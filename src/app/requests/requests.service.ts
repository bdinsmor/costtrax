import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import {
  Request,
  Contractor,
  Cost,
  MaterialCost,
  RentalCost,
  Equipment,
  StandbyCost,
  ActiveCost,
  Project,
  MaterialCosts,
  Costs
} from '@app/shared/model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RequestsService extends EntityServiceBase<Request> {
  foldersArr: any;
  filtersArr: any;
  labelsArr: any;
  requests: Request[];
  onFilterChanged: Subject<any> = new Subject();

  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Requests', entityServiceFactory);
  }

  findById(id: string): Request {
    if (!this.requests || this.requests.length === 0) {
      return null;
    }
    const r: Request = this.requests.find(x => x.id === id);

    return r;
  }

  buildRequests(lineItems: any[]) {
    const requestMap: Map<string, Request> = new Map<string, Request>();
    this.requests = [];
    const newNum = 0;
    for (let i = 0; i < lineItems.length; i++) {
      const li: any = lineItems[i];
      let r: Request;
      if (requestMap.has(li.requestId)) {
        r = requestMap.get(li.requestId);
      } else {
        r = new Request({});
      }
      const project: Project = new Project({ name: li.projectName, id: '' });
      const t: string = li.type;
      if (t === 'other') {
        const otherCost: Cost = new Cost();
        otherCost.status = li.status;
        otherCost.total = li.amount;
        otherCost.description = li.details.description;
        otherCost.type = li.details.type;
        r.costs.otherCosts.costs.push(otherCost);
      } else if (t === 'equipment.active') {
        const c: ActiveCost = new ActiveCost();
        c.id = li.id;
        c.total = li.amount;
        c.machine = new Equipment({});
        c.machine.make = li.details.make;
        c.machine.model = li.details.model;
        c.machine.vin = li.details.serial;
        c.machine.operatingCost = li.details.operating;
        c.machine.ownershipCost = li.details.ownership;
        c.machine.description = li.details.description;
        c.machine.year = li.details.year;
        c.hours = Number(Number(li.details.hours).toFixed(2));
        c.status = li.status;
        c.transportationCost = li.details.transport;
        r.costs.equipmentCosts.enabled = true;

        r.costs.equipmentCosts.activeCosts.costs.push(c);
      } else if (t === 'equipment.standby') {
        const c: StandbyCost = new StandbyCost();
        c.id = li.id;
        c.total = li.amount;
        c.machine = new Equipment({});
        c.machine.make = li.details.make;
        c.machine.model = li.details.model;
        c.machine.vin = li.details.serial;
        c.machine.operatingCost = li.details.operating;
        c.machine.ownershipCost = li.details.ownership;
        c.machine.description = li.details.description;
        c.machine.year = li.details.year;
        c.hours = Number(Number(li.details.hours).toFixed(2));
        c.status = li.status;
        c.transportationCost = li.details.transport;
        r.costs.equipmentCosts.enabled = true;
        r.costs.equipmentCosts.standbyCosts.costs.push(c);
      } else if (t === 'equipment.rental') {
        const c: RentalCost = new RentalCost();
        c.total = li.amount;
        c.transportationCost = li.details.transportation;
        c.machine = new Equipment({});
        c.machine.make = li.details.make;
        c.machine.model = li.details.model;
        c.machine.baseRental = li.details.base;
        c.machine.description = li.details.type;
        c.status = li.status;
        project.owner = 'has rental';
        r.costs.equipmentCosts.enabled = true;
        console.log(JSON.stringify(li, null, 2));
        r.costs.equipmentCosts.rentalCosts.enabled = true;
        r.costs.equipmentCosts.rentalCosts.costs.push(c);
      } else if (t === 'material') {
        const c: MaterialCost = new MaterialCost({});
        c.status = li.status;
        c.total = li.amount;
        c.costPerUnit = li.details.unitCost;
        c.description = li.details.description;
        c.unitQuantity = li.details.units;
        r.costs.materialCosts.enabled = true;
        r.costs.materialCosts.costs.push(c);
      } else if (t === 'subcontractor') {
        const c: Cost = new Cost();
        c.status = li.status;
        c.total = li.amount;
        c.description = li.details.description;
        c.subcontractor = new Contractor({});
        c.subcontractor.name = li.details.subcontractor;
        r.costs.subcontractorCosts.enabled = true;
        r.costs.subcontractorCosts.costs.push(c);
      }

      r.messages++;
      r.project = project;
      r.recalculateTotal();
      requestMap.set(li.requestId, r);
    }
    this.requests = Array.from(requestMap.values()).sort();
  }
}
