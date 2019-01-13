import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatIconRegistry, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridSortOrder } from '@clr/angular';

import { AuthenticationService } from '../core';
import { appAnimations } from '../core/animations';
import { OneUpComparator, Request } from '../shared/model';
import { RequestCloneDialogComponent } from './dialogs/request-clone-dialog.component';
import { RequestDeleteDialogComponent } from './dialogs/request-delete-dialog.component';
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
  descSort = ClrDatagridSortOrder.DESC;
  ascSort = ClrDatagridSortOrder.ASC;
  selectedItem: Request;
  selectedIndex = -1;
  envUrl: string;
  loading = false;
  onUpComparator = new OneUpComparator();
  selectedRequests = [];
  @Input() projectId: string;
  @Input() items: Request[];
  @Input() status: string;
  @Input() submitRequests: boolean;
  @Output() duplicated = new EventEmitter<any>();
  @Output() changed = new EventEmitter<any>();

  constructor(
    public dialog: MatDialog,
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
    this.loading = false;
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  trackByFn(index: number, item: any) {
    return index; // or item.id
  }

  export() {
    const selectedIds = this.selectedRequests.map(request => {
      return request.id;
    });
  }

  clone(request: Request) {
    this.requestsService.clone(request).subscribe(
      (response: any) => {
        if (response) {
          const dialogRef = this.dialog.open(RequestCloneDialogComponent, {});
          dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
              this.router.navigate(['./requests', response.id]);
            } else {
              this.router.routeReuseStrategy.shouldReuseRoute = function() {
                return false;
              };
              this.router.navigate(['../projects', this.projectId]);
            }
          });
        }
      },
      error => {
        this.changeDetector.detectChanges();
      }
    );
  }

  removeRequest(request: Request) {
    const dialogRef = this.dialog.open(RequestDeleteDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.requestsService
          .deleteRequest(request.id)
          .subscribe((response: any) => {
            this.openSnackBar('Request Deleted!', 'ok', 'OK');
            this.changed.emit();
            this.changeDetector.detectChanges();
          });
      }
    });
    this.changeDetector.detectChanges();
  }

  viewRequest(request: Request) {
    this.router.navigate(['./requests', request.id]);
  }
}
