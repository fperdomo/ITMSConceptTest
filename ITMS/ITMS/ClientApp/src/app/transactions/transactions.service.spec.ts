import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Other imports
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Transaction } from './transaction';
import { TransactionsService } from './transactions.service';
import { HttpErrorHandler } from '../http-error-handler.service';
import { MessageService } from '../message.service';

describe('TransactionsService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let transactionService: TransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [ HttpClientTestingModule ],
      // Provide the service-under-test and its dependencies
      providers: [
        TransactionsService,
        HttpErrorHandler,
        MessageService
      ]
    });

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    transactionService = TestBed.get(TransactionsService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  /// TransactionService method tests begin ///

  describe('#getTransactions', () => {
    let expectedTransactions: Transaction[];

    beforeEach(() => {
      transactionService = TestBed.get(TransactionsService);
      expectedTransactions = [
        { transactionId: 1, transactionName: 'A' },
        { transactionId: 2, transactionName: 'B' },
       ] as Transaction[];
    });

    it('should return expected transactions (called once)', () => {

      transactionService.getTransactions().subscribe(
        transactions => expect(transactions).toEqual(expectedTransactions, 'should return expected transactions'),
        fail
      );

      // TransactionService should have made one request to GET transactions from expected URL
      const req = httpTestingController.expectOne(transactionService.transactionsUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock transactions
      req.flush(expectedTransactions);
    });

    it('should be OK returning no transactions', () => {

      transactionService.getTransactions().subscribe(
        transactions => expect(transactions.length).toEqual(0, 'should have empty transactions array'),
        fail
      );

      const req = httpTestingController.expectOne(transactionService.transactionsUrl);
      req.flush([]); // Respond with no transactions
    });

    // This service reports the error but finds a way to let the app keep going.
    it('should turn 404 into an empty transactions result', () => {

      transactionService.getTransactions().subscribe(
        transactions => expect(transactions.length).toEqual(0, 'should return empty transactions array'),
        fail
      );

      const req = httpTestingController.expectOne(transactionService.transactionsUrl);

      // respond with a 404 and the error message in the body
      const msg = 'deliberate 404 error';
      req.flush(msg, {status: 404, statusText: 'Not Found'});
    });

    it('should return expected transactions (called multiple times)', () => {

      transactionService.getTransactions().subscribe();
      transactionService.getTransactions().subscribe();
      transactionService.getTransactions().subscribe(
        transactions => expect(transactions).toEqual(expectedTransactions, 'should return expected transactions'),
        fail
      );

      const requests = httpTestingController.match(transactionService.transactionsUrl);
      expect(requests.length).toEqual(3, 'calls to getTransactions()');

      // Respond to each request with different mock transaction results
      requests[0].flush([]);
      requests[1].flush([{id: 1, name: 'bob'}]);
      requests[2].flush(expectedTransactions);
    });
  });

  describe('#updateTransaction', () => {
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${transactionService.transactionsUrl}/?id=${id}`;

    it('should update a transaction and return it', () => {

      const updateTransaction: Transaction = { transactionId: 1, transactionName: 'A', fundBalance: 0, workingCurrency: 'USD' };

      transactionService.updateTransaction(updateTransaction).subscribe(
        data => expect(data).toEqual(updateTransaction, 'should return the transaction'),
        fail
      );

      // TransactionService should have made one request to PUT transaction
      const req = httpTestingController.expectOne(transactionService.transactionsUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updateTransaction);

      // Expect server to return the transaction after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: updateTransaction });
      req.event(expectedResponse);
    });

    // This service reports the error but finds a way to let the app keep going.
    it('should turn 404 error into return of the update transaction', () => {
      const updateTransaction: Transaction = { transactionId: 1, transactionName: 'A', fundBalance: 0, workingCurrency: 'USD' };

      transactionService.updateTransaction(updateTransaction).subscribe(
        data => expect(data).toEqual(updateTransaction, 'should return the update transaction'),
        fail
      );

      const req = httpTestingController.expectOne(transactionService.transactionsUrl);

      // respond with a 404 and the error message in the body
      const msg = 'deliberate 404 error';
      req.flush(msg, {status: 404, statusText: 'Not Found'});
    });
  });

  // TODO: test other TransactionService methods
});
