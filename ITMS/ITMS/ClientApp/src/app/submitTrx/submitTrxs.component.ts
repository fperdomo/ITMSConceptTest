import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { SubmitTrx } from './submitTrx';
import { SubmitTrxsService } from './submitTrxs.service';

@Component({
  selector: 'app-submitTrxs',
  templateUrl: './submitTrxs.component.html',
  providers: [ SubmitTrxsService ],
  styleUrls: ['./submitTrxs.component.css']
})
export class SubmitTrxsComponent implements OnInit {
  displayedColumns = ['submitTrxId', 'submitTrxName', 'workingCurrency', 'fundBalance', 'actions'];
  submitTrxs: SubmitTrx[] = [];
  editSubmitTrx: SubmitTrx; // the submitTrx currently being edited
  dataSource: MatTableDataSource<SubmitTrx>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private submitTrxsService: SubmitTrxsService) { }

  ngOnInit() {
    this.getSubmitTrxs();
    
  }  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getSubmitTrxs(): void {
    this.submitTrxsService.getSubmitTrxs()
      .subscribe(submitTrxs => {
        this.dataSource = new MatTableDataSource(submitTrxs);
        this.submitTrxs = submitTrxs;

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      });
  }

  //add(submitTrxName: string): void {
  //  this.editSubmitTrx = undefined;
  //  submitTrxName = submitTrxName.trim();
  //  if (!submitTrxName) { return; }

  //  // The server will generate the id for this new submitTrx
  //  const newSubmitTrx: SubmitTrx = { submitTrxName } as SubmitTrx;
  //  this.submitTrxsService.addSubmitTrx(newSubmitTrx)
  //    .subscribe(submitTrx => this.submitTrxs.push(submitTrx));
  //}

  //delete(submitTrx: SubmitTrx): void {
  //  this.submitTrxs = this.submitTrxs.filter(h => h !== submitTrx);
  //  this.submitTrxsService.deleteSubmitTrx(submitTrx.submitTrxId).subscribe();
  //  /*
  //  // oops ... subscribe() is missing so nothing happens
  //  this.submitTrxsService.deleteSubmitTrx(submitTrx.id);
  //  */
  //}

  edit(submitTrx) {
    this.editSubmitTrx = submitTrx;
  }

  search(searchTerm: string) {
    this.editSubmitTrx = undefined;
    if (searchTerm) {
      this.submitTrxsService.searchSubmitTrxs(searchTerm)
        .subscribe(submitTrxs => this.submitTrxs = submitTrxs);
    }
  }

  //update() {
  //  if (this.editSubmitTrx) {
  //    this.submitTrxsService.updateSubmitTrx(this.editSubmitTrx)
  //      .subscribe(submitTrx => {
  //        // replace the submitTrx in the submitTrxs list with update from server
  //        const ix = submitTrx ? this.submitTrxs.findIndex(h => h.submitTrxId === submitTrx.submitTrxId) : -1;
  //        if (ix > -1) { this.submitTrxs[ix] = submitTrx; }
  //      });
  //    this.editSubmitTrx = undefined;
  //  }
  //}

  //actionSubmitTrx(submitTrx: SubmitTrx): void {
  //  alert(submitTrx.submitTrxId);
  //}

  //actionPreSett(submitTrx: SubmitTrx): void {
  //  alert("LALALA" + submitTrx.submitTrxId);
  //}
}
