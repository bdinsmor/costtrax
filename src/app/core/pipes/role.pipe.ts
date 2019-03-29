import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolePrint'
})
export class RolePipe implements PipeTransform {
  transform(value: string, args: any[] = []) {
    if (!value || value === '') {
      return;
    }
    if (value === 'ProjectApprover') {
      return 'Approver';
    } else if (value === 'ProjectRequestor') {
      return 'Requestor';
    } else if (value === 'ProjectObserver') {
      return 'Observer';
    } else if (value === 'AccountAdmin') {
      return 'Account Admin';
    } else if (value === 'ProjectManager') {
      return 'Manager';
    } else if (value === 'AccountManager') {
      return 'Project Admin';
    }
    return value;
  }
}
