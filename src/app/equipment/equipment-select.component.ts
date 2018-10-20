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
  makeId: string;
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
    if (this.type === 'make') {
      this.makeSearch();
      this.placeholder = 'Select Make';
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
      if (changes.makeId && !changes.makeId.currentValue) {
        this.selectedItem = null;
        this.searchInput$.next();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.searchInput$) {
      this.searchInput$.unsubscribe();
    }
  }

  selectionChanged() {
    if (!this.selectedItem) {
      this.selected.emit({
        type: this.type,
        index: this.index,
        item: null
      });
      return;
    }
    if (this.type === 'make') {
      this.selected.emit({
        type: this.type,
        index: this.index,
        item: this.selectedItem
      });
      return;
    } else {
      this.equipmentService
        .getRateData('', [this.selectedItem] as Equipment[])
        .then((response: any) => {
          const assets = response.value as Equipment[];
          if (assets && assets.length === 1) {
            const choice = assets[0];
            this.selectedItem.baseRental = choice.baseRental;
            this.selectedItem.fhwa = choice.fhwa;
            this.selectedItem.type = choice.type;

            this.selected.emit({
              type: this.type,
              index: this.index,
              item: this.selectedItem
            });
          } else {
            this.selected.emit({
              type: this.type,
              index: this.index,
              item: this.selectedItem
            });
          }
        })
        .catch(error => {
          this.selected.emit({
            type: this.type,
            index: this.index,
            item: this.selectedItem
          });
        });
    }
  }

  makeSearch() {
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
        )
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
          this.equipmentService.getModels(term, this.makeId).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.loading = false))
          )
        )
      )
    );
  }

  modelChanged(item: Equipment) {}

  trackByFn(index: number, item: any) {
    return index; // or item.id
  }
}
