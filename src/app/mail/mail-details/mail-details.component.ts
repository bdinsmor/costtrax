import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Mail } from '../mail.model';
import { MailService } from '../mail.service';

@Component({
  selector: 'app-mail-details',
  templateUrl: './mail-details.component.html',
  styleUrls: ['./mail-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailDetailsComponent implements OnChanges {
  labels$: Observable<any>;
  // tslint:disable-next-line:no-input-rename
  @Input('mail') mailInput: Mail;
  mail: Mail;
  showDetails = false;

  constructor(private mailService: MailService) {}

  ngOnChanges() {
    this.updateModel(this.mailInput);
    this.markAsRead();
  }

  markAsRead() {
    if (this.mail && !this.mail.read) {
      this.mail.markRead();
      this.updateMail();
    }
  }

  toggleStar(event: any) {
    event.stopPropagation();
    this.mail.toggleStar();
    this.updateMail();
  }

  toggleImportant(event: any) {
    event.stopPropagation();
    this.mail.toggleImportant();
    this.updateMail();
  }

  updateModel(data: any) {
    this.mail = !data ? null : new Mail({ ...data });
  }

  updateMail() {
    this.updateModel(this.mail);
  }
}
