import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BatchTransfer, TransferFunds, CompleteSettlement } from './batchTransfer';
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
  transferFundsUrl = 'http://104.196.27.3:3000/api/TransferFunds';
  completeSettlementUrl = 'http://104.196.27.3:3000/api/CompleteSettlement';
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

  /** POST: PrepareSettlement  */
  actionTransferFunds(transferFunds: TransferFunds): Observable<TransferFunds> {
    return this.http.post<TransferFunds>(this.transferFundsUrl, transferFunds, httpOptions)
      .pipe(
      catchError(this.handleError('actionTransferFunds', transferFunds))
      );
  }


  /** POST: PrepareSettlement  */
  actionCompleteSettlement(completeSettlement: CompleteSettlement): Observable<CompleteSettlement> {
    return this.http.post<CompleteSettlement>(this.completeSettlementUrl, completeSettlement, httpOptions)
      .pipe(
      catchError(this.handleError('actionCompleteSettlement', completeSettlement))
      );
  }
}
