import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolePrint'
})
export class RolePipe implements PipeTransform {
  transform(value: string, args: any[] = []) {
    if (!value || value === '') {
      return;
    }
    if (value === 'RequestManage') {
      return 'Approver';
    } else if (value === 'RequestSubmit') {
      return 'Requestor';
    } else if (value === 'ProjectAdmin') {
      return 'Admin';
    } else if (value === 'ProjectObserve') {
      return 'Observer';
    } else if (value === 'AccountAdmin') {
      return 'Account Admin';
    }
    return value;
  }
}
