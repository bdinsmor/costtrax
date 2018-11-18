import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'dates' })
export class DatesPipe implements PipeTransform {
  transform(values: string[], args: string): any {
    let dateDisplay = '';
    let dateFormat = 'MM-dd-yyyy';
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
