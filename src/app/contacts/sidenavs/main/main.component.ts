import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ContactsService } from '../../contacts.service';

@Component({
  selector: 'app-contacts-main-sidenav',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class ContactsMainSidenavComponent implements OnDestroy {
  user: any;
  filterBy: string;

  onUserDataChangedSubscription: Subscription;

  constructor(private contactsService: ContactsService) {}

  changeFilter(filter: any) {
    this.filterBy = filter;
    this.contactsService.onFilterChanged.next(this.filterBy);
  }

  ngOnDestroy() {
    this.onUserDataChangedSubscription.unsubscribe();
  }
}
