import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Transaction, TransactionDetail } from './transaction';
import { TransactionsService } from './transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  providers: [TransactionsService],
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  displayedColumns = ['requestId', 'fromCompany', 'toCompany', 'state',
    'details.currency', 'details.amount', 'details.date', 'details.description', 'details.reasonsRejected', 'actions'];
  transactions: Transaction[] = [];
  editTransaction: Transaction; // the transaction currently being edited
  dataSource: MatTableDataSource<Transaction>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private transactionsService: TransactionsService) { }

  ngOnInit() {
    this.getTransactions();

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getTransactions(): void {
    this.transactionsService.getTransactions()
      .subscribe(transactions => {

        this.dataSource = new MatTableDataSource(transactions);
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'details.currency': return item.details.currency;
            case 'details.amount': return item.details.amount;
            case 'details.date': return item.details.date;
            case 'details.description': return item.details.description;
            case 'details.reasonsRejected': return item.details.reasonsRejected;
            default: return item[property];
          }
        };
        this.transactions = transactions;

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }


  edit(transaction) {
    this.editTransaction = transaction;
  }

  search(searchTerm: string) {
    this.editTransaction = undefined;
    if (searchTerm) {
      this.transactionsService.searchTransactions(searchTerm)
        .subscribe(transactions => this.transactions = transactions);
    }
  }

  actionUpdateTrx(transaction: Transaction): void {
    alert(transaction.requestId);
  }

  companyToStr(companyName : string) {
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
