import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  imports: [FlexLayoutModule, FormsModule, ReactiveFormsModule, MaterialModule, CommonModule],
  declarations: [LoaderComponent],
  exports: [FormsModule, ReactiveFormsModule, LoaderComponent]
})
export class SharedModule {}
