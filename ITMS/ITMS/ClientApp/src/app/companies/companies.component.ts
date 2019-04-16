import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ModalModule, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertsService } from 'angular-alert-module';

import { Company, PrepareSettlement, Rate } from './company';
import { CompaniesService } from './companies.service';
import { SubmitTrxsComponent } from '../submitTrx/submitTrxs.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  providers: [ CompaniesService ],
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  displayedColumns = ['companyId', 'companyName', 'workingCurrency', 'fundBalance', 'actions'];
  companies: Company[] = [];
  editCompany: Company; // the company currently being edited
  dataSource: MatTableDataSource<Company>;
  showSubmitTrxs= false;
  @ViewChild(SubmitTrxsComponent) submitTrx;
  toCompanyId = "";
  modalRef: BsModalRef;
  message: string;
  rateArray: Rate[] = [];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private companiesService: CompaniesService, private modalService: BsModalService, private alerts: AlertsService) { }

  ngOnInit() {
    this.getCompanies();
    
  }  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getCompanies(): void {
    this.companiesService.getCompanies()
      .subscribe(companies => {
        this.dataSource = new MatTableDataSource(companies);
        this.companies = companies;

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      });
  }


  search(searchTerm: string) {
    this.editCompany = undefined;
    if (searchTerm) {
      this.companiesService.searchCompanies(searchTerm)
        .subscribe(companies => this.companies = companies);
    }
  }
  
  openModalSubmitTrx(company: Company, template: TemplateRef<any>) {
    this.toCompanyId = company.companyId.toString();
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  openModalPrepareSettlement(company: Company, template: TemplateRef<any>) {
    this.toCompanyId = company.companyId.toString();
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  confirmPrepareSettlement(): void {
    const newRate: Rate = {
      $class: "com.itms.Transfer",
      to: "EUR",
      rate: 0.75
    };

    this.rateArray = [newRate];


    const newPrepareSettlement: PrepareSettlement =
      {
        $class: "com.itms.PrepareSettlement",
        batchId: this.makeRequestPrepId(),
        companyId: this.toCompanyId,
        timestamp: new Date(),
        transactionId: "",
        rates: this.rateArray
      } as PrepareSettlement;

    this.companiesService.actionPrepareSettlement(newPrepareSettlement)
      .subscribe(submiit => {
        this.alerts.setMessage('PrepareSettlement Transaction Success', 'success');
        this.alerts.setMessage('WARNING: ExchangeRate is Hardcode', 'warn');
        this.modalRef.hide();
      }
      );    
  }

  makeRequestPrepId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }


  toggleSubmitTrx(company: Company) {
     this.toCompanyId = company.companyId.toString();
     this.showSubmitTrxs = true;
  }
  
  declinePrepareSettlement(): void {
    this.modalRef.hide();
  }

  

}
