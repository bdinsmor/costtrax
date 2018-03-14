import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, catchError, tap } from 'rxjs/operators';
import { Message, Activity } from '@app/core/in-memory-data.service';

@Injectable()
export class MessagesService {
  private messagesUrl = 'api/messages'; // URL to web api
  private activitiesUrl = 'api/activities'; // URL to web api

  constructor(private httpClient: HttpClient) {}

  getMessages(): Observable<Message[]> {
    return this.httpClient
      .get<Message[]>(this.messagesUrl)
      .pipe(tap(messages => this.log(`fetched messages`)), catchError(this.handleError('getMessages', [])));
  }

  getActivities(): Observable<Activity[]> {
    return this.httpClient
      .get<Activity[]>(this.activitiesUrl)
      .pipe(tap(activities => this.log(`fetched activities`)), catchError(this.handleError('getActivities', [])));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  // tslint:disable-next-line:typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {}
}
