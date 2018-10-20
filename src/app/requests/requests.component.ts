import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconRegistry, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../core';
import { appAnimations } from '../core/animations';
import { OneUpComparator, Request } from '../shared/model';
import { RequestsService } from './requests.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  animations: appAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsComponent implements OnInit {
  private config: MatSnackBarConfig;
  duration = 3000;
  _duplicateModal = false;
  _duplicateWorking = false;
  _confirmDeleteModal = false;
  duplicatedRequestId: string;
  duplicateSuccess = false;
  selectedItem: Request;
  selectedIndex = -1;
  onUpComparator = new OneUpComparator();
  cloneTitle = 'Duplicating Request...';
  duplicateError = false;
  @Input()
  projectId: string;
  @Input()
  items: Request[];
  @Input()
  submitRequests: boolean;
  @Output()
  duplicated = new EventEmitter<any>();
  @Output()
  changed = new EventEmitter<any>();

  constructor(
    public snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private auth: AuthenticationService,
    private requestsService: RequestsService
  ) {
    this.matIconRegistry.addSvgIcon(
      'duplicate',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../assets/icons/content-duplicate-18.svg'
      )
    );
  }

  ngOnInit() {
    this.duplicatedRequestId = null;
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  trackByFn(index: number, item: any) {
    return index; // or item.id
  }

  clone(request: Request) {
    this.duplicateError = false;
    this.duplicateSuccess = false;
    this.cloneTitle = 'Duplicating Request...';
    this._duplicateWorking = true;
    this.requestsService.clone(request).subscribe(
      (response: any) => {
        if (response) {
          this._duplicateWorking = false;
          this._duplicateModal = true;

          this.cloneTitle = 'Request Duplicated!';
          this.duplicatedRequestId = response.id;
          this.duplicateSuccess = true;
          this.changeDetector.detectChanges();
        }
      },
      error => {
        this.duplicateSuccess = false;
        this.duplicateError = true;
        this._duplicateModal = false;
        this.changeDetector.detectChanges();
      }
    );
  }

  delete(request: Request) {
    this.requestsService
      .deleteRequest(request.id)
      .subscribe((response: any) => {
        if (response) {
          this._duplicateModal = true;
          this.duplicatedRequestId = response.id;
        }
      });
  }

  cancelDelete() {
    this.selectedItem = null;
    this._confirmDeleteModal = false;
  }

  confirmDelete() {
    this._confirmDeleteModal = false;
    this.requestsService
      .deleteRequest(this.selectedItem.id)
      .subscribe((response: any) => {
        this.openSnackBar('Request Deleted!', 'ok', 'OK');

        this.changed.emit();
      });

    this._confirmDeleteModal = false;
    this.changeDetector.detectChanges();
  }

  removeRequest(index: number, item: Request) {
    this.selectedItem = item;
    this.selectedIndex = index;
    this._confirmDeleteModal = true;
    // call delete and splice list
  }

  stay() {
    this.duplicateError = false;
    this.duplicatedRequestId = null;
    this._duplicateModal = false;
    this.router.navigate(['../projects', this.projectId]);
  }

  viewDuplicatedRequest() {
    this.duplicateError = false;
    if (this.duplicatedRequestId) {
      this.router.navigate(['./requests', this.duplicatedRequestId]);
    }
  }

  viewRequest(request: Request) {
    this.router.navigate(['./requests', request.id]);
  }
}
