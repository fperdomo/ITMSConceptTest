import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
 
  showCompanies = false;
  showTransactions = false;
  showBatchTransfers = false;
  showSubmitTrxs = false;


  toggleCompanies() {
    this.showCompanies = true;
    this.showTransactions = false;
    this.showBatchTransfers = false;
    this.showSubmitTrxs = false;
  }

  toggleTransactions() {
    this.showCompanies = false;
    this.showTransactions = true;
    this.showBatchTransfers = false;
    this.showSubmitTrxs = false;
  }

  toggleBatchTransfers() {
    this.showCompanies = false;
    this.showTransactions = false;
    this.showBatchTransfers = true;
    this.showSubmitTrxs = false;
  }


}
