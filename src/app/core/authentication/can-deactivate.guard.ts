import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfirmDialogComponent } from './../../shared/confirm-dialog.component';

export interface CanComponentDeactivate {
  confirm(): boolean;
}

@Injectable()
export class DeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(public dialog: MatDialog) {}
  canDeactivate(
    component: CanComponentDeactivate,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (!component.confirm()) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message:
            'You have unsaved changes! If you leave, your changes will be lost.',
          title: 'Unsaved Changes'
        }
      });
      return dialogRef.afterClosed().pipe(
        map((res: any) => {
          return res && res.success;
        })
      );
    } else {
      return of(true);
    }
  }
}
