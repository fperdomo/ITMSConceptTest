import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Company, PrepareSettlement } from './company';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'pUAcVmniAnzc3EYLPEF3FFFCS77rLNQQ96hrLt6inovRNWtZJY5DoGi8E9nEGZQo'
  })
};

@Injectable()
export class CompaniesService {
  companiesUrl = 'http://104.196.27.3:3000/api/Company';  // URL to web api
  prepareSettUrl = 'http://104.196.27.3:3000/api/PrepareSettlement';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('CompaniesService');
  }

  /** GET companies from the server */
  getCompanies(): Observable<Company[]> {
     
    return this.http.get<Company[]>(this.companiesUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getCompanies', []))
      );
  }

  /* GET companies whose name contains search term */
  searchCompanies(term: string): Observable<Company[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
     { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Company[]>(this.companiesUrl, options)
      .pipe(
        catchError(this.handleError<Company[]>('searchCompanies', []))
      );
  }

  /** POST: PrepareSettlement  */
  actionPrepareSettlement(prepareSettlement: PrepareSettlement): Observable<PrepareSettlement> {
    return this.http.post<PrepareSettlement>(this.prepareSettUrl, prepareSettlement, httpOptions)
      .pipe(
      catchError(this.handleError('actionPrepareSettlement', prepareSettlement))
      );
  }
}
