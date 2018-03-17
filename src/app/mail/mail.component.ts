import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { MailService } from './mail.service';
import { Mail } from './mail.model';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailComponent implements OnInit, OnDestroy {
  hasSelectedMails: boolean;
  isIndeterminate: boolean;
  searchInput: FormControl;
  folders$: Observable<any>;
  labels$: Observable<any>;
  currentMail$: Observable<Mail>;
  selectedMailIds$: Observable<string[]>;
  searchText$: Observable<string>;
  mails: Mail[];
  mails$: Observable<Mail[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  selectedMailIds: string[];
  selected: Mail;

  constructor(private mailService: MailService, private cd: ChangeDetectorRef) {
    this.searchInput = new FormControl('');
    this.mails$ = mailService.entities$;
    this.loading$ = mailService.loading$;
    this.count$ = mailService.count$;
    this.mails = [];
    this.selectedMailIds = [];
  }

  ngOnInit() {
    this.getMail();
    if (this.searchText$) {
      this.searchText$.subscribe(searchText => {
        this.searchInput.setValue(searchText);
      });
    }
    //
    // this.searchInput.valueChanges
    //  .debounceTime(300)
    //  .distinctUntilChanged()
    //  .subscribe(searchText => {
    //    this.store.dispatch(new fromStore.SetSearchText(searchText));
    //  });
  }

  getMail(): void {
    this.mailService.getAll();

    // console.log('number of messages: ' + JSON.stringify(this.messagesService.count$));
  }
  add(m: Mail) {
    this.mailService.add(m);
  }

  delete(m: Mail) {
    this.mailService.delete(m.id);
  }
  update(m: Mail) {
    this.mailService.update(m);
  }

  select(m: Mail) {
    this.selected = m;
  }

  unselect() {
    this.selected = null;
  }

  ngOnDestroy() {
    this.cd.detach();
  }

  toggleSelectAll(ev: any) {
    ev.preventDefault();

    if (this.selectedMailIds.length && this.selectedMailIds.length > 0) {
      this.deselectAllMails();
    } else {
      this.selectAllMails();
    }
  }

  selectAllMails() {}

  deselectAllMails() {}

  selectMailsByParameter(parameter: any, value: any) {}

  toggleLabelOnSelectedMails(labelId: any) {}

  setFolderOnSelectedMails(folderId: any) {}

  deSelectCurrentMail() {}

  refresh() {
    this.cd.markForCheck();
  }
}
