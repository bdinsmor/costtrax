import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { LIST_FADE_ANIMATION } from '../../core/utils/list.animation';

@Component({
  selector: 'app-toolbar-notifications',
  templateUrl: './toolbar-notifications.component.html',
  styleUrls: ['./toolbar-notifications.component.scss'],
  animations: [...LIST_FADE_ANIMATION]
})
export class ToolbarNotificationsComponent implements OnInit {
  isOpen: boolean;
  notifications: any[];
  demoTriggers = 0;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.notifications = [
      {
        icon: 'mail',
        name: 'Project Added',
        time: 'few sec ago',
        read: false,
        colorClass: ''
      },
      {
        icon: 'notifications',
        name: 'New Contractor Added',
        time: '23 min ago',
        read: false,
        colorClass: 'primary'
      },
      {
        icon: 'inbox',
        name: 'Line Items Submitted',
        time: 'an hour ago',
        read: false,
        colorClass: 'accent'
      },
      {
        icon: 'cached',
        name: 'New user registered',
        time: '6 hours ago',
        read: true,
        colorClass: ''
      }
    ];
  }

  markAsRead(notification: any) {
    notification.read = true;
  }

  dismiss(notification: any) {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
    this.triggerDemoNotification();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.triggerDemoNotification();
  }

  onClickOutside() {
    this.isOpen = false;
  }

  triggerDemoNotification() {
    if (this.demoTriggers === 0) {
      this.demoTriggers++;

      setTimeout(() => {
        this.notifications.unshift({
          icon: 'cached',
          name: 'New Project Submitted',
          time: moment().fromNow(),
          read: false,
          colorClass: ''
        });

        this.cd.markForCheck();
      }, 2000);
    } else if (this.demoTriggers === 1) {
      this.demoTriggers++;

      setTimeout(() => {
        this.notifications.unshift({
          icon: 'notifications',
          name: 'User submitted new line items',
          time: '23 min ago',
          read: false,
          colorClass: 'primary'
        });

        this.cd.markForCheck();
      }, 2000);
    }
  }
}
