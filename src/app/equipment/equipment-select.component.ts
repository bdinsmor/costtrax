import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { Equipment, Item } from './../shared/model';
import { EquipmentService } from './equipment.service';

@Component({
  selector: 'app-equipment-select',
  templateUrl: './equipment-select.component.html',
  styleUrls: ['./equipment-select.component.scss']
})
export class EquipmentSelectComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  manufacturerId: string;
  @Input()
  manufacturerName: string;
  @Input()
  shouldDisable = false;
  @Input()
  type: string;
  @Input()
  index: string;

  @Input()
  initialValue: Item;

  @Input()
  initialEquipment: Equipment;

  selectedItem: Equipment;
  @Output()
  selected = new EventEmitter<any>();
  searchResults$: Observable<Equipment[]>;
  searchInput$ = new Subject<string>();
  loading = false;
  placeholder = '';

  constructor(
    private equipmentService: EquipmentService,
    private changeDetection: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.type === 'manufacturerName') {
      this.manufacturerSearch();
      this.placeholder = 'Select Manufacturer';
    } else {
      this.modelSearch();
      this.placeholder = 'Select Model';
    }

    if (this.initialValue) {
      this.selectedItem = new Equipment(this.initialValue.details);
    } else if (this.initialEquipment) {
      this.selectedItem = new Equipment(this.initialEquipment);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.firstChange) {
      if (
        changes.manufacturerId &&
        changes.manufacturerId.previousValue !==
          changes.manufacturerId.currentValue
      ) {
        this.selectedItem = null;
        this.searchInput$.next();
      }
    }
  }

  ngOnDestroy(): void {}

  selectionChanged() {
    if (!this.selectedItem) {
      this.selected.emit({
        type: this.type,
        index: this.index,
        item: null
      });
      return;
    }

    this.selected.emit({
      type: this.type,
      index: this.index,
      item: this.selectedItem
    });
    return;
  }

  manufacturerSearch() {
    this.searchResults$ = concat(
      of([]), // default items
      this.searchInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        switchMap((term: string) =>
          this.equipmentService.getMakes(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.loading = false))
          )
        ),
        untilDestroyed(this)
      )
    );
  }

  onFocus(event: any) {}

  modelSearch() {
    this.searchResults$ = concat(
      of([]), // default items
      this.searchInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        switchMap((term: string) =>
          this.equipmentService.getModels(term, this.manufacturerId).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.loading = false))
          )
        ),
        untilDestroyed(this)
      )
    );
  }

  modelChanged(item: Equipment) {}

  trackByFn(index: number, item: any) {
    return index; // or item.id
  }
}
