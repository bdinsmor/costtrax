import { Pipe, PipeTransform } from '@angular/core';

import { AppUtils } from '../../core/utils/utils';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(mainArr: any[], searchText: string, property: string): any {
    return AppUtils.filterArrayByString(mainArr, searchText);
  }
}
