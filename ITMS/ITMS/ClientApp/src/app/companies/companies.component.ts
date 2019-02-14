import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Company } from './company';
import { CompaniesService } from './companies.service';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private companiesService: CompaniesService) { }

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
        this.dataSource.sort(<MatSortable>{
          id: 'id',
          start: 'desc'
        }
        );x
      });
  }

  add(companyName: string): void {
    this.editCompany = undefined;
    companyName = companyName.trim();
    if (!companyName) { return; }

    // The server will generate the id for this new company
    const newCompany: Company = { companyName } as Company;
    this.companiesService.addCompany(newCompany)
      .subscribe(company => this.companies.push(company));
  }

  delete(company: Company): void {
    this.companies = this.companies.filter(h => h !== company);
    this.companiesService.deleteCompany(company.companyId).subscribe();
    /*
    // oops ... subscribe() is missing so nothing happens
    this.companiesService.deleteCompany(company.id);
    */
  }

  edit(company) {
    this.editCompany = company;
  }

  search(searchTerm: string) {
    this.editCompany = undefined;
    if (searchTerm) {
      this.companiesService.searchCompanies(searchTerm)
        .subscribe(companies => this.companies = companies);
    }
  }

  update() {
    if (this.editCompany) {
      this.companiesService.updateCompany(this.editCompany)
        .subscribe(company => {
          // replace the company in the companies list with update from server
          const ix = company ? this.companies.findIndex(h => h.companyId === company.companyId) : -1;
          if (ix > -1) { this.companies[ix] = company; }
        });
      this.editCompany = undefined;
    }
  }

  actionSubmitTrx(company: Company): void {
    alert(company.companyId);
  }

  actionPreSett(company: Company): void {
    alert("LALALA" + company.companyId);
  }
}
