import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Contact } from '@app/contacts/contact.model';
import { Mail } from '@app/mail/mail.model';
declare var Chance: any; // for externals librairies

export interface Activity {
  action: string;
  requestNo: string;
  projectName: string;
  date: Date;
}
export interface Project {
  id: String;
  action: string;
  requestNo: string;
  projectName: string;
  date: Date;
}
export interface Request {
  id: String;
  action: string;
  requestNo: string;
  projectName: string;
  date: Date;
}
export interface Message {
  id: number;
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
    const contacts: Contact[] = this.createContacts();
    const mails: Mail[] = this.createMails();
    return { activities: activities, contacts: contacts, mails: mails };
  }

  createMails(): Mail[] {
    const list: Mail[] = [];

    return list;
  }

  createContacts(): Contact[] {
    const list: Contact[] = [];
    for (let i = 0; i < 25; i++) {
      let id: String = '';
      if (i === 0) {
        id = '5725a6802d10e277a0f35724';
      } else {
        id = this.chance.guid();
      }

      // name: string;
      // lastName: string;
      // avatar: string;
      // nickname: string;
      // company: string;
      // jobTitle: string;
      // email: string;
      // phone: string;
      // address: string;
      // birthday: string;
      // notes: string;
      const c: Contact = new Contact({
        id: id,
        name: this.chance.first(),
        lastName: this.chance.last(),
        birthday: this.chance.birthday(),
        phone: this.chance.phone(),
        nickname: this.chance.last(),
        address: this.chance.address(),
        notes: this.chance.paragraph(),
        company: this.chance.company(),
        jobTitle: this.chance.profession()
      });
      list.push(c);
    }
    return list;
  }

  createMessages(): Message[] {
    const msg: Message[] = [];
    for (let i = 0; i < 5; i++) {
      const m: Message = {
        id: this.chance.integer({ min: 156, max: 1523453 }),
        user: this.chance.name(),
        date: new Date(this.chance.date({ year: 1983 })),
        text: this.chance.sentence()
      };
      msg.push(m);
    }
    console.log('messages: ' + msg.length);
    return msg;
  }
}
