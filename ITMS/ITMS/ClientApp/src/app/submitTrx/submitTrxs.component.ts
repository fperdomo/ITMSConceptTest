import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Input, TemplateRef  } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalModule, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertsService } from 'angular-alert-module';
import { AlertsModule } from 'angular-alert-module';


import { SubmitTrx, SubmitTrxDetail } from './submitTrx';
import { SubmitTrxsService } from './submitTrxs.service';


@Component({
  selector: 'app-submitTrxs',
  templateUrl: './submitTrxs.component.html',
  providers: [ SubmitTrxsService ],
  styleUrls: ['./submitTrxs.component.css']
})
export class SubmitTrxsComponent implements OnInit {
 
  message: string;
  registerForm: FormGroup;
  submitted = false;
<<<<<<< HEAD
  currencies: ['USD', 'EUR'];
  @Input() toCompanyId: string;
=======
  currency: any = "USD";
  currencies: any = ["USD", "EUR"];
  @Input('toCompanyId') toCompanyId: string;
  @Input('modalRef') modalRef: BsModalRef;
 
>>>>>>> 70de34d6be6936c62c17e8d7c683fe24e552aadc

  constructor(private submitTrxsService: SubmitTrxsService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private alerts: AlertsService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      requestId: ['', Validators.required],
      toCompanyId: [this.toCompanyId, Validators.required],
      currency: ['', Validators.required],
      amount: ['', Validators.required],
      description: [''],

    });
    
    this.registerForm.controls['requestId'].setValue(this.makeRequestId());

    this.alerts.setDefaults('timeout', 0);
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
      .subscribe(submiit => {
        this.alerts.setMessage('POST Transaction Success', 'success');
        this.modalRef.hide();
      }
      );    
  }
  
  decline(): void {    
    this.modalRef.hide();
  }
}
