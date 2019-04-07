//import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

//// Other imports
//import { TestBed } from '@angular/core/testing';
//import { HttpClient, HttpResponse } from '@angular/common/http';

//import { SubmitTrx } from './submitTrx';
//import { SubmitTrxsService } from './submitTrxs.service';
//import { HttpErrorHandler } from '../http-error-handler.service';
//import { MessageService } from '../message.service';

//describe('SubmitTrxsService', () => {
//  let httpClient: HttpClient;
//  let httpTestingController: HttpTestingController;
//  let submitTrxService: SubmitTrxsService;

//  beforeEach(() => {
//    TestBed.configureTestingModule({
//      // Import the HttpClient mocking services
//      imports: [ HttpClientTestingModule ],
//      // Provide the service-under-test and its dependencies
//      providers: [
//        SubmitTrxsService,
//        HttpErrorHandler,
//        MessageService
//      ]
//    });

//    // Inject the http, test controller, and service-under-test
//    // as they will be referenced by each test.
//    httpClient = TestBed.get(HttpClient);
//    httpTestingController = TestBed.get(HttpTestingController);
//    submitTrxService = TestBed.get(SubmitTrxsService);
//  });

//  afterEach(() => {
//    // After every test, assert that there are no more pending requests.
//    httpTestingController.verify();
//  });

//  /// SubmitTrxService method tests begin ///

//  describe('#getSubmitTrxs', () => {
//    let expectedSubmitTrxs: SubmitTrx[];

//    beforeEach(() => {
//      submitTrxService = TestBed.get(SubmitTrxsService);
//      expectedSubmitTrxs = [
//        { submitTrxId: 1, submitTrxName: 'A' },
//        { submitTrxId: 2, submitTrxName: 'B' },
//       ] as SubmitTrx[];
//    });

//    it('should return expected submitTrxs (called once)', () => {

//      submitTrxService.getSubmitTrxs().subscribe(
//        submitTrxs => expect(submitTrxs).toEqual(expectedSubmitTrxs, 'should return expected submitTrxs'),
//        fail
//      );

//      // SubmitTrxService should have made one request to GET submitTrxs from expected URL
//      const req = httpTestingController.expectOne(submitTrxService.submitTrxsUrl);
//      expect(req.request.method).toEqual('GET');

//      // Respond with the mock submitTrxs
//      req.flush(expectedSubmitTrxs);
//    });

//    it('should be OK returning no submitTrxs', () => {

//      submitTrxService.getSubmitTrxs().subscribe(
//        submitTrxs => expect(submitTrxs.length).toEqual(0, 'should have empty submitTrxs array'),
//        fail
//      );

//      const req = httpTestingController.expectOne(submitTrxService.submitTrxsUrl);
//      req.flush([]); // Respond with no submitTrxs
//    });

//    // This service reports the error but finds a way to let the app keep going.
//    it('should turn 404 into an empty submitTrxs result', () => {

//      submitTrxService.getSubmitTrxs().subscribe(
//        submitTrxs => expect(submitTrxs.length).toEqual(0, 'should return empty submitTrxs array'),
//        fail
//      );

//      const req = httpTestingController.expectOne(submitTrxService.submitTrxsUrl);

//      // respond with a 404 and the error message in the body
//      const msg = 'deliberate 404 error';
//      req.flush(msg, {status: 404, statusText: 'Not Found'});
//    });

//    it('should return expected submitTrxs (called multiple times)', () => {

//      submitTrxService.getSubmitTrxs().subscribe();
//      submitTrxService.getSubmitTrxs().subscribe();
//      submitTrxService.getSubmitTrxs().subscribe(
//        submitTrxs => expect(submitTrxs).toEqual(expectedSubmitTrxs, 'should return expected submitTrxs'),
//        fail
//      );

//      const requests = httpTestingController.match(submitTrxService.submitTrxsUrl);
//      expect(requests.length).toEqual(3, 'calls to getSubmitTrxs()');

//      // Respond to each request with different mock submitTrx results
//      requests[0].flush([]);
//      requests[1].flush([{id: 1, name: 'bob'}]);
//      requests[2].flush(expectedSubmitTrxs);
//    });
//  });

//  describe('#updateSubmitTrx', () => {
//    // Expecting the query form of URL so should not 404 when id not found
//    const makeUrl = (id: number) => `${submitTrxService.submitTrxsUrl}/?id=${id}`;

//    it('should update a submitTrx and return it', () => {

//      const updateSubmitTrx: SubmitTrx = { submitTrxId: 1, submitTrxName: 'A', fundBalance: 0, workingCurrency: 'USD' };

//      submitTrxService.updateSubmitTrx(updateSubmitTrx).subscribe(
//        data => expect(data).toEqual(updateSubmitTrx, 'should return the submitTrx'),
//        fail
//      );

//      // SubmitTrxService should have made one request to PUT submitTrx
//      const req = httpTestingController.expectOne(submitTrxService.submitTrxsUrl);
//      expect(req.request.method).toEqual('PUT');
//      expect(req.request.body).toEqual(updateSubmitTrx);

//      // Expect server to return the submitTrx after PUT
//      const expectedResponse = new HttpResponse(
//        { status: 200, statusText: 'OK', body: updateSubmitTrx });
//      req.event(expectedResponse);
//    });

//    // This service reports the error but finds a way to let the app keep going.
//    it('should turn 404 error into return of the update submitTrx', () => {
//      const updateSubmitTrx: SubmitTrx = { submitTrxId: 1, submitTrxName: 'A', fundBalance: 0, workingCurrency: 'USD' };

//      submitTrxService.updateSubmitTrx(updateSubmitTrx).subscribe(
//        data => expect(data).toEqual(updateSubmitTrx, 'should return the update submitTrx'),
//        fail
//      );

//      const req = httpTestingController.expectOne(submitTrxService.submitTrxsUrl);

//      // respond with a 404 and the error message in the body
//      const msg = 'deliberate 404 error';
//      req.flush(msg, {status: 404, statusText: 'Not Found'});
//    });
//  });

//  // TODO: test other SubmitTrxService methods
//});
