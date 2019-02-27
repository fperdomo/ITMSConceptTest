import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SubmitTrx } from './submitTrx';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'pUAcVmniAnzc3EYLPEF3FFFCS77rLNQQ96hrLt6inovRNWtZJY5DoGi8E9nEGZQo'
  })
};

@Injectable()
export class SubmitTrxsService {
  submitTrxsUrl = 'http://104.196.27.3:3000/api/SubmitTransferRequest';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('SubmitTrxsService');
  }

  /** GET submitTrxs from the server */
  getSubmitTrxs(): Observable<SubmitTrx[]> {
     
    return this.http.get<SubmitTrx[]>(this.submitTrxsUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getSubmitTrxs', []))
      );
  }

  /* GET submitTrxs whose name contains search term */
  searchSubmitTrxs(term: string): Observable<SubmitTrx[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
     { params: new HttpParams().set('name', term) } : {};

    return this.http.get<SubmitTrx[]>(this.submitTrxsUrl, options)
      .pipe(
        catchError(this.handleError<SubmitTrx[]>('searchSubmitTrxs', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new submitTrx to the database */
  addSubmitTrx (submitTrx: SubmitTrx): Observable<SubmitTrx> {
    return this.http.post<SubmitTrx>(this.submitTrxsUrl, submitTrx, httpOptions)
      .pipe(
        catchError(this.handleError('addSubmitTrx', submitTrx))
      );
  }

  /** DELETE: delete the submitTrx from the server */
  deleteSubmitTrx (id: number): Observable<{}> {
    const url = `${this.submitTrxsUrl}/${id}`; // DELETE api/submitTrxs/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteSubmitTrx'))
      );
  }

  /** PUT: update the submitTrx on the server. Returns the updated submitTrx upon success. */
  updateSubmitTrx (submitTrx: SubmitTrx): Observable<SubmitTrx> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<SubmitTrx>(this.submitTrxsUrl, submitTrx, httpOptions)
      .pipe(
        catchError(this.handleError('updateSubmitTrx', submitTrx))
      );
  }
}
