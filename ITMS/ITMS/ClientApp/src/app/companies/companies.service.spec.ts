import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Other imports
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Company } from './company';
import { CompaniesService } from './companies.service';
import { HttpErrorHandler } from '../http-error-handler.service';
import { MessageService } from '../message.service';

describe('CompaniesService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let companyService: CompaniesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [ HttpClientTestingModule ],
      // Provide the service-under-test and its dependencies
      providers: [
        CompaniesService,
        HttpErrorHandler,
        MessageService
      ]
    });

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    companyService = TestBed.get(CompaniesService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  /// CompanyService method tests begin ///

  describe('#getCompanies', () => {
    let expectedCompanies: Company[];

    beforeEach(() => {
      companyService = TestBed.get(CompaniesService);
      expectedCompanies = [
        { companyId: 1, companyName: 'A' },
        { companyId: 2, companyName: 'B' },
       ] as Company[];
    });

    it('should return expected companies (called once)', () => {

      companyService.getCompanies().subscribe(
        companies => expect(companies).toEqual(expectedCompanies, 'should return expected companies'),
        fail
      );

      // CompanyService should have made one request to GET companies from expected URL
      const req = httpTestingController.expectOne(companyService.companiesUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock companies
      req.flush(expectedCompanies);
    });

    it('should be OK returning no companies', () => {

      companyService.getCompanies().subscribe(
        companies => expect(companies.length).toEqual(0, 'should have empty companies array'),
        fail
      );

      const req = httpTestingController.expectOne(companyService.companiesUrl);
      req.flush([]); // Respond with no companies
    });

    // This service reports the error but finds a way to let the app keep going.
    it('should turn 404 into an empty companies result', () => {

      companyService.getCompanies().subscribe(
        companies => expect(companies.length).toEqual(0, 'should return empty companies array'),
        fail
      );

      const req = httpTestingController.expectOne(companyService.companiesUrl);

      // respond with a 404 and the error message in the body
      const msg = 'deliberate 404 error';
      req.flush(msg, {status: 404, statusText: 'Not Found'});
    });

    it('should return expected companies (called multiple times)', () => {

      companyService.getCompanies().subscribe();
      companyService.getCompanies().subscribe();
      companyService.getCompanies().subscribe(
        companies => expect(companies).toEqual(expectedCompanies, 'should return expected companies'),
        fail
      );

      const requests = httpTestingController.match(companyService.companiesUrl);
      expect(requests.length).toEqual(3, 'calls to getCompanies()');

      // Respond to each request with different mock company results
      requests[0].flush([]);
      requests[1].flush([{id: 1, name: 'bob'}]);
      requests[2].flush(expectedCompanies);
    });
  });

  describe('#updateCompany', () => {
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${companyService.companiesUrl}/?id=${id}`;

    it('should update a company and return it', () => {

      const updateCompany: Company = { companyId: 1, companyName: 'A', fundBalance: 0, workingCurrency: 'USD' };

      companyService.updateCompany(updateCompany).subscribe(
        data => expect(data).toEqual(updateCompany, 'should return the company'),
        fail
      );

      // CompanyService should have made one request to PUT company
      const req = httpTestingController.expectOne(companyService.companiesUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updateCompany);

      // Expect server to return the company after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: updateCompany });
      req.event(expectedResponse);
    });

    // This service reports the error but finds a way to let the app keep going.
    it('should turn 404 error into return of the update company', () => {
      const updateCompany: Company = { companyId: 1, companyName: 'A', fundBalance: 0, workingCurrency: 'USD' };

      companyService.updateCompany(updateCompany).subscribe(
        data => expect(data).toEqual(updateCompany, 'should return the update company'),
        fail
      );

      const req = httpTestingController.expectOne(companyService.companiesUrl);

      // respond with a 404 and the error message in the body
      const msg = 'deliberate 404 error';
      req.flush(msg, {status: 404, statusText: 'Not Found'});
    });
  });

  // TODO: test other CompanyService methods
});
