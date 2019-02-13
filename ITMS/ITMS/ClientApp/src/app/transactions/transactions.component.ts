import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Transaction } from './transaction';
import { TransactionsService } from './transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  providers: [ TransactionsService ],
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  displayedColumns = ['transactionId', 'transactionName', 'workingCurrency', 'fundBalance', 'btnSubmitTrx', 'btnPreSett'];
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
        this.transactions = transactions;

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  add(transactionName: string): void {
    this.editTransaction = undefined;
    transactionName = transactionName.trim();
    if (!transactionName) { return; }

    // The server will generate the id for this new transaction
    const newTransaction: Transaction = { transactionName } as Transaction;
    this.transactionsService.addTransaction(newTransaction)
      .subscribe(transaction => this.transactions.push(transaction));
  }

  delete(transaction: Transaction): void {
    this.transactions = this.transactions.filter(h => h !== transaction);
    this.transactionsService.deleteTransaction(transaction.transactionId).subscribe();
    /*
    // oops ... subscribe() is missing so nothing happens
    this.transactionsService.deleteTransaction(transaction.id);
    */
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

  update() {
    if (this.editTransaction) {
      this.transactionsService.updateTransaction(this.editTransaction)
        .subscribe(transaction => {
          // replace the transaction in the transactions list with update from server
          const ix = transaction ? this.transactions.findIndex(h => h.transactionId === transaction.transactionId) : -1;
          if (ix > -1) { this.transactions[ix] = transaction; }
        });
      this.editTransaction = undefined;
    }
  }

  actionSubmitTrx(transaction: Transaction): void {
    alert(transaction.transactionId);
  }

  actionPreSett(transaction: Transaction): void {
    alert("LALALA" + transaction.transactionId);
  }
}
