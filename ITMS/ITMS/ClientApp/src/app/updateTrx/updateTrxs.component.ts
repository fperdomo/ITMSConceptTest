import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Input, TemplateRef  } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalModule, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertsService } from 'angular-alert-module';


import { UpdateTrx } from './updateTrx';
import { UpdateTrxsService } from './updateTrxs.service';


@Component({
  selector: 'app-updateTrxs',
  templateUrl: './updateTrxs.component.html',
  providers: [ UpdateTrxsService ],
  styleUrls: ['./updateTrxs.component.css']
})
export class UpdateTrxsComponent implements OnInit {
 
  message: string;
  registerForm: FormGroup;
  updateted = false;
  state: any = "APPROVED";
  states: any = ["APPROVED", "REJECTED"];
  @Input('requestId') requestId: string;
  @Input('modalRef') modalRef: BsModalRef;
 

  constructor(private updateTrxsService: UpdateTrxsService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private alerts: AlertsService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      requestId: [this.requestId, Validators.required],
      state: ['', Validators.required],
      reasonsRejected: [''],

    });
    
     this.alerts.setDefaults('timeout', 0);
  }
 
  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.updateted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
   

    const newUpdateTrx: UpdateTrx =
      {
        $class: "com.itms.UpdateTrasferRequest",
        requestId: this.registerForm.controls["requestId"].value,
        state: this.registerForm.controls["state"].value,
        reasonsRejected: this.registerForm.controls["reasonsRejected"].value,
        transactionId: "",
        timestamp: new Date()
      } as UpdateTrx;

    this.updateTrxsService.addUpdateTrx(newUpdateTrx)
      .subscribe(submiit => {
        this.alerts.setMessage('Update Transaction Success', 'success');
        this.modalRef.hide();
      }
      );    
  }
  
  decline(): void {    
    this.modalRef.hide();
  }
}
