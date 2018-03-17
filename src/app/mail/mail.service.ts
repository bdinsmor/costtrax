import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { Mail } from '@app/mail/mail.model';

@Injectable()
export class MailService extends EntityServiceBase<Mail> {
  foldersArr: any;
  filtersArr: any;
  labelsArr: any;
  selectedMails: Mail[];
  mails: Mail[];
  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Mail', entityServiceFactory);
    this.selectedMails = [];
  }
}
