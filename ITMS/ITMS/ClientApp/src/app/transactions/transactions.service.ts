import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Transaction } from './transaction';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'ycXeDj6508TmOaTZbuElwtVhFFOGGTdXCHGkwyOIFnVLEZcOzP44pMI02EiRSBxj'
  })
};

@Injectable()
export class TransactionsService {
  transactionsUrl = 'http://104.196.27.3:3000/api/TransferRequest';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('TransactionsService');
  }

  /** GET transactions from the server */
  getTransactions(): Observable<Transaction[]> {
     
    return this.http.get<Transaction[]>(this.transactionsUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getTransactions', []))
      );
  }

  /* GET transactions whose name contains search term */
  searchTransactions(term: string): Observable<Transaction[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
     { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Transaction[]>(this.transactionsUrl, options)
      .pipe(
        catchError(this.handleError<Transaction[]>('searchTransactions', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new transaction to the database */
  addTransaction (transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.transactionsUrl, transaction, httpOptions)
      .pipe(
        catchError(this.handleError('addTransaction', transaction))
      );
  }

  /** DELETE: delete the transaction from the server */
  deleteTransaction (id: number): Observable<{}> {
    const url = `${this.transactionsUrl}/${id}`; // DELETE api/transactions/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteTransaction'))
      );
  }

  /** PUT: update the transaction on the server. Returns the updated transaction upon success. */
  updateTransaction (transaction: Transaction): Observable<Transaction> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Transaction>(this.transactionsUrl, transaction, httpOptions)
      .pipe(
        catchError(this.handleError('updateTransaction', transaction))
      );
  }
}
