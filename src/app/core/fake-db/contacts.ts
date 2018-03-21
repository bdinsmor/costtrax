import { Contact } from '@app/contacts/contact.model';

declare var Chance: any; // for externals librairies

export class ContactsFakeDb {
  chance: any;
  public contacts: Array<Contact>;
  constructor() {
    this.chance = new Chance();
    this.createContacts();
  }

  createContacts(): void {
    this.contacts = [];
    try {
      for (let i = 0; i < 25; i++) {
        const c: Contact = new Contact({
          id: this.chance.guid(),
          avatar: this.chance.avatar(),
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
        this.contacts.push(c);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }
}
