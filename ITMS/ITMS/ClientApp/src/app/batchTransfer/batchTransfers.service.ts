import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BatchTransfer } from './batchTransfer';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'pUAcVmniAnzc3EYLPEF3FFFCS77rLNQQ96hrLt6inovRNWtZJY5DoGi8E9nEGZQo'
  })
};

@Injectable()
export class BatchTransfersService {
  batchTransfersUrl = 'http://104.196.27.3:3000/api/BatchTransferRequest';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('BatchTransfersService');
  }

  /** GET batchTransfers from the server */
  getBatchTransfers(): Observable<BatchTransfer[]> {
     
    return this.http.get<BatchTransfer[]>(this.batchTransfersUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getBatchTransfers', []))
      );
  }

  /* GET batchTransfers whose name contains search term */
  searchBatchTransfers(term: string): Observable<BatchTransfer[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
     { params: new HttpParams().set('name', term) } : {};

    return this.http.get<BatchTransfer[]>(this.batchTransfersUrl, options)
      .pipe(
        catchError(this.handleError<BatchTransfer[]>('searchBatchTransfers', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new batchTransfer to the database */
  addBatchTransfer (batchTransfer: BatchTransfer): Observable<BatchTransfer> {
    return this.http.post<BatchTransfer>(this.batchTransfersUrl, batchTransfer, httpOptions)
      .pipe(
        catchError(this.handleError('addBatchTransfer', batchTransfer))
      );
  }

  /** DELETE: delete the batchTransfer from the server */
  deleteBatchTransfer (id: number): Observable<{}> {
    const url = `${this.batchTransfersUrl}/${id}`; // DELETE api/batchTransfers/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteBatchTransfer'))
      );
  }

  /** PUT: update the batchTransfer on the server. Returns the updated batchTransfer upon success. */
  updateBatchTransfer (batchTransfer: BatchTransfer): Observable<BatchTransfer> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<BatchTransfer>(this.batchTransfersUrl, batchTransfer, httpOptions)
      .pipe(
        catchError(this.handleError('updateBatchTransfer', batchTransfer))
      );
  }
}
