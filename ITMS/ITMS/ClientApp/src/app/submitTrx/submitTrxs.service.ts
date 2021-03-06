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
  

  /** POST: add a new submitTrx to the database */
  addSubmitTrx (submitTrx: SubmitTrx): Observable<SubmitTrx> {
    return this.http.post<SubmitTrx>(this.submitTrxsUrl, submitTrx, httpOptions)
      .pipe(
        catchError(this.handleError('addSubmitTrx', submitTrx))
      );
  }

  
}
