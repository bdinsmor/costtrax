import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { MailService } from '../../mail.service';
import { Mail } from '../../mail.model';

@Component({
  selector: 'app-mail-list-item',
  templateUrl: './mail-list-item.component.html',
  styleUrls: ['./mail-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailListItemComponent implements OnInit {
  @Input() mail: Mail;
  @HostBinding('class.selected') selected: boolean;
  @HostBinding('class.unread') unread: boolean;
  labels$: Observable<any>;
  selectedMailIds$: Observable<any>;

  constructor(private mailService: MailService, private cd: ChangeDetectorRef) {
    this.selected = false;
  }

  ngOnInit() {
    // Set the initial values
    this.mail = new Mail(this.mail);
    this.unread = !this.mail.read;

    this.selectedMailIds$.subscribe(selectedMailIds => {
      this.selected =
        selectedMailIds.length > 0 && selectedMailIds.find((id: any) => id === this.mail.id) !== undefined;
      this.refresh();
    });
  }

  refresh() {
    this.cd.markForCheck();
  }

  onSelectedChange() {}
}
