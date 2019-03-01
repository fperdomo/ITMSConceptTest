import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Input, TemplateRef  } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalModule, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { SubmitTrx, SubmitTrxDetail } from './submitTrx';
import { SubmitTrxsService } from './submitTrxs.service';

@Component({
  selector: 'app-submitTrxs',
  templateUrl: './submitTrxs.component.html',
  providers: [ SubmitTrxsService ],
  styleUrls: ['./submitTrxs.component.css']
})
export class SubmitTrxsComponent implements OnInit {
  modalRef: BsModalRef;
  message: string;
  registerForm: FormGroup;
  submitted = false;
  currency: any = "USD";
  currencies: any = ["USD", "EUR"];
  @Input('toCompanyId') toCompanyId: string;

  constructor(private submitTrxsService: SubmitTrxsService, private formBuilder: FormBuilder, private modalService: BsModalService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      requestId: ['', Validators.required],
      toCompanyId: [this.toCompanyId, Validators.required],
      currency: ['', Validators.required],
      amount: ['', Validators.required],
      description: [''],
    });


   this.registerForm.controls['requestId'].setValue(this.makeRequestId());
  }

  makeRequestId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    const newDetails: SubmitTrxDetail = {
      $class: "com.itms.Transfer",
      currency: this.registerForm.controls["currency"].value,
      amount: this.registerForm.controls["amount"].value,
      date: new Date(),
      description: this.registerForm.controls["description"].value,
      reasonsRejected: ""
    }

    const newSubmitTrx: SubmitTrx =
      {
        $class: "com.itms.SubmitTransferRequest",
        requestId: this.registerForm.controls["requestId"].value,
        toCompanyId: this.registerForm.controls["toCompanyId"].value,
        details: newDetails
      } as SubmitTrx;

    this.submitTrxsService.addSubmitTrx(newSubmitTrx)
      .subscribe(submiit => alert('SUCCESS!! :-)' + submiit.requestId));

    
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }
}
