import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { BatchTransfer } from './batchTransfer';
import { BatchTransfersService } from './batchTransfers.service';

@Component({
  selector: 'app-batchTransfers',
  templateUrl: './batchTransfers.component.html',
  providers: [ BatchTransfersService ],
  styleUrls: ['./batchTransfers.component.css']
})
export class BatchTransfersComponent implements OnInit {
  displayedColumns = ['batchId', 'state', 'settlement.currency', 'settlement.amount', 'settlement.date', 'settlement.creditor',
    'settlement.debtor', 'rates[0].to', 'rates[0].rate', 'actions'];
  batchTransfers: BatchTransfer[] = [];
  editBatchTransfer: BatchTransfer; // the batchTransfer currently being edited
  dataSource: MatTableDataSource<BatchTransfer>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private batchTransfersService: BatchTransfersService) { }

  ngOnInit() {
    this.getBatchTransfers();
    
  }  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getBatchTransfers(): void {
    this.batchTransfersService.getBatchTransfers()
      .subscribe(batchTransfers => {
        this.dataSource = new MatTableDataSource(batchTransfers);
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            /*
 displayedColumns = ['batchId', 'state', 'settlement.currency', 'settlement.amount', 'settlement.date', 'settlement.creditor',
    'settlement.debtor', 'rates[0].to', 'rates[0].rate', 'actions'];
*/
            case 'settlement.currency': return item.settlement.currency;
            case 'settlement.amount': return item.settlement.amount;
            case 'settlement.date': return item.settlement.date;
            case 'settlement.creditor': return item.settlement.creditor;
            case 'settlement.debtor': return item.settlement.debtor;
            case 'rates[0].to': return item.rates[0].to;
            case 'rates[0].rate': return item.rates[0].rate;
            default: return item[property];
          }
        };

        this.batchTransfers = batchTransfers;

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  

  search(searchTerm: string) {
    this.editBatchTransfer = undefined;
    if (searchTerm) {
      this.batchTransfersService.searchBatchTransfers(searchTerm)
        .subscribe(batchTransfers => this.batchTransfers = batchTransfers);
    }
  }

  update() {
    if (this.editBatchTransfer) {
      this.batchTransfersService.updateBatchTransfer(this.editBatchTransfer)
        .subscribe(batchTransfer => {
          // replace the batchTransfer in the batchTransfers list with update from server
          const ix = batchTransfer ? this.batchTransfers.findIndex(h => h.batchId === batchTransfer.batchId) : -1;
          if (ix > -1) { this.batchTransfers[ix] = batchTransfer; }
        });
      this.editBatchTransfer = undefined;
    }
  }

  actionTransferFunds(batchTransfer: BatchTransfer): void {
    alert(batchTransfer.batchId);
  }

  actionCompleteSettlement(batchTransfer: BatchTransfer): void {
    alert("LALALA" + batchTransfer.batchId);
  }

  companyToStr(companyName: string) {
    return companyName.split("#")[1];
  }


  getDateInFormat(stringDate: string) {
    var d = new Date(stringDate);

    var date = d.getDate();
    var dateStr = date.toString();
    if (date < 10)
      dateStr = "0" + date;

    var month = d.getMonth(); //Be careful! January is 0 not 1
    month = month + 1;
    var monthStr = month.toString();
    if (month < 10)
      monthStr = "0" + month;

    var year = d.getFullYear();

    var minutes = d.getMinutes().toString().length === 1 ? '0' + d.getMinutes() : d.getMinutes().toString();
    var hours = d.getHours().toString().length === 1 ? '0' + d.getHours() : d.getHours().toString();
    return year + "/" + monthStr + "/" + dateStr + ' ' + hours + ':' + minutes;
  }
}
