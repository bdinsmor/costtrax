import { InMemoryDbService } from 'angular-in-memory-web-api';
declare var Chance: any; // for externals librairies

export interface Activity {
  action: string;
  requestNo: string;
  projectName: string;
  date: Date;
}
export interface Project {
  action: string;
  requestNo: string;
  projectName: string;
  date: Date;
}
export interface Request {
  action: string;
  requestNo: string;
  projectName: string;
  date: Date;
}
export interface Message {
  user: String;
  text: String;
  date: Date;
}

export class InMemoryDataService implements InMemoryDbService {
  chance: any;
  constructor() {
    this.chance = new Chance();
  }
  createDb() {
    const activities: Activity[] = [
      { action: 'has NOT approved', requestNo: '3234814', projectName: 'GA 400 Expansion Project', date: new Date() },
      { action: 'requested more info', requestNo: '323814', projectName: 'GA 400 Expansion Project', date: new Date() },
      { action: 'has approved', requestNo: '323814', projectName: 'GA 400 Expansion Project', date: new Date() }
    ];
    const projects: Project[] = [];
    const requests: Request[] = [];
    const messages: Message[] = this.createMessages();
    return { activities: activities, messages: messages };
  }

  createMessages(): Message[] {
    const msg: Message[] = [];
    for (let i = 0; i < this.chance.integer({ min: 1, max: 17 }); i++) {
      const m: Message = {
        user: this.chance.name(),
        date: new Date(this.chance.date({ year: 1983 })),
        text: this.chance.sentence()
      };
      msg.push(m);
    }
    return msg;
  }
}
