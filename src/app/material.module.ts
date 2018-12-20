/*
 * This module imports and re-exports all Angular Material modules for convenience,
 * so only 1 module import is needed in your feature modules.
 * See https://material.angular.io/guide/getting-started#step-3-import-the-component-modules.
 *
 * To optimize your production builds, you should only import the components used in your app.
 */
import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatCommonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTooltipModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  exports: [
    MatCardModule,
    MatStepperModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatCommonModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatChipsModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule {}
