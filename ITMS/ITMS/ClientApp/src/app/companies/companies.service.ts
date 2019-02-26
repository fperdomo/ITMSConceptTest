import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Company } from './company';
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

  //////// Save methods //////////

  /** POST: add a new company to the database */
  addCompany (company: Company): Observable<Company> {
    return this.http.post<Company>(this.companiesUrl, company, httpOptions)
      .pipe(
        catchError(this.handleError('addCompany', company))
      );
  }

  /** DELETE: delete the company from the server */
  deleteCompany (id: number): Observable<{}> {
    const url = `${this.companiesUrl}/${id}`; // DELETE api/companies/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteCompany'))
      );
  }

  /** PUT: update the company on the server. Returns the updated company upon success. */
  updateCompany (company: Company): Observable<Company> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Company>(this.companiesUrl, company, httpOptions)
      .pipe(
        catchError(this.handleError('updateCompany', company))
      );
  }
}
