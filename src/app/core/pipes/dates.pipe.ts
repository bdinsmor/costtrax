import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dates' })
export class DatesPipe implements PipeTransform {
  transform(values: string[], args: string = null): any {
    let dateDisplay = '';
    let dateFormat = 'MM/dd/yyyy';
    if (!values && values.length < 2) {
      return values;
    }
    if (args && args !== '') {
      dateFormat = args;
    }
    const startDate = values[0];
    const endDate = values[1];
    dateDisplay = new DatePipe('en-US').transform(startDate, dateFormat);
    dateDisplay += ' - ';
    dateDisplay += new DatePipe('en-US').transform(endDate, dateFormat);

    return dateDisplay;
  }
}
