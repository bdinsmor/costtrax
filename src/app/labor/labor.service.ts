import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Employee } from '../shared/model';

@Injectable()
export class LaborService {
  constructor(private http: HttpClient) {}

  getEmployees(userId: string): Observable<any> {
    return this.http.get(environment.serverUrl + '/users/' + userId).pipe(
      map((res: any) => {
        const json = res as any;
        return new Employee(json);
      })
    );
  }

  saveRequestorEmployee(projectId: string, employee: any): Observable<any> {
    return this.http.post(
      environment.serverUrl + '/project/' + projectId + '/labor',
      employee
    );
  }

  duplicateRequestorEmployee(
    projectId: string,
    employeeId: string
  ): Observable<any> {
    return this.http.post(
      environment.serverUrl +
        '/project/' +
        projectId +
        '/labor/duplicate/employeeId' +
        employeeId,
      { employeeId: employeeId }
    );
  }

  updateRequestorEmployee(projectId: string, employee: any): Observable<any> {
    return this.http.put(
      environment.serverUrl + '/project/' + projectId + '/labor/' + employee.id,
      employee
    );
  }

  deleteRequestorEmployee(
    projectId: string,
    employeeId: string
  ): Observable<any> {
    return this.http.delete(
      environment.serverUrl + '/project/' + projectId + '/labor/' + employeeId
    );
  }

  getRequestorEmployees(projectId: string): Observable<Employee[]> {
    return this.http
      .get(environment.serverUrl + '/project/' + projectId + '/labor')
      .pipe(
        map((res: any) => {
          if (!res) {
            return [];
          }
          // console.log('employees: ' + JSON.stringify(res, null, 2));
          const r: Employee[] = [];
          for (const machine of res) {
            r.push(new Employee(machine));
          }
          return r;
        })
      );
  }
}
