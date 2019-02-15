export interface SubmitTrx {
  class: string; //"com.itms.SubmitTransferRequest";
  requestId: number;
  toCompanyId: string;
  details: SubmitTrxDetail;
}

export interface SubmitTrxDetail {
  class: string; //"com.itms.Transfer",
  currency: string; 
  amount: number;
  date: Date;
  description: string;
  reasonsRejected: string;
}
