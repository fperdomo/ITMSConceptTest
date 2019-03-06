import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UpdateTrx } from './updateTrx';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'pUAcVmniAnzc3EYLPEF3FFFCS77rLNQQ96hrLt6inovRNWtZJY5DoGi8E9nEGZQo'
  })
};

@Injectable()
export class UpdateTrxsService {
  updateTrxsUrl = 'http://104.196.27.3:3000/api/UpdateTrasferRequest';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('UpdateTrxsService');
  }
  

  /** POST: add a new updateTrx to the database */
  addUpdateTrx (updateTrx: UpdateTrx): Observable<UpdateTrx> {
    return this.http.post<UpdateTrx>(this.updateTrxsUrl, updateTrx, httpOptions)
      .pipe(
        catchError(this.handleError('addUpdateTrx', updateTrx))
      );
  }

  
}
